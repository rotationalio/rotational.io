---
title: "Finnhub"
slug: "finnhub"
subtitle: "Stock Market Data"
draft: false
image: img/data-playground/finnhub.png
github_link: https://github.com/rotationalio/data-playground/tree/main/finnhub
description: FinnHub provides real-time stock market data. Note that the stock market is closed during certain times of days and days of the week.
summary: Finnhub provides real-time RESTful APIs and WebSocket for stocks, currencies, and crypto.
license: Free, Commercial
license_warning: Please review terms and conditions. Access to data sources can change.
producer_name: FinnHub
producer_link: https://finnhub.io/
is_api_key_required: true
api_type: REST, WebSocket
sdks: Python, Go
limits: "60 API calls/minute for the free tier. Other pricing plans available."
data: Stock prices, company profiles, company & market news
is_account_required: true
weight: 1
---

{{% data-playground-wrapper %}}

{{% data-playground-code-tabs %}}

{{% data-playground-code-tab tabIndex="python" name="Python"  %}}
```python
import os
import sys
import json
import asyncio
from datetime import datetime

import websockets
from pyensign.events import Event
from pyensign.ensign import Ensign


async def handle_ack(ack):
    ts = datetime.fromtimestamp(ack.committed.seconds + ack.committed.nanos / 1e9)
    print(f"Event committed at {ts}")

async def handle_nack(nack):
    print(f"Could not commit event {nack.id} with error {nack.code}: {nack.error}")

class TradesPublisher:
    """
    TradesPublisher queries an API for trading updates and publishes events to Ensign.
    """
    def __init__(self, symbols=["AAPL", "MSFT", "AMZN"], topic="trades"):
        self.symbols = symbols
        self.topic = topic
        self.ensign = Ensign()

    def run(self):
        """
        Run the publisher forever.
        """

        # Load finnhub API key from environment variable.
        token = os.environ.get("FINNHUB_API_KEY")
        if token is None:
            raise ValueError("FINNHUB_API_KEY environment variable not set.")

        # Run the publisher.
        asyncio.get_event_loop().run_until_complete(self.recv_and_publish(f"wss://ws.finnhub.io?token={token}"))

    async def recv_and_publish(self, uri):
        """
        Receive messages from the websocket and publish events to Ensign.
        """

        # Ensure that the Ensign topic exists before publishing.
        if not await self.ensign.topic_exists(self.topic):
            await self.ensign.create_topic(self.topic)

        while True:
            try:
                async with websockets.connect(uri) as websocket:
                    for symbol in self.symbols:
                        await websocket.send(f'{{"type":"subscribe","symbol":"{symbol}"}}')

                    while True:
                        message = await websocket.recv()
                        for event in self.message_to_events(json.loads(message)):
                            await self.ensign.publish(self.topic, event, ack_callback=handle_ack, nack_callback=handle_nack)
            except websockets.exceptions.ConnectionClosedError as e:
                # TODO: Make sure reconnect is happening for dropped connections.
                print(f"Websocket connection closed: {e}")
                await asyncio.sleep(1)

    def message_to_events(self, message):
        """
        Convert a message from the Finnhub API to multiple Ensign events.
        """

        message_type = message["type"]
        if message_type == "ping":
            return
        elif message_type == "trade":
            for trade in message["data"]:
                data = {
                    "price": trade["p"],
                    "symbol": trade["s"],
                    "timestamp": trade["t"],
                    "volume": trade["v"]
                }
                yield Event(json.dumps(data).encode("utf-8"), mimetype="application/json")
        else:
            raise ValueError(f"Unknown message type: {message_type}")
```
{{% /data-playground-code-tab %}}


{{% data-playground-code-tab tabIndex="go" name="Go"  %}}

