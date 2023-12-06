---
title: "PubSub 101 - Creating a Subscriber"
slug: "pubsub-101---creating-a-subscriber"
date: "2023-12-05T15:22:27-06:00"
draft: false
image: img/blog/newspaper.jpg
photo_credit: "Photo by Roman Kraft on Unsplash"
authors: ['Patrick Deziel']
profile: img/team/patrick-deziel.png
tags: ['Ensign', 'Online Learning', 'PubSub 101']
description: "In this module you will create a subscriber that reads real-time flight data and trains an online ML model."
---

With the rise of LLMs and Retrieval Augmented Generation (RAG), online models have never been more relevant. Here's how to write some Python code to interpret real-time data and build your own adaptive online model.

<!--more-->

This module assumes that you have completed the previous modules in this series, so take a look at those if you haven't already! [Module 1](https://rotational.io/blog/pubsub-101---creating-your-project/) shows how to set up your Ensign project, [Module 2](https://rotational.io/blog/pubsub-101---using-the-python-sdk/) gets you started with the PyEnsign SDK, [Module 3](https://rotational.io/blog/pubsub-101---creating-data-flows-with-topics/) helps you create your first topic, and [Module 4](https://rotational.io/blog/pubsub-101---creating-a-publisher/) walks you through creating a real-time publisher.

If you just want the full code example for this module, you can find it [here](https://github.com/rotationalio/ensign-examples/tree/main/courses/pubsub_101/module_5_creating_a_subscriber).

## Ensign Subscribers

In Ensign, a subscriber is just a piece of code that listens on one or more `topics` for `events`. The subscriber decides what to do with each `event` -- whether to log it, or persist it to storage, or perform some processing and publish a transformation of the event to a different topic. Here are a few examples of different types of subscribers you could write using Ensign.

1. Subscribe to a topic with weather updates and display weather notifications to users.
2. Subscribe to a topic with stock trades and train an online model to predict future price movement.
3. Subscribe to a topic with backend logs and another topic with frontend errors to perform log aggregation and incident correlation across multiple systems.
4. Subscribe to a topic with raw news articles, perform preprocessing, and publish the cleaned data to a second topic to create a training corpus for an LLM.

In event-driven architectures, most subscribers are also publishers. You can think of them like "handlers" or "transformers" that receive data on a topic and transform it into a different domain or format.

## Creating a Flights Subscriber

Let's return to the flight tracker project. We are going to need a `subscriber` that consumes flight positions from the `flight-updates` topic and incrementally trains the model.

!["Data Flows"](/img/blog/2023-11-20-pubsub-101---creating-data-flows-with-topics/topics.png)

To train the online models, we'll use the Python package [river](https://riverml.xyz/latest/) which has a convenient API to train models _incrementally_.

```
$ pip install river
```

### Subscriber Class

The subscriber configuration is a bit simpler than the publisher because the data source will be coming from an Ensign topic. We just need to include which topic to consume the flights updates from and which topics to publish the models and arrival predictions to.

```python
import json
import pickle
import asyncio
from pyensign.events import Event
from pyensign.ensign import Ensign
from river import compose, linear_model, preprocessing

class FlightsSubscriber:
    def __init__(
       self,
       flights_topic="flight-positions",
       models_topic="arrival-models",
       predictions_topic="arrival-predictions"
    ):
        self.flight_topic = flights_topic
        self.models_topic = models_topic
        self.predictions_topic = predictions_topic
        self.ensign = Ensign()
        self.model = compose.Pipeline(
            preprocessing.StandardScaler(),
            linear_model.LinearRegression()
        )
```

Note we have also created a model pipeline with `river` that scales the input and adds a linear regression estimator, simliar to how you would create a pipeline with [scikit-learn](https://scikit-learn.org/stable/modules/generated/sklearn.pipeline.Pipeline.html).

### Training the Model

Let's start small and see if we can train a model to predict the trend of aircraft velocity based on a few of the features in the data: `barometric_altitude`, `latitude`, `longitude`, and `true_track`. Knowing that, we can create a function that predicts and learns on a single instance.

```python
    def predict_velocity(self, vector):
        # Get the features for training
        features = {
            "barometric_altitude": vector.barometric_altitude,
            "latitude": vector.latitude,
            "longitude": vector.longitude,
            "true_track": vector.true_track,
        }

        # Obtain the prior prediction and update the model
        velocity_pred = self.model.predict_one(features)
        self.model.learn_one(features, vector.velocity)

        # Return the true value and the prediction
        return vector.velocity, velocity_pred
```

### Subscribe Loop

In the main subscribe loop, the process will wait for a new event on the stream. For each event, we simply predict the next velocity and publish to the downstream topics. To make the implementation simpler, we'll only care about tracking a single flight for now.

```python
    async def run(self):
        self.callsign = ""

        async for event in self.ensign.subscribe(self.flights_topic):
            print("received flight vector", vector)

            # Decode the event data into the vector
            vector = json.loads(event.data)

            # Look for the callsign which indicates the flight we are interested in
            callsign = vector["callsign"].strip()
            if self.callsign == "":
                self.callsign = callsign

            if self.callsign == callsign:
                # Get the true velocity and the prediction
                velocity, velocity_pred = self.predict_velocity(vector)

                # Publish the prediction along with the true value
                pred_data = {
                    "predicted_velocity": velocity_pred,
                    "true_velocity": velocity,
                }
                pred_event = Event(
                    data=json.dumps(pred_data).encode("utf-8"),
                    mimetype="application/json",
                    schema_name="VelocityPrediction",
                    schema_version="0.1.0"
                )
                model_event = Event(
                    data=pickle.dumps(self.model),
                    mimetype="application/python-pickle",
                    schema_name="VelocityModel",
                    schema_version="0.1.0"
                )

                await self.ensign.publish(self.predictions_topic, pred_event)
                await self.ensign.publish(self.models_topic, model_event)

                print("published prediction event", pred_event)
                print("published model event", model_event)
```

### Finishing up the Subscriber

Finally we need some `asyncio` boilerplate in order to execute the publish loop from the command line.

```python
if __name__ == "__main__":
    subscriber = FlightsSubscriber()
    asyncio.run(subscriber.run())
```

## Running the Subscriber

At this point you should be able to run the subscriber, but make sure you have your environment variables configured first!

```
$ export ENSIGN_CLIENT_ID=<my-client-id>
$ export ENSIGN_CLIENT_SECRET=<my-client-secret>
```

Now run the subscriber to start consuming the flight position `events`!

```
$ python subscriber.py
```

Wait, why aren't there any events coming in? Remember that by default the Ensign subscriber only consumes the `real-time` events. So if you have already published some events to the topic you might not see them (don't worry, in the next module you'll learn how to retrieve _historical_ events). In order to test out the subscriber, you'll also have to run the publisher you created in the previous module in a second terminal window (remember to set the `OPENSKY_USERNAME` and `OPENSKY_PASSWORD` environment variables).

```
$ python publisher.py
```

If everything worked, you should see the subscriber printing out the flight vectors, the published predictions, and the published models. You can also view the events in the [project dashboard](https://rotational.app/app/projects) by navigating to the page for each topic.

## Extra Credit

If you're looking for a challenge, tinker with the model and try to improve it! For example, features like latitude and longitude are probably not likely to be predictive of velocity so you could find a different API (e.g. with weather data) and create a new data stream. Then in the subscriber, you can subscribe to that data stream and cross-reference with the flight data to include weather features in the model. If you build something cool, let us know and we'll send you a t-shirt!

## To be continued...

In the next module, you'll learn how to query historical data from a topic stream using SQL.