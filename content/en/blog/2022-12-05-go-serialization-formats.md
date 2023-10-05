---
title: "Choosing Serialization Formats in Go"
slug: "go-serialization-formats"
date: "2022-12-05T10:27:11-05:00"
draft: false
image: img/blog/serialization.png
authors: ['Daniel Sollis', 'Danielle Maxwell']
tags: ['Serialization']
photo_credit: Photo by Rickie-Tom Schünemann on Unsplash
description: "In this post we’ll go over a few important serialization formats along with their pros and cons to help you determine the best choice for your situation."
profile: img/butterfly.png
---

Serialization format is an often-overlooked engineering step that could make your application as slow as a turtle or as speedy as a cheetah!

<!--more-->

Serialization probably isn’t something that most developers spend too much brain power on when designing an application, but there’s more to sending bits over a wire than you may think and it deserves some thought. With most serialization formats claiming to be fast and lightweight solutions for transmitting data, choosing the optimal one can be difficult. In this post we’ll go over a few important serialization formats along with their pros and cons to help you determine the best choice for your situation.

## JSON

JavaScript Object Notation is a text-based format based on JavaScript’s object syntax. Essentially, JSON is a string. One of the reasons many prefer to use it is that it’s human readable.

```json
{"name":"Grinch", "age":42, "loc":"Mount Crumpit", "pet":true}
```

## BSON

BSON Stands for “Binary JSON” and is the format used by MongoDB. BSON is designed to be space efficient, but because BSON encodes extra information like object length in documents, it might be less efficient than JSON in some cases. BSON does this in order to enhance its traversability. BSON is also designed to be transparently converted to/from JSON.

```
{"bah": "humbug"} →
\x16\x00\x00\x00            // total document size
\x02                        // 0x02 = type String
bah\x00                     // field name
\x06\x00\x00\x00humbug\x00  // field value
\x00                        // 0x00 = type EOO ('end of object')
```

BSON has some special types like "ObjectId", "Min key", and “Max key" which are not compatible with JSON. This incompatibility could lead to some type information getting lost when [converting objects from BSON to JSON](https://stackoverflow.com/questions/12438280/what-is-bson-and-exactly-how-is-it-different-from-json).


## MessagePack

MessagePack is used with SignalR, an open source ASP.NET competitor to gRPC, and like protobufs, is specified using a schema. Ironically, MessagePack is more compatible with JSON than BSON, so:

```json
{"name":"Grinch", "age":42, "loc":"Mount Crumpit", "pet":true}
```
becomes...
```
DF 00 00 00 04 A4 6E 61 6D 65 A6 47 72 69 6E 63 68 A3 61 67
65 2A A3 6C 6F 63 AD 4D 6F 75 6E 74 20 43 72 75 6D 70 69 74
A3 70 65 74 C3
```

It also supports static-typing and type-checking, which is good news if you are working in a strongly-typed language.

## Protocol Buffers

Protocol Buffers or protobufs are serialization formats used with the Google designed gRPC Remote Procedure Call framework. They are specified with a generic schema that can generate code to be used with a variety of different languages. As mentioned in one of our previous [blog posts](https://rotational.io/blog/what-are-protocol-buffers/), protobufs produce extremely compact messages by using a binary format.

```proto
syntax = "proto3";

package santa.v1;

import "google/protobuf/timestamp.proto";

message Sleigh {
    uint64 id = 1;
    bytes naughty_list = 2;
    bool lively_and_quick = 3;
    repeated string reindeer = 4;
    google.protobuf.Timestamp departure = 5;
}
```

## Serialization Bakeoff

Because everyone loves benchmarks, we decided to put each of the serialization formats mentioned above to the test using Golang.

We created three different data structs: small (5 items), medium (20 items), and large (45 items). We were sure to use a range of data types (strings, integers, booleans, and time). For the protocol buffers, we used strings to represent time in this experiment instead of using [Timestamp](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.Timestamp). Finally, we compared JSON, BSON, and MessagePack both in their raw and gzipped form.

Now, let's take a look at the results!

### JSON Results

| Struct  |  Size (Bytes) |  Time to Execute |
|---|---|---|
| Small JSON  | 116 B | 582.542µs |
| Medium JSON  | 563 B | 54µs |
| Large JSON  | 1.258 kB | 74.458µs |
| Small gzipped JSON | 129 B | 200.75µs |
| Medium gzipped JSON | 292 B | 218.916µs |
| Large gzipped JSON | 500 B | 230.041µs |

### BSON Results

| Struct  |  Size (Bytes) |  Time to Execute |
|---|---|---|
| Small BSON  | 88 B  | 100.459µs |
| Medium BSON  | 398 B | 21.792µs |
| Large BSON  | 912 B | 46.791µs |
| Small gzipped BSON  | 103 B | 584.917µs |
| Medium gzipped BSON | 264 B | 1.127125ms |
| Large gzipped BSON | 477 B | 325.875µs |

*Package used: [Golang driver for MongoDB](https://github.com/mongodb/mongo-go-driver)*

### MessagePack Results

| Struct  |  Size (Bytes) |  Time to Execute |
|---|---|---|
| Small msgpack | 70 B | 88.875µs |
| Medium msgpack | 356 B | 11.25µs |
| Large msgpack | 819 B | 25µs |
| Small gzipped msgpack | 90 B | 1.896458ms |
| Medium gzipped msgpack | 275 B | 304.708µs |
| Large gzipped msgpack | 501 B | 107.042µs |

*Package used: [MessagePack encoding for Golang](github.com/vmihailenco/msgpack)*

### Protocol Buffer Results

| Struct  |  Size (Bytes) |  Time to Execute |
|---|---|---|
| Small | 28 B | 596µs |
| Medium | 140 B | 136.75µs |
| Large | 279 B | 130.542µs |

*Package used: [Protobuf](https://github.com/protocolbuffers/protobuf)*

### Takeaways

One thing we noticed is that for really small data, it's probably not worth it to compress with gzip, regardless of serialization format. Another thing to note is that for the medium and large JSON, using gzip to compress the data helped significantly reduce the size. The binary serialization formats all performed better than JSON.

Although MessagePack is quick, it became apparent that as the amount of data increased, its size was on par with or worse than gzipped JSON and BSON. We did use [TinyLib MessagePack Code Generator](https://github.com/tinylib/msgp) to test a generated version of MessagePack, but saw no significant difference in the results. However, it was nice to have the test files automatically created.

Because size matters as much as speed, protobufs are currently the best solution for our serialization needs. The size for protobufs remained consistent no matter how many times we ran our test. With the other serialization formats, the size would occasionally change by a miniscule amount. Of course, the downside of using protocol buffers is that the message has to be defined upfront, and if the API changes it can be cumbersome.

As protocol buffers and the Go language were developed by Google this likely played a big role in why protobufs performed the best during our tests. Test results will vary depending on the programming language used. In fact, if using a higher-level language, JSON may be the better choice.

We'd like to thank Alec Thomas for creating a [GitHub repo](https://github.com/alecthomas/go_serialization_benchmarks) that made it easier for us to look into different Go packages for this post. If you're interested in learning more about other serialization formats that may be used with Go, we highly recommend checking out their repo.

#### Resources
[BSON vs JSON on Stack Overflow](https://stackoverflow.com/questions/12438280/what-is-bson-and-exactly-how-is-it-different-from-json)

[BSON vs MessagePack Stack Overflow](https://stackoverflow.com/questions/6355497/performant-entity-serialization-bson-vs-messagepack-vs-json)

[MessagePack Wikipedia page](https://en.wikipedia.org/wiki/MessagePack)

[JSON MDN Article](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON)