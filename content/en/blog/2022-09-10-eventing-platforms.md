---
title: "The Eventing Platform Landscape"
slug: "eventing-platforms"
date: "2022-09-10T12:28:08-04:00"
draft: false
author: Rebecca Bilbro
image: img/blog/herd.jpg
category: Microservices, Eventing
photo_credit: Rajarshi Mitra via Flickr Commons
description: "In this post we'll explore some of the types of eventing platforms and discuss why it's not about deciding which is objectively the 'best', but about knowing how to select the best tool for a given context."
---

Kafka and PubSub and Kinesis, oh my! Which eventing platform is best? In this post we'll explore the three primary categories of eventing systems and understand their similarities, differences, and key use cases.

<!--more-->

## Message Queues

Message queues (also known as message brokers) have been around for a while (~15 years) and are the oldest of the eventing systems. The central contribution of message queues is that our applications can do work more efficiently if we break big jobs into standardized chunks. By abstracting the complex machinations of our apps into chunks, we can then queue those chunks up and pass information between components more systematically.

Message queues are designed so that each message is consumed by only one consumer. Think about your list of weekend errands; once the chore is done, you check it off the list.

If you can express your eventing problem in the context of a simple message queue (for instance, if you don't need to handle multiple producers and consumers, don't have to worry about event persistence or exactly once semantics, etc.), you are in luck! Message queues are by far the cheapest and easiest to implement eventing solution.

**Examples of Message Queues**

- [RabbitMQ](https://www.rabbitmq.com/)
- [Amazon SQS](https://aws.amazon.com/sqs/)

## Pub/Sub and Event Streaming

The natural evolution of message queues and brokers was a use case where the system needs a log of events rather than an ephemeral todo list. The Pub/Sub pattern refers to a system where some parts of an application (usually called "publishers" or "producers") create data and other parts of the application (usually called "subscribers" or "consumers") react to that data.

Unlike the original vision of the message queue, in the Pub/Sub pattern, the relationship between data creation and data acquisition is no longer 1-1. That means unlike a grocery list, where we check items off once we've got them, we can't delete data until it's been retrieved by all interested parties. A better metaphor here is a teacher passing out a homework assignment to a classfull of students; the activity isn't complete until all the students have received the assignment.

So what's the distinction between Pub/Sub and Event Stream? The question comes down to whether the teacher needs to keep a record of the assignment after all of the students have received it -- if the answer is no, this is the Pub/Sub pattern; if the answer is yes, we need log persistence, which requires an Event Stream.

Persisting a log of events and adding guarantees does come at a significant cost though, since they require the underlying system to use a consensus mechanism to put events in order, and consensus is slow. Tools that provide these features often offer them turned off by default because that increases throughput and decreases latency, so be a bit wary of published metrics. Turning these features on often means a lot more elbow grease in terms of configuration, and will also influence cost.

**Examples of Pub/Sub Tools**

- [Google PubSub](https://cloud.google.com/pubsub)
- [Ably](https://ably.com/pub-sub-messaging)
- [Core NATS](https://docs.nats.io/nats-concepts/core-nats)

**Examples of Event Stream Tools**

- [Apache Kafka](https://kafka.apache.org/)
- [Redpanda](https://redpanda.com/)
- [Apache Pulsar](https://pulsar.apache.org/)
- [NATS Jetstream](https://docs.nats.io/nats-concepts/jetstream)

## Stream Processing

The final category in streaming events is Stream Processing, which marries the idea of streaming events with distributed computing. In addition to breaking data down into chunks to send along a stream (a stream that potentially many different processes are consuming from), each downstream process performs some computation on the portion of the data they receive. As with the MapReduce model implemented in Hadoop, the independently transformed chunks of data can then be reduced back into a single dataset. However, while Hadoop was designed to operate on batches of data, Stream Processing tools allow for the same kind of task parallelization on streaming data.

With Stream Processing, computation is more tightly coupled to the message stream, but this can be an important optimization in cases that require homogeneous data processing. Consider a climate change dashboard that consumes IoT data flowing in from sensors around the world that measure global surface temperature in kelvins to compute a rolling mean. In this case, the computation required is relatively straightforward, but doing it at scale would be much more efficient with a Stream Processing tool.

**Examples of Stream Processing Tools**

- [Apache Storm](https://storm.apache.org/)
- [Apache Heron](https://heron.apache.org/)
- [Apache Flink](https://flink.apache.org/)
- [AWS Kinesis](https://aws.amazon.com/kinesis/)
- [Hazelcast Jet](https://jet-start.sh/)

## Conclusion

So which is best - message queues, event streams, or stream processing? The truth is that this is a false choice! All three types of eventing platforms have their place. Moreover, as we'll explore in a future post, each may offer superior or subpar performance, given a specific context and depending on the specific configuration details of a given deployment.

When you are in the architecture and design phase of a new application, rather than asking "what's the best eventing tool?", the better question to ask is "what features does my eventing problem require?". Developers frequently get comfortable with one tool and take it with them from job to job, and there is certainly something to be said for knowing how to turn the configuration knobs on your favorite eventing tool. But if you're looking for an excuse to cast a wider net and explore some different options that might be better for your latest use case, this is your sign to go for it.

## Sources

- Frank de Jonge, [The different types of events in event-driven systems](https://blog.frankdejonge.nl/the-different-types-of-events-in-event-driven-systems/)
- Sudhir Jonathan, [The Big Little Guide to Message Queues](https://sudhir.io/the-big-little-guide-to-message-queues)
- Jonathan Beard, [A Short Intro to Stream Processing](https://www.jonathanbeard.io/blog/2015/09/19/streaming-and-dataflow.html)

---

Photo by [Rajarshi Mitra](https://www.flickr.com/photos/tataimitra/) via [Flickr Commons](https://flic.kr/p/244actT)

---
