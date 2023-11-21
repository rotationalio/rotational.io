---
title: "PubSub 101 - Creating Data Flows With Topics"
slug: "pubsub-101---creating-data-flows-with-topics"
date: "2023-11-20T16:05:55-06:00"
draft: true
image: img/blog/waterfall.jpg
photo_credit: "Photo by Jérôme Prax on Unsplash"
authors: ['Patrick Deziel']
profile: img/team/patrick-deziel.png
tags: ['Ensign', 'Data Streaming', 'PubSub 101']
description: "In this module you will create custom data streams to solve a real-world problem."
---

The core part of data streaming with Ensign is `topics`. In this module you will learn how to create useful data streams to solve a real-world problem.

<!--more-->

## Relational vs. Eventing Databases

Relational databases like postgres or sqlite usually only expose the current state of the world to applications. But what if you want the state of the database at any point in time? The answer is Change Data Capture (CDC), which lets you capture the individual changes to the database over time, and it's a fundamental component in Event-Driven Architectures.

In an event-driven database, the CDC log is directly exposed to applications. This comes with some useful features, like being able to reconstruct the state of the database at any point in time, or reprocess previously consumed data in the exact same order that it was produced for reproducibility.

Some traditional databases do give applications access to the CDC log for data streaming use cases, but event-driven databases are designed for data streaming at the outset.

## How to think about topics

An Ensign `topic` is a globally ordered and globally distributed stream of `events`. They are somewhat analagous to the concept of tables in a relational database, however there are a few important differences:

Property | Tables                                  |  Topics
---------|-----------------------------------------|-----------------------------------------------
Mutability | Can create, read, update, delete rows | Events are immutable - can only publish new Events
Heterogenity | Columns usually have singular data types  | Events can have varying data types and schemas
Ordering | Rows are not explicitly ordered and ordering usually happens at query time | Events have a defined ordering and the ordering is consistent across replicas

Consider a retail store that tracks inventory using a relational database. It might have one table called `Products` so that new products can be registered and their prices can be updated regularly, and another table called `Inventory` with foreign key relationships to view and update the availability of specific products within the store.

If we were to redesign this as an event-driven architecture, we might include a `product-updates` topic to track updates to product names, prices, etc. and an `inventory-updates` topic to track changes to product inventory. The individual `events` are updates to those topics, similar to how we would use the `ADD`, `UPDATE`, and `DELETE` SQL keywords to update rows in the relational database.

Here, the `topics` track the _changes_ to the products and inventory rather than just the current state of the inventory.

## Designing Data Flows

Suppose we want to track aircraft flights in the hopes of building a real-time model to predict flight delays. One of the first steps is to think about what kinds of data will be flowing through the application.

1. The positions of ongoing flights.
2. The trained models and the data they were trained on.
3. The arrival predictions made by the models.

!["Data Flows"](/img/blog/2023-11-20-pubsub-101---creating-data-flows-with-topics/topics.png)

The above diagram loosely represents _how_ the data will flow through the application. We will ingest data from an API into a `flight-updates` topic, use it to train real-time models for the `arrival-models` topic, and eventually expose model inferences to users via the `arrival-predictions` topic.

One advantage of event-driven architectures is that the topics are completely decoupled. Each component of the application can be tested independently, and we can feel free to experiment without breaking the prototype. For example, if we want to include weather data as a feature for model training we can simply add a `weather-updates` topic.

## To be continued...

In the next module, you'll create a real-time publisher to query an API and publish flight data to Ensign!