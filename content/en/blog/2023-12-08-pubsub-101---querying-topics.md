---
title: "PubSub 101 - Querying Topics"
slug: "pubsub-101---querying-topics"
date: "2023-12-08T14:09:46-06:00"
draft: true
image: img/blog/otter_investigator.png
photo_credit: "Add Photo Credits Here"
authors: ['Patrick Deziel']
profile: img/team/patrick-deziel.png
tags: ['Ensign', 'enSQL', 'PubSub 101']
description: "In this module you will query Ensign to re-process events in a data stream. Woah, time travel!"
---

Real-time data streams are powerful, but sometimes you need to convert the stream into a batch or replay parts of the stream. Here's how to write customized SQL to more deeply understand and interact with your data.

<!--more-->

This module assumes that you've already created a topic and published some data to it. If you haven't already, take a look at the previous [modules](https://rotational.io/tags/pubsub-101) to make sure you have a topic to work with!

In [Module 1](https://rotational.io/blog/pubsub-101---creating-your-project/) you created an Ensign project.

In [Module 2](https://rotational.io/blog/pubsub-101---using-the-python-sdk/) you learned how to use the PyEnsign SDK.

In [Module 3](https://rotational.io/blog/pubsub-101---creating-data-flows-with-topics/) you created your first topic.

In [Module 4](https://rotational.io/blog/pubsub-101---creating-a-publisher/) you created a real-time publisher.

In [Module 5](https://rotational.io/blog/pubsub-101---creating-a-subscriber/) you created a real-time subscriber.

## Event Persistence

You already know that Ensign can stream `events` for you through the use of `publishers` and `subscribers`. Pure stateless processing is sometimes all you need. However, in many cases you need to see what was published in the past, in order to recover from unexpected failure, perform historical or trend analytics, or debug asynchronous workflows.

By default Ensign persists **all of the events** that have been published to all of your `topics`. This makes it possible to both retrieve any previous `event` or replay a _stream of events_ from any point in time (woah, time travel!).

## enSQL

Ensign implements a specific query language called enSQL. enSQL shares a lot of syntax with classical SQL except that it lets you query Ensign `topics` over specific windows of time. Similar to how you can query over `tables` in relational databases, in Ensign you can query over `topics`. The diagram below summarizes the basic syntax.

!["enSQL Syntax"](/img/blog/2023-12-08-pubsub-101---querying-topics/syntax.png)

## Your First Query

Let's return to the flight tracker project and see if we can run some queries. Consider the query below.

```sql
SELECT * FROM flight-positions
```

You can interpret the query as "select all the events from the `flight-positions` topic". Try running it from the topic dashboard for the `flight-positions` topic, which you can get to from the [project dashboard](https://rotational.app/app/projects). You should see the query results below.

!["Simple Query"](/img/blog/2023-12-08-pubsub-101---querying-topics/query.png)

Note that the events are returned in the order that they were published, starting from the very first event in the topic to the most recent event. This turns out to be a useful property because it allows you to "replay" the event stream.

Of course, you can also run queries directly from Python SDK. With the pyensign client, the `query()` function returns a cursor to fetch events with `fetchone()`, `fetchmany()`, and `fetchall()`, similar to how you would process query results with a database adapter like psycopg2.

*Retrieving the first event*
```python
ensign = Ensign()
cursor = await ensign.query("SELECT * FROM flight-positions")
print(await cursor.fetchone())
```

```
Event:
	id: 0661t13avm0gxesn
	data: b'{"icao24": "ac2f83", "callsign": "", "origin_country": "United States", "time_position": 170129382...
	mimetype: application/json
	schema: FlightVector v0.1.0
	state: EventState.INITIALIZED
	created: 2023-11-29 15:37:57
```

_Pro Tip: If you are running into async errors with the code, you can run it in a Python notebook to avoid writing the `asyncio` boilerplate_

*Retrieving the first three events*

```python
cursor = await ensign.query("SELECT * FROM flight-positions")
events = await cursor.fetchmany(3)
for event in events:
    print(event)
```

```
Event:
	id: 0661t13avm0gxesn
	data: b'{"icao24": "ac2f83", "callsign": "", "origin_country": "United States", "time_position": 170129382...
	mimetype: application/json
	schema: FlightVector v0.1.0
	state: EventState.INITIALIZED
	created: 2023-11-29 15:37:57
Event:
	id: 0661t13awg0gxesp
	data: b'{"icao24": "c02e9b", "callsign": "JZA635  ", "origin_country": "Canada", "time_position": 17012938...
	mimetype: application/json
	schema: FlightVector v0.1.0
	state: EventState.INITIALIZED
	created: 2023-11-29 15:37:57
Event:
	id: 0661t13aww0gxesq
	data: b'{"icao24": "ad3add", "callsign": "N9511D  ", "origin_country": "United States", "time_position": 1...
	mimetype: application/json
	schema: FlightVector v0.1.0
	state: EventState.INITIALIZED
	created: 2023-11-29 15:37:57
```

You can also iterate over the cursor iself to asynchronously retrieve the stream of events, which is like subscribing at a previous point in time.

```python
cursor = await ensign.query("SELECT * FROM flight-positions")
async for event in cursor:
    print(event)
```

```
Event:
	id: 0661t13avm0gxesn
	data: b'{"icao24": "ac2f83", "callsign": "", "origin_country": "United States", "time_position": 170129382...
	mimetype: application/json
	schema: FlightVector v0.1.0
	state: EventState.INITIALIZED
	created: 2023-11-29 15:37:57
Event:
	id: 0661t13awg0gxesp
	data: b'{"icao24": "c02e9b", "callsign": "JZA635  ", "origin_country": "Canada", "time_position": 17012938...
	mimetype: application/json
	schema: FlightVector v0.1.0
	state: EventState.INITIALIZED
	created: 2023-11-29 15:37:57
Event:
	id: 0661t13aww0gxesq
	data: b'{"icao24": "ad3add", "callsign": "N9511D  ", "origin_country": "United States", "time_position": 1...
	mimetype: application/json
	schema: FlightVector v0.1.0
	state: EventState.INITIALIZED
	created: 2023-11-29 15:37:57
Event:
	id: 0661t13ax40gxesr
	data: b'{"icao24": "aa9dc1", "callsign": "XOJ783  ", "origin_country": "United States", "time_position": 1...
	mimetype: application/json
...
	mimetype: application/json
	schema: FlightVector v0.1.0
	state: EventState.INITIALIZED
	created: 2023-11-29 15:37:57
```

## Customizing Queries

There are many ways to customize queries. Here are some of the basics, but you can also check out the [documentation](https://ensign.rotational.dev/ensql/syntax/) for more details and the latest features.

### Filtering

Every event has a schema type and version, which is visible on the `event` itself or on the topic dashboard. You can filter on schema types and versions, e.g. to select directly from the `FlightVector` event type.

```sql
SELECT * FROM flight-positions.FlightUpdate
```

### Windowing

If the first event was in error and you don't want to process it, you can use the `OFFSET` keyword.

```sql
SELECT * FROM flight-positions OFFSET 1
```

Or if you want to specify a window of events, e.g. events 1 to 3, skipping event 0.

```sql
SELECT * FROM flight-positions OFFSET 1 LIMIT 3
```

## DataFrames

PyEnsign DataFrames are an additional way to serialize results from an enSQL query. They are particularly useful for things like batchwise data analytics or training traditional machine learning models. To use them, you need to install the [ml] extension.

```
$ pip install pyensign[ml]
```

Then simply create the DataFrame from the query cursor.

```python
from pyensign.ml.dataframe import DataFrame
cursor = await ensign.query("SELECT * FROM flight-positions")
df = await DataFrame().from_events(cursor)
df.head()
```

!["DataFrame"](/img/blog/2023-12-08-pubsub-101---querying-topics/dataframe.png)

By default, the columns are the keys in the data and the rows are the events, ordered by ID.

PyEnsign DataFrames have the same capabilities as [pandas DataFrames](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.html), so you can apply transformations to the columns, merge them, sample them, etc.

```python
df['origin_country'].value_counts()

origin_country
United States           75
Austria                  4
Canada                   4
Ireland                  4
United Kingdom           4
Portugal                 2
Germany                  2
Malta                    2
Iraq                     1
Spain                    1
China                    1
Poland                   1
Hungary                  1
United Arab Emirates     1
Turkey                   1
Ethiopia                 1
Mexico                   1
Republic of Korea        1
Qatar                    1
Egypt                    1
Name: count, dtype: int64
```

## Back to the Future

Congrats for getting through all the modules! Now that you've created a project with pub/sub dataflows, hopefully the idea of creating real-time applications seems more achievable. Don't hesitate to reach out to support@rotational.io if you have further questions.