```golang
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"time"

	"github.com/gorilla/websocket"
	ensign "github.com/rotationalio/go-ensign"
	api "github.com/rotationalio/go-ensign/api/v1beta1"
	mimetype "github.com/rotationalio/go-ensign/mimetype/v1beta1"
)

// This is the nickname of the topic, it will get mapped to an ID that actually gets used by Ensign
const Trades = "trades"

// This represents the structure of an individual stock data point that comes back from the Finnhub API
type Data struct {
	Symbol     string   `json:"s"`
	Price      float64  `json:"p"`
	Timestamp  uint64   `json:"t"`
	Conditions []string `json:"c" omitempty:"true"`
}

// This represents the entire websocket response that comes back from a single call to the Finnhub Server
// Note that a single Response may contain many Data points
type Response struct {
	Type string `json:"type"`
	Data []Data `json:"data"`
}

// Announce is a helper function that takes as input a event chan that gets created by calling sub.Subscribe()
// and ranges over any events that it receives on the chan, unmarshals them, and prints them out
func Announce(events <-chan *ensign.Event) {
	for tick := range events {
		trades := &Response{}
		if err := json.Unmarshal(tick.Data, &trades); err != nil {
			panic("unable to unmarshal event: " + err.Error())
		}
		fmt.Println(trades)
	}
}

func main() {

	// Create Ensign Client
	client, err := ensign.New() // if your credentials are already in your bash profile, you don't have to pass anything into New()
	// client, err := ensign.New(ensign.WithCredentials("YOUR CLIENT ID HERE!", "YOUR CLIENT SECRET HERE!"))
	if err != nil {
		panic(fmt.Errorf("could not create client: %s", err))
	}

	// Check to see if topic exists, if it does then the variable exists will be True
	exists, err := client.TopicExists(context.Background(), Trades)
	if err != nil {
		panic(fmt.Errorf("unable to check topic existence: %s", err))
	}

	var topicID string
	// If the topic does not exist, create it using the CreateTopic method
	if !exists {
		if topicID, err = client.CreateTopic(context.Background(), Trades); err != nil {
			panic(fmt.Errorf("unable to create topic: %s", err))
		}
	} else {
		// The topic does exist, but we need to figure out what the Topic ID is, so we need
		// to query the ListTopics method to get back a list of all the topic nickname : topicID mappings
		if topicID, err = client.TopicID(context.Background(), Trades); err != nil {
			panic(fmt.Errorf("unable to get id for topic: %s", err))
		}

	}

	key := os.Getenv("FINNHUB_KEY")
	if key == "" {
		panic("Finnhub key is required: get one at https://finnhub.io/")
	}

	// Get trades from Finnhub - FYI this Dialer dials the "Trades" endpoint
	// see https://finnhub.io/docs/api/websocket-trades for more details
	finnhub_url := fmt.Sprint("wss://ws.finnhub.io?token=", key)
	w, _, err := websocket.DefaultDialer.Dial(finnhub_url, nil)
	if err != nil {
		panic(err)
	}
	defer w.Close()

	// The complete list of options is long! This is a short list, but no guarantee that all will be updated for every tick
	symbols := []string{"AAPL", "AMZN", "PCG", "SNAP"}
	for _, s := range symbols {
		msg, _ := json.Marshal(map[string]interface{}{"type": "subscribe", "symbol": s})
		w.WriteMessage(websocket.TextMessage, msg)
	}

	// Create a subscriber  - the same subscriber should be consuming each event that comes down the pipe
	sub, err := client.Subscribe(topicID)
	if err != nil {
		fmt.Printf("could not create subscriber: %s", err)
	}

	// Loop over each response that is returned by the Finnhub websocket, publish it to the topicID, have the subscriber consume to the events channel
	for {
		// The Response struct is how we will boost the standard json marshalling library to know how to unpack and repackage Finnhub ticks
		msg := &Response{}
		err := w.ReadJSON(&msg)
		if err != nil {
			panic(err)
		}
		fmt.Println("Message from the websocket server is ", msg)

		e := &ensign.Event{
			Mimetype: mimetype.ApplicationJSON,
			Type: &api.Type{
				Name:         "Generic",
				MajorVersion: 1,
				MinorVersion: 0,
				PatchVersion: 0,
			},
		}

		if e.Data, err = json.Marshal(msg); err != nil {
			panic("could not marshal data to JSON: " + err.Error())
		}

		// Publish the newly received tick event to the Topic
		fmt.Printf("Publishing to topic id: %s\n", topicID)
		time.Sleep(1 * time.Second)
		client.Publish(topicID, e)

		// Goroutine to check the events channel to ensure that subscriber is getting all the ticks!
		time.Sleep(1 * time.Second)
		go Announce(sub.C)
	}
}
```
{{% /data-playground-code-tab %}}

{{% /data-playground-code-tabs %}}

{{% /data-playground-wrapper %}}

<!-- Flowchart for ensign and finnhub -->
{{< widefigure src="/img/data-playground/finnhub_flowchart.png" alt="Finnhub integration with Ensign">}}

{{% data-playground-content %}}

<!-- Add content for data playground here, including a table for data products if available -->

{{% /data-playground-content %}}

{{< data-playground-showcase >}}