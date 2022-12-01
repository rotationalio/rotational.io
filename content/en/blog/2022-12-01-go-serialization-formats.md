---
title: "Go Serialization Formats"
slug: "go-serialization-formats"
date: "2022-11-30T18:12:08-05:00"
draft: true
image: 
author: Daniel S. & Danielle M.
category: "Serialization"
photo_credit: "Add Photo Credits Here"
description: "In this post we’ll go over a few important serialization formats along with their pros and cons to help you determine the best choice for your situation."
profile: img/butterfly.png
---

Serialization probably isn’t something that most developers spend too much brain power on when designing an application, but there’s more to sending bits over a wire than you may think and it deserves some thought. Which serialization format you choose is an often overlooked part of what could make your application as slow as  a turtle or as speedy as a cheetah!

<!--more-->

With most serialization formats claiming to be fast and lightweight solutions for transmitting data, choosing the optimal one can be difficult. In this post we’ll go over a few important serialization formats along with their pros and cons to help you determine the best choice for your situation.

## JSON

JavaScript Object Notation is a text-based format based on JavaScript’s object syntax. Essentially, JSON is a string. One of the reasons many prefer to use it is that it’s human readable.

## BSON

BSON Stands for “Binary JSON” and is the format used by MongoDB. BSON is designed to be space efficient, but because BSON encodes extra information like object length in documents, it might be less efficient than JSON in some cases. BSON does this in order to enhance its traversability. BSON is also designed to be transparently converted to/from JSON.

BSON has some special types like "ObjectId", "Min key", and “Max key" which are not compatible with JSON. This incompatibility could lead to some type information getting lost when converting objects from BSON to JSON. (Give credit to stackoverflow post) 

## MessagePack

MessagePack is used with SignalR, an open source ASP.NET competitor to gRPC, and like Protobufs, is specified using a schema. Ironically, MessagePack is more compatible with JSON than BSON. It also supports static-typing and type-checking, which is good news if you are working in a strongly typed language.

## Protocol Buffers

Protocol Buffers or protobufs are serialization formats used with the Google designed gRPC Remote Procedure Call framework. They are specified with a generic schema that can generate code to be used with a variety of different languages. As mentioned in one of our previous [blog posts](https://rotational.io/blog/what-are-protocol-buffers/), protobufs produce extremely compact messages by using a binary format. 

## Testing each format

Because everyone loves benchmarks, we decided to put each of the serialization formats mentioned above to the test in Go. Three different data structs were created: small, medium, and large. The small struct contained 5 items, there were 20 items in the medium struct, and 45 in the large struct. We were sure to use a range of data types (strings, integers, booleans, and time). Since time can be a little tricky with Protocol buffers, strings were used.

In addition, raw and gzipped JSON, BSON, and MessagePack were compared against each other. Now, let's take a look at the results.

## JSON Results

| Data Struct Size   |  Bytes |  Time to execute | Data Struct Size   |  Bytes | Time to execute |
|---|---|---|---|---|---|
| Small JSON  | 116 B | 582.542µs | Small gzipped JSON | 129 B | 200.75µs |
| Medium JSON  | 563 B | 54µs | Medium gzipped JSON | 292 B | 218.916µs |
| Large JSON  | 1.258 kB | 74.458µs | Large gzipped JSON | 500 B | 230.041µs |

## BSON Results

| Data struct |  Size |  Time to execute | Data struct |  Size |  Time to execute |
|---|---|---|---|---|---|
| Small BSON  | 88 B  | 100.459µs | Small gzipped BSON  | 103 B | 584.917µs |
| Medium BSON  | 398 B | 21.792µs | Medium gzipped BSON | 264 B | 1.127125ms |
| Large BSON  | 912 B | 46.791µs | Large gzipped BSON | 477 B | 325.875µs |

Package used: [Golang driver for MongoDB](https://github.com/mongodb/mongo-go-driver)

## MessagePack Results

| Data struct |  Size |  Time to execute | Data struct |  Bytes |  Time to execute|
|---|---|---|---|---|---|
| Small msgpack | 70 B | 88.875µs | Small gzipped msgpack | 90 B | 1.896458ms |
| Medium msgpack | 356 B | 11.25µs | Medium gzipped msgpack | 275 B | 304.708µs |
| Large msgpack | 819 B | 25µs | Large gzipped msgpack | 501 B | 107.042µs |

Package used: [MessagePack encoding for Golang](github.com/vmihailenco/msgpack/v5)

## Protocol Buffer Results

|Data struct |  Size |  Time to execute |
|---|---|---|
| Small | 28 B | 596µs |
| Medium | 140 B | 136.75µs |
| Large | 279 B | 130.542µs |

Package used: [Protobuf](https://github.com/protocolbuffers/protobuf)

One thing we noticed is that for really small data, it's probably not worth it to compress it with gzip. Another thing to note is that for the medium and large JSON, using gzip to compress the data helped significantly reduce the size. The binary serialization formats all performed better than JSON. 

Although MessagePack is quick, it became apparent that as the amount of data increased its size was on par with or worse than gzipped JSON and BSON. We did use [TinyLib MessagePack Code Generator](https://github.com/tinylib/msgp) to test a generated version of MessagePack, but saw no significant difference in the results. However, it was nice to have the test files automatically created. 

Since size matters, just as much as speed, we found that protobufs are the best solution for our serialization needs. Another thing we noticed is that the size for protobufs remained consistent no matter how many times we ran our test. With the other serialization formats, the size would occasionally change by a miniscule amount. Of course, the downside of using Protocol buffers is that the message has to be defined upfront and if there's a possibility of changes being required this could become cumbersome.

As Protocol Buffers and the Go language were developed by Google this likely played a big role in why protobufs performed the best during our tests. Test results will vary depending on the programming language used. In fact, if using a higher-level language, JSON may be the better choice. 

We'd like to thank Alec Thomas for creating a [GitHub repo](https://github.com/alecthomas/go_serialization_benchmarks) that made it easier for us to look into different Go packages for this post. If you're interested in learning more about other serialization formats that may be used with Go, not mentioned in this post, we highly recommend checking out their repo.