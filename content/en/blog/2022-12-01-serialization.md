---
title: "Serialization"
slug: "serialization"
date: "2022-11-30T19:03:56-08:00"
draft: true
image: img/blog/
author: Danielle M. & Daniel S.
category: "Add Category Here"
description: "Add Description Here"
profile: img/butterfly.png
---

Serialization probably isn’t something that most developers spend too much brain power on when designing an application, but there’s more to sending bits over a wire than you may think and it deserves some thought. Which serialization format you choose is an often overlooked part of what could make your application as slow as  a turtle or as speedy as a cheetah!

<!--more-->

With most serialization formats claiming to be fast and lightweight solutions for transmitting data, choosing the optimal one can be difficult. In this post we’ll go over a few important serialization formats along with their pros and cons to help you determine the best choice for your situation.

### JSON
JavaScript Object Notation is a text-based format based on JavaScript’s object syntax. Essentially, JSON is a string. One of the reasons many prefer to use it is that it’s human readable.

### BSON
BSON Stands for “Binary JSON” and is the format used by MongoDB. BSON is designed to be space efficient, but because BSON encodes extra information like object length in documents, it might be less efficient than JSON in some cases. BSON does this in order to enhance its traversability. BSON is also designed to be transparently converted to/from JSON.

BSON has some special types like "ObjectId", "Min key", and “Max key" which are not compatible with JSON. This incompatibility could lead to some type information getting lost when converting objects from BSON to JSON. (Give credit to stackoverflow post) 

### Protocal buffers 
Protocol Buffers (or "Protobufs") are serialization formats used with the Google designed gRPC Remote Procedure Call framework. They are specified with a generic schema that can generate code to be used with a variety of different languages. As mentioned in [one of our previous blog posts](https://rotational.io/blog/what-are-protocol-buffers/), they produce extremely compact messages by using a binary format.

### MessagePack
MessagePack is used with SignalR, an open source ASP.NET competitor to gRPC, and like Protobufs, is specified using a schema. Ironically, MessagePack is more compatible with JSON than BSON. It also supports static-typing and type-checking, which is good news if you are working in a strongly typed language.

## Benchmarking
Because everyone loves benchmarks, we decided to put each of the serialization formats mentioned above to the test in Go. We used a range of data types and sizes and compared the results for each format. 

| Type                   | Small                      | Medium                     | Large                     | Serialization Speed       |
| ---------------------- | -------------------------- | -------------------------- |-------------------------- |-------------------------- |
|**JSON**                | 116                        | 563                        | 1258                      | 641.875µs                 |
|**GZipped JSON**        | 129                        | 292                        | 500                       | 2.579ms                   |
|**BSON**                | 88                         | 398                        | 912                       | 318.875µs                 |
|**GZipped BSON**        | 103                        | 264                        | 477                       | 1.627ms                   |
|**MessagePack**         | 70                         | 356                        | 819                       | 179.375µs                 |
|**GZipped MessagePack** | 90                         | 275                        | 501                       | 1.275ms                   |
|**Protobuf**            | 28                         | 140                        | 279                       | 596/137/131µs*            |


If size matters for you, not just speed, we found that protobufs are the best solution for serialization. Another thing we noticed is that the size for protobufs remained constant no matter how many times we ran a test. With the other serialization formats, the size would sometimes change by a miniscule amount.

Although MessagePack is quick, it became apparent that as the amount of data increased its size was level with or worse than gzipped JSON and BSON.

We would like to point out that Protocol Buffers and the Go language were developed by Google and this likely played a big role in why protobufs performed the best during our tests. However, gzipped JSON and BSON aren’t bad choices. In fact, if using a higher-level language JSON may be the better choice. 

For more information on the various types of serialization formats and packages available to use in Go, check out this repo.
