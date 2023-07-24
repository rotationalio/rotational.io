---
title: "Opensky"
slug: "opensky"
subtitle: "Flight Data"
draft: false
image: img/data-playground/opensky.png
github_link: https://github.com/rotationalio/data-playground/tree/main/opensky
description: OpenSky provides flight data by aircraft along with arrivals and departures by airport.
summary: Connect to flight data and start experimenting with aviation models and apps.
license: Free
producer_name: OpenSky
producer_link: https://openskynetwork.github.io/opensky-api/
is_api_key_required: false
api_type: REST
sdks: Python API, Java API
limits: 400 API credits per day and 4,000 API credits per day for OpenSky users
data: Flight data, arrivals, departures, aircraft trajectory
is_account_required: false
diagram_image:
diagram_alt:
weight: 6
---

{{% data-playground-wrapper %}}

{{% data-playground-code-tabs %}}
{{% data-playground-code-tab tabIndex="python" name="Python"  %}}

```python
"""
Note: this assumes you also have a FlightsPublisher ;)
Feel free to use the publisher here:
https://github.com/rotationalio/data-playground/tree/main/opensky/python
"""
import json
import asyncio
import warnings

from pyensign.ensign import Ensign
from pyensign.api.v1beta1.ensign_pb2 import Nack

# TODO: Python>=3.10 raises a DeprecationWarning: There is no current event loop. We need to fix this in PyEnsign!
warnings.filterwarnings("ignore", category=DeprecationWarning)


class FlightsSubscriber:
    """
    FlightsSubscriber consumes flight vector events from Ensign.
    """

    def __init__(self, topic="flight-vectors", ensign_creds=""):
        """
        Create a FlightsSubscriber to consume flight vector events from an Ensign
        topic. Nothing will be consumed until run() is called.

        Parameters
        ----------
        topic : str (default: "flight-vectors")
            The name of the topic to consume from.

        ensign_creds : str (optional)
            The path to your Ensign credentials file. If not provided, credentials will
            be read from the ENSIGN_CLIENT_ID and ENSIGN_CLIENT_SECRET environment
            variables.
        """
        self.topic = topic
        self.ensign = Ensign(cred_path=ensign_creds)

    def run(self):
        """
        Run the subscriber forever.
        """
        asyncio.get_event_loop().run_until_complete(self.subscribe())

    async def handle_event(self, event):
        """
        Decode and ack the event back to Ensign.
        """
        try:
            data = json.loads(event.data)
        except json.JSONDecodeError:
            print("Received invalid JSON in event payload:", event.data)
            await event.nack(Nack.Code.UNKNOWN_TYPE)
            return

        print("Received flight vector:", data)
        await event.ack()

    async def subscribe(self):
        """
        Subscribe to the flight vectors topic and parse the events.
        """
        id = await self.ensign.topic_id(self.topic)
        await self.ensign.subscribe(id, on_event=self.handle_event)
        await asyncio.Future()


if __name__ == "__main__":
    subscriber = FlightsSubscriber(ensign_creds="secret/ensign.json")
    subscriber.run()
```

{{% /data-playground-code-tab %}}

{{% data-playground-code-tab tabIndex="go" name="Go"  %}}

```golang
package main

import "fmt"

func main() {
    fmt.Println("Code snippet coming soon!")
}
```

{{% /data-playground-code-tab %}}
{{% /data-playground-code-tabs %}}

{{% /data-playground-wrapper %}}

{{% data-playground-content %}}

<!-- Add content for data playground here, including a table for data products if available -->

{{% /data-playground-content %}}

{{% coming-soon %}}

Coming soon!

{{% /coming-soon %}}

