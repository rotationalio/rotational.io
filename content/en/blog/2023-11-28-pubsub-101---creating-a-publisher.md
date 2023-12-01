---
title: "PubSub 101 - Creating a Publisher"
slug: "pubsub-101---creating-a-publisher"
date: "2023-11-28T09:25:01-06:00"
draft: false
image: img/blog/press.jpg
photo_credit: "Photo by Bank Phrom on Unsplash"
authors: ['Patrick Deziel']
profile: img/team/patrick-deziel.png
tags: ['Ensign', 'Ingestion', 'PubSub 101']
description: "In this module you will create a real-time publisher that queries an API and publishes flight data to Ensign."
---

One of the first steps in every data science or machine learning project is data ingestion. In this module, you will use Python to create a publisher to ingest real-time data into Ensign.

<!--more-->

Check out the previous modules in this series if you haven't already! [Module 1](https://rotational.io/blog/pubsub-101---creating-your-project/) shows how to set up your Ensign project, [Module 2](https://rotational.io/blog/pubsub-101---using-the-python-sdk/) gets you started with the PyEnsign SDK, and [Module 3](https://rotational.io/blog/pubsub-101---creating-data-flows-with-topics/) helps you create your first topic.

Want to skip to the full code example for this module? You can find it [here](https://github.com/rotationalio/ensign-examples/tree/main/courses/pubsub_101/module_4_creating_a_publisher).


## What is a Publisher?

In Ensign, a publisher is a little piece of code that writes data as a series of `events` to one or more `topics`. If you followed along with [Module 2](https://rotational.io/blog/pubsub-101---using-the-python-sdk/), congrats! You've already written your first publisher. In practice, publishers can do a lot of ingestion-related work on your behalf for a variety of purposes. Here are a few examples of the different types of publishers that you could write for Ensign:

1. Poll a REST API of weather data every 5 minutes and publish JSON weather updates to a topic.
2. Subscribe to a websocket API for stock trades and publish real-time ticker prices to a topic for data visualization.
3. Publish web requests and errors from your backend server(s) so you can monitor user activity on your web application.
4. Process video frames from a security camera feed and publish an event when a figure is detected.
5. Subscribe to an Ensign topic containing user reviews and publish sentiment scores to another topic.

Let's return to our flight tracker example that we've been working on through the last few modules and write some code to publish real-time flight updates.

## Creating a Flights Publisher

Recall the data flows design we created in [Module 3](https://rotational.io/blog/pubsub-101---creating-data-flows-with-topics/). In this module we will write the Python code that reads from the flights API and publishes updates to the `flight-updates` topic.

!["Data Flows"](/img/blog/2023-11-20-pubsub-101---creating-data-flows-with-topics/topics.png)

⚠️ WARNING: To obtain access to real-time flight data, you will need to create an OpenSky network account (at the time of writing it's free) by registering [here](https://opensky-network.org/index.php?option=com_users&view=registration). Please do that first before moving on to the next section!

Now that you've registered for your OpenSky username and password, we're ready to proceed. We could write the HTTP requests directly, but to make our lives easier we'll use the [python-opensky](https://github.com/joostlek/python-opensky) library, so go ahead and install that now.

```
$ pip install async-timeout
$ pip install python-opensky
```

_Note: You can also install OpenSky's official [python implementation](https://github.com/openskynetwork/opensky-api) but it might not be compatible with the code in this module._

### Publisher Class

In Python, classes are a helpful way to organize code, especially if this will eventually run in production. So let's create a `publisher.py` with a `FlightsPublisher` class.

```python
import os
import json
import asyncio
from datetime import datetime

from pyensign.events import Event
from pyensign.ensign import Ensign
from aiohttp import ClientSession, BasicAuth
from python_opensky import OpenSky, BoundingBox

class FlightsPublisher:
    def __init__(
        self,
        topic="flight-positions",
        min_latitude=-66,
        max_latitude=49,
        min_longitude=-124,
        max_longitude=24,
        interval=60,
    ):
        self.topic = topic
        self.bounding_box = BoundingBox(
            min_latitude=min_latitude,
            max_latitude=max_latitude,
            min_longitude=min_longitude,
            max_longitude=max_longitude,
        )
        self.interval = interval
        self.ensign = Ensign()
        self.opensky_creds = BasicAuth(
            login=os.environ['OPENSKY_USERNAME'],
            password=os.environ['OPENSKY_PASSWORD']
        )
```

Here we setup a few class variables:

1. `topic`: The topic our publisher will publish to
2. `bounding_box`: The bounding box coordinates for querying the OpenSky API (what area to query for flights over)
3. `interval`: The interval to wait in between polling for flight updates
4. `ensign`: The Ensign client configured with API credentials from the environment
5. `opensky_creds`: OpenSky API credentials obtained from the environment

### Creating Events

The OpenSky API returns multiple flight "vectors" per response, so it will be helpful to write a function to turn the vectors into serializable `events`.

```python
    def vectors_to_events(self, vectors):
        for vector in vectors:
            data = {
                "icao24": vector.icao24,
                "callsign": vector.callsign,
                "origin_country": vector.origin_country,
                "time_position": vector.time_position,
                "last_contact": vector.last_contact,
                "longitude": vector.longitude,
                "latitude": vector.latitude,
                "geo_altitude": vector.geo_altitude,
                "on_ground": vector.on_ground,
                "velocity": vector.velocity,
                "true_track": vector.true_track,
                "vertical_rate": vector.vertical_rate,
                "sensors": vector.sensors,
                "barometric_altitude": vector.barometric_altitude,
                "transponder_code": vector.transponder_code,
                "special_purpose_indicator": vector.special_purpose_indicator,
                "position_source": vector.position_source,
                "category": vector.category,
            }
            yield Event(
                data=json.dumps(data).encode("utf-8"),
                mimetype="application/json",
                schema_name="FlightVector",
                schema_version="0.1.0",
            )
```

This function takes an iterable of vectors and returns a generator of JSON-encoded flight updates. It's best practice to include a `schema_name` and `schema_version` (as a [semantic version](https://semver.org/)) if possible; it will be useful later on if the API changes or you decide that you want to include more metadata, so subscribers know what to expect in each `event`.

_Pro Tip: For data streaming, it's often more efficient to use generator patterns with `yield` rather than collecting all the events in a list in memory. Your RAM will thank you!_

### The Publish Loop

In each iteration of the main loop we will call the API, publish all the flight vectors as `events` to Ensign, then wait for a bit to stay under the API rate limits.

```python
    async def recv_and_publish(self):
        # Create topic if it doesn't exist
        await self.ensign.ensure_topic_exists(self.topic)

        async with ClientSession() as session:
            async with OpenSky(session=session) as opensky:
                opensky.authenticate(self.opensky_creds)

                while True:
                    # Call the OpenSky API to get flight vectors in the bounding box
                    try:
                        response = await opensky.get_states(
                            bounding_box=self.bounding_box
                        )
                    except Exception as e:
                        print(e)
                        await asyncio.sleep(self.interval)
                        continue

                    # Publish each flight vector to Ensign
                    for event in self.vectors_to_events(response.states):
                        await self.ensign.publish(
                            self.topic,
                            event,
                            on_ack=self.print_ack,
                            on_nack=self.print_nack
                        )

                    await asyncio.sleep(self.interval)
```

Note the `on_ack` and `on_nack` arguments on the `publish` function. These are optional but allow you to specify callbacks when Ensign acknowledges an `event`, meaning it has been committed to the topic, and when Ensign fails to commit an `event` (a negative acknowledgement). Here we'll define some callbacks that just print out the `acks` and `nacks`.

```python
    async def print_ack(self, ack):
        print(f"Event committed with ack: {ack}")

    async def print_nack(self, nack):
        print(f"Event was not committed with error {nack.code}: {nack.error}")
```

### Finishing up the Publisher

Finally we need some `asyncio` boilerplate so we can execute the publish loop from the command line.

```python
    def run(self):
        asyncio.run(self.recv_and_publish())

if __name__ == "__main__":
    publisher = FlightsPublisher()
    publisher.run()
```

If you need to look at the complete code, it's available [here](https://github.com/rotationalio/ensign-examples/tree/main/courses/pubsub_101/module_4_creating_a_publisher).

## Running the Publisher

Before running the publisher, make sure you have the following environment variables configured!

```
$ export ENSIGN_CLIENT_ID=<my-client-id>
$ export ENSIGN_CLIENT_SECRET=<my-client-secret>
$ export OPENSKY_USERNAME=<my-opensky-username>
$ export OPENSKY_PASSWORD=<my-opensky-password>
```

Now run the publisher to start publishing `events`!

```
$ python publisher.py
```

If everything worked, you should see several events being committed (remember the output is coming from the `print_ack` handler).

```python
Event committed with ack: id: "\001\214\035\004ju\267\335<\204G\014-\234\030V"
committed {
  seconds: 1701293878
  nanos: 211286609
}

Event committed with ack: id: "\001\214\035\004ju\200\232\357M\313\345\320\366\007\324"
committed {
  seconds: 1701293878
  nanos: 213323032
}

Event committed with ack: id: "\001\214\035\004jv\251\035]u\034i7.\033k"
committed {
  seconds: 1701293878
  nanos: 215672990
}
```

How do we know if it worked? The easiest way is to open the [project dashboard](https://rotational.app/app/projects) and navigate to your project, and then the `flight-positions` topic. On this page you can see how many events were published to the topic and run a query to view the actual events.

!["Topic Dashboard"](/img/blog/2023-11-28-pubsub-101---creating-a-publisher/topic_dashboard.png)

## To be continued...

Now that you have a flights publisher, in the next module you'll write a subscriber to consume the flight updates in real time!