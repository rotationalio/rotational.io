---
title: "DC Metro"
slug: "dc-metro"
subtitle: "Public Transport Data"
draft: false
image: img/data-playground/dc-metro.png
summary: Connect to DC Metro public transport data and start experimenting with scheduling models and apps.
github_link: https://github.com/rotationalio/data-playground/tree/main/wmata
description: DC WMATA provides public transportation data such as real-time bus and rail predictions.
producer_name: Washington Metro Area Transit Authority (WMATA)
producer_link: https://developer.wmata.com/
data: Bus & train trip updates, alerts, and vehicle positions.
is_account_required: true
license: Free
license_warning: Please review terms and conditions. Access to data sources can change.
is_api_key_required: true
api_type: JSON, GTFS protocol buffers
sdks: N/A
limits: The default tier (free) is rate-limited to 10 calls/second and 50,000 calls per day.
weight: 5
---
{{% data-playground-wrapper %}}

{{% data-playground-code-tabs %}}
{{% data-playground-code-tab tabIndex="python" name="Python"  %}}

```python
"""
Note: this assumes you also have a MetroPublisher ;)
Feel free to use the publisher here:
https://github.com/rotationalio/data-playground/tree/main/wmata/python
"""
import json
import asyncio
import warnings

from pyensign.ensign import Ensign
from pyensign.api.v1beta1.ensign_pb2 import Nack

# TODO Python>3.10 needs to ignore DeprecationWarning: There is no current event loop
warnings.filterwarnings("ignore")


class MetroSubscriber:
    """
    MetroSubscriber subscribes to an Ensign stream that the MetroPublisher is
    writing new metro reports to at some regular interval.
    """

    def __init__(self, topic="metro-updates-json"):
        """
        Initialize the MetroSubscriber, which will allow a data consumer to
        subscribe to the topic that the publisher is writing metro updates to

        Parameters
        ----------
        topic : string, default: "metro-updates-json"
            The name of the topic you wish to subscribe to.
        """
        self.topic = topic
        self.ensign = Ensign()

    def run(self):
        """
        Run the subscriber forever.
        """
        asyncio.get_event_loop().run_until_complete(self.subscribe())

    async def handle_event(self, event):
        """
        Decode and ack the event.
        """
        try:
            data = json.loads(event.data)
        except json.JSONDecodeError:
            print("Received invalid JSON in event payload:", event.data)
            await event.nack(Nack.Code.UNKNOWN_TYPE)
            return

        print("New metro report received:", data)
        await event.ack()

    async def subscribe(self):
        """
        Subscribe to the metro topic and parse the events.
        """
        id = await self.ensign.topic_id(self.topic)
        await self.ensign.subscribe(id, on_event=self.handle_event)
        await asyncio.Future()


if __name__ == "__main__":
    subscriber = MetroSubscriber()
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