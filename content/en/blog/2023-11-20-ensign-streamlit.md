---
title: "Building Real-Time Apps in Python with Ensign and Streamlit"
slug: "ensign-streamlit"
date: "2023-11-20T12:00:55-05:00"
draft: false
image: img/blog/2023-11-22-ensign-streamlit/stock-price.jpg
photo_credit: "Photo by Markus Spiske on Unsplash"
authors: ['Prema Roman']
profile: img/team/prema-roman.png
tags: ['Python', 'Data']
description: "If you want to build data web applications but have struggled with HTML and Javascript, Ensign and Streamlit is a powerful combination of tools that enable you to build an application in minutes!"
---

Python may be the 2nd best language for everything, but it's a favorite of data scientists worldwide, and delivers a world of functionality. Did you know you can even build customer-facing AI/ML apps with Python now? Learn how...

<!--more-->

In this post we'll see how to combine the streaming database [Ensign](https://rotational.io/ensign/) with the new Python library [Streamlit](https://streamlit.io) to build customer-facing, interactive, data-intensive applications easier than ever, with no Javascript or database experience required.

Just here for the code? Check out this [repo](https://github.com/rotationalio/ensign-examples/blob/main/python/stock_market_trades) for the full example.

## Tools Should Let You Do What *You* Do Best

There's a lot to learn when you decide to become a data scientist &mdash; from data ingestion to wrangling to modeling and evaluation, and a host of "data science 2.0" tasks related to application development, such as containerization and orchestration, MLOps, and observability.

It can be overwhelming.

The only way to stay afloat is to identify tasks you can delegate, whether to another teammate (less and less likely these days, with the recent tech layoffs 😢) or to some tool or managed solution (as long as it doesn't break the budget). If you're on a small, scrappy team and you know Python, here are two tools you can't afford to ignore:

1. [Ensign](https://ensign.rotational.dev/) is a database purpose-built for creating real-time data applications without the need for devOps experience.
2. [Streamlit](https://streamlit.io) is a Python library that enables you to build data-intensive web applications without the need to learn HTML and Javascript.

The end result? We data scientists can focus on what **we** do best: working with data to deliver insights and stimulate growth.

## Getting Started

In this tutorial we'll start small by building a simple stock market chart that displays prices in real-time.  You can then expand on this tutorial to perform more complex data transformations and analytics, and build more sophisticated dashboards.

### Step 1: Get an API Key from Finnhub
First, you will need to get a Finnhub API key from [FinnHub](https://finnhub.io).  Finnhub provides RESTful APIs and websocket for stocks, currency, and crypto. Once you have your Finnhub key, add it as an environment variable as follows:

```bash
export FINNHUB_API_KEY="your key here"
```

### Step 2: Create a free Ensign account
Create a free Ensign account at [rotational.app](https://rotational.app).  Check out this step-by-step [tutorial](https://rotational.io/blog/pubsub-101---creating-your-project/) on how to set it up.  At the end of the tutorial, you will have downloaded your Ensign API keys, which you will also need to add as environment variables.

```bash
export ENSIGN_CLIENT_ID="your client id here"
export ENSIGN_CLIENT_SECRET="your client secret here"
```

### Step 3: Create and activate a virtual environment
Run the following on the command line to create a fresh new Python virtual environment:

```bash
virtualenv venv
source venv/bin/activate
```

### Step 4: Install the requirements
In order to run the code, the following Python libraries are required:

- `websockets`: Used to connect to the FinnHub API
- `streamlit`: Used to build the web application
- `pyensign`: The Python SDK to interact with Ensign
- `plotly`: Used to create the real-time line chart

```bash
pip install -r requirements.txt
```

## Working with Ensign
The idea behind working with Ensign is as follows:

- You write code that **publishes** data to a topic.  This is the equivalent of the data engineer's task of creating an ETL job that pulls data from an API and inserts it into a table.
- You write code that **subscribes** to the same topic.  If you are a data analyst or a data scientist, this is the equivalent of querying a table to get the data that you need for your analytics or machine learning project.

The Ensign database provides some powerful advantages:

- There is no need to define a schema ahead of time like you need to in a relational database.
- You can store data in many common formats such as CSV, JSON, Avro, and Parquet. You can even store Pickles, which gives you the ability to version control models with ease!
- You can perform real-time analytics - and it is easier than you think!
- There is no custom tooling required.  Once you set up an Ensign account and download your API keys, you can install and use `pyensign` just like you would any standard Python library to write and run your code.

## Building the application

The application consists of two major components:

- The publisher code that uses the websockets library to ingest stock market prices from FinnHub and publish the price data into the Ensign database.
- The subscriber code that retrieves the stock market price data from the Ensign database and updates a chart in real-time in a web application built using Streamlit.

### Global variables

We will create the following global variables:

```python
# The topic that will store the stock price data
TOPIC = "trades"

# The Ensign client -- used to connect to the
# Ensign server to publish and subscribe to topics
ENSIGN = Ensign()

# List of symbols for which we will collect prices
SYMBOLS = ["AAPL", "META", "NFLX", "AMZN", "GOOGL"]

# A pandas dataframe that will be used to generate the line chart
DF = pd.DataFrame(columns=["symbol", "time", "price"])
```

### Create the publisher

As you can see below, with just a few lines of code, you can set up a websocket connection to the FinnHub API to receive stock market prices that you encode as JSON before publishing to the `trades` topic.

The `uri` parameter is websocket url used to connect to FinnHub.  Once you establish the connection with the FinnHub server and send the list of symbols that you want to get prices for, the server will send prices through this connection as they become available.

```python
async def recv_and_publish(uri):
    """
    Receive messages from the websocket and publish events to Ensign.
    """
    while True:
        try:
            # establish connection with the FinnHub
            async with websockets.connect(uri) as websocket:
                # send the symbols you would like the prices for
                for symbol in SYMBOLS:
                    await websocket.send(
                        f'{{"type":"subscribe","symbol":"{symbol}"}}'
                    )

                while True:
                    # receive prices asynchronously
                    message = await websocket.recv()
                    # convert the message to an Ensign event
                    for event in message_to_events(json.loads(message)):
                        # publish the event to the topic
                        await ENSIGN.publish(
                            TOPIC, event, on_ack=handle_ack, on_nack=handle_nack
                        )

        except websockets.exceptions.ConnectionClosedError as e:
            print(f"Websocket connection closed: {e}")
            continue
```

Let's examine the call to `publish` in further detail.

```python
await ENSIGN.publish(TOPIC, event, on_ack=handle_ack, on_nack=handle_nack)
```

Here the Ensign client is asynchronously sending an event to the Ensign server (the function call is preceded with the `await` keyword).

In synchronous communication between clients and servers, it is expected that a call to a function will return immediately, but in this example, it is not necessary, and in fact, the client can perform other work while waiting.

In asynchronous communication, clients need to know if the server received their messages. The `on_ack` parameter is an optional parameter that the client can specify to invoke a method when the server sends an `ack` message. Similarly, if there was an issue on the server side in receiving or processing the message, the server will send a `nack` message, which can then trigger a method to be called when the `nack` response is received by the client.

The following code snippet shows how to convert a message from the FinnHub API into an Ensign event. The price, symbol, timestamp, and volume data is extracted from the message and converted into a JSON object.  Note the use of the `mimetype` parameter.  This is important as subscribers need to know the mimetype in order to be able to decode and parse the event.

```python
def message_to_events(message):
    """
    Convert a message from the Finnhub API to an Ensign event.
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
                "volume": trade["v"],
            }
            # convert data to a JSON object and specify the mimetype
            yield Event(
                json.dumps(data).encode("utf-8"), mimetype="application/json"
            )
    else:
        raise ValueError(f"Unknown message type: {message_type}")
```

### Create the subscriber

In the following method, we set up the Ensign client to subscribe to the `trades` topic.

As soon as a new event arrives in the topic, the event gets converted into a dictionary object that is then loaded into a pandas dataframe.  This dataframe gets passed to plotly to create a plotly `fig` object on which a line chart is drawn.  Finally, the chart is rendered by calling `st.write(fig)`.

```python
async def subscribe():
    """
    Subscribe to topic and populate line chart in a Streamlit app
    """
    async for event in ENSIGN.subscribe(topic):
        global DF
        data = json.loads(event.data)
        # convert unix epoch to datetime
        timestamp = get_timestamp(data["timestamp"])
        message = dict()
        message["symbol"] = data["symbol"]
        message["time"] = timestamp.strftime("%H:%M:%S")
        message["price"] = str(data["price"])
        # add new data to dataframe
        DF = pd.concat([DF, pd.DataFrame([message])], ignore_index=True)
        # Create a plotly line chart
        fig = px.line(DF, x="time", y="price", color="symbol", markers=True)
        # Add the figure to the container
        st.write(fig)
```

### Combining the publish and subscribe functions

Since the publisher and subscriber components are independent of each other, we will use the `asyncio` library to run them asynchronously.

We will first grab the Finnhub API key and add it to the websocket URL to call the API.  Next we will use `asyncio.create_task` to create the publish and subscribe tasks.  We will then run both of these tasks concurrently using `asyncio.gather`.

```python
async def main():
    # Load FINNHUB_API_KEY from environment variable
    token = os.environ.get("FINNHUB_API_KEY")
    if token is None:
        raise ValueError("FINNHUB_API_KEY environment variable not set.")

    # Create the subscribe and publish tasks and run them asynchronously
    subscribe_task = asyncio.create_task(subscribe())
    publish_task = asyncio.create_task(recv_and_publish(f"wss://ws.finnhub.io?token={token}"))
    await asyncio.gather(subscribe_task, publish_task)
```

### Running the application
We start by creating an empty streamlit container by calling `with st.empty`.  The container is like a canvas on which you draw elements.  Next we create an async event loop that will be used to execute the `main` function that we defined above by calling `asyncio.run(main())`

```python
if __name__ == "__main__":
    # Start with an empty container
    with st.empty():
        # Create an event loop that will be used to run the publish and subscribe tasks
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            asyncio.run(main())
        except KeyboardInterrupt:
            pass
        finally:
            print("Closing Loop")
            loop.close()
```

### Conclusion
As this post demonstrates, all it takes is a few lines of Python code to get a real-time web application up and running! There is no need to learn new programming languages or to set up complicated DevOps infrastructure.  This frees up your time to focus on the most important aspect of your job: *converting data into dollars.* 🤑