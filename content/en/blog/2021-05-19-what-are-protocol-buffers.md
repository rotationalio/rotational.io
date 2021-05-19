---
title: "What Are Protocol Buffers?"
slug: "what-are-protocol-buffers"
date: "2021-05-19T11:05:32-04:00"
draft: false
image_webp: images/blog/migration.webp
image: images/blog/migration.jpg
author: Rebecca Bilbro
description: "Protocol buffers are a method for serializing data to efficiently send between programs. In this post, we'll explore some use cases for protobufs and learn the syntax."
---


Protocol buffers are a method for serializing data to efficiently send between programs. The structure is reminiscent of XML or JSON, but unlike these more commonly used serialization methods, protocol buffers are designed to produce extremely compact messages. The main tradeoff is that protocol buffers aren't human-readable, so when developing APIs, it's always important to consider the use case. In this post, we'll explore some of the use cases for protobufs and get to know the syntax.

## From Data to Bytes

Data serialization is fundamentally about translation &mdash; when we serialize, we're converting from a format that's optimized for analysis or computation into a form better for storage or transmittal.

Serialization can be used to restore any kind of object that has been saved, stored, or relocated. For instance, when we [pickle](http://scikit-learn.org/stable/modules/model_persistence.html) a fitted scikit-learn pipeline or store a neural network model as an [HDF5](https://support.hdfgroup.org/HDF5/), we're serializing the data structures (matrices, graphs, etc.) of the models along with their hyperparameters, weights, and state. You can then load your model with something like:

```python
pickle.load(open("clf.pkl", "rb"))

# or
joblib.load("kmeans.pkl")

# or
load_model("rnn.h5")
```

This process of extracting the data structure from the bytes is called deserialization, or unmarshalling.

## Serialization Methods

There is a tendency to falsely infer competition between different serialization standards. In truth, the choice is less about selecting the correct one-size-fits-all technique, and more about thoughtfully designing around the use case and the user.

[XML](https://en.wikipedia.org/wiki/XML_Schema_(W3C)) (eXtensible Markup Language) is one standard for data serialization. It is good for representing complex, hierarchical data, and it is also human-readable (if not very pretty). Unlike HTML, XML was designed to transmit (not display) data. It is useful for data transmission because XML tags aren't predefined. You can come up with a schema that suits your data and your use case,and write programs to systematically serialize your data using that schema, or translate it back to data on the other end.

[JSON](https://en.wikipedia.org/wiki/JSON) (JavaScript Object Notation) is another way to serialize complex data; objects can be encoded as attribute–value pairs. Like XML, JSON is flexible and human-readable, but less verbose. It is often the default storage tool of choice for Python programmers because Python `dicts` can be mapped directly to JSON, and vice versa.

[YAML](https://yaml.org/) (YAML Ain't Markup Language) is a flexible file format used to write configuration files. They're easy to read and use whitespace to delineate fields for parsing.

[TOML](https://toml.io/en/) (Tom's Obvious Minimal Language) is another format for writing configuration files. Also easily human-readable, TOML trades some of the flexibility of YAML to offer unambiguous mapping from fields to dictionaries and hash tables.

[Protobufs](https://developers.google.com/protocol-buffers) (Protocol Buffers) were originally developed for internal use at Google to serialize data into a dense binary format. Protobufs start with a strictly defined structure which is then compiled into code that can be used to write to and read from that structure. This compact method is ideal for sending data between programs.

## Serialization Use Cases

When we build public data APIs, we like to use JSON or XML. These standards don't require a robust contract between the data provider backend and the data consumers on the other end. For the data providers, that means you can change the schema by adding new fields without necessarily having to deprecate older versions of the API. Likewise, data consumers can get away with not having the schema (or not having the most recent version of it), because the schema can be inferred from the human-readable results that come back from their API calls. For analysts and data scientists who interact with public APIs, this is a key feature.

YAML and TOML frequently get used in cloud configuration, deployment, and devops tools like Kubernetes and Heroku. They're convenient because they end up having a lot of boilerplate that can be reused across deployments, and support things like adding comments and notes that you can't do with JSON.

On the other hand, human-readability comes at a cost; XML, JSON, YAML, and TOML are not very compact. And if it's not going to be used for communication between people, that cost might not be worth paying, particularly if it slows down throughput or threatens data security.

## Anatomy of a Protobuf

Let's consider an example of how protocol buffers might play a role in an everyday microservice architecture:

Imagine we have an application that performs transactions on behalf of customers. First, an API server passes user input credentials to an authentication microservice. If authentication is successful, the request is routed via an RPC that makes a call to a database to lookup the client's account data. A subsequent service then uses the account data to perform a transaction via another RPC, and after receiving confirmation returns a message to the client to let them know that the transaction succeeded, or that it failed with some error code.

First, we need to define the schema for the data, which we'll do in a file called `transfer.proto`. This schema will map data types with field names represented as integers. We start by specifying the syntax. At the time of this writing, protocol buffers are in version 3 (released in [August of 2015](https://github.com/protocolbuffers/protobuf/releases?after=v3.0.0-beta-3.3)), so we'll write `syntax = "proto3";` at the top of our `.proto` file. We also specify the package where this schema will be used (in this case `transactor`).

The primary components of a protocol buffer are `messages`. For our hypothetical microservice, we'll define a `Transaction` message that contains the fields that uniquely describe a complete transaction &mdash; information about the user, validated credentials, a risk classification, and the actual details of the transaction. We anticipate that the user might wish to perform batch-wise transactions, and we create an array (`repeated`) to hold one or many, together with a matching array field to hold error messages returned by any of the transactions, and finally a time stamp that documents the last successful transfer.

```proto
syntax = "proto3";

package transactor;

message Transaction {
  string username = 1;
  int32 id = 2;
  Credentials credentials = 3;

  enum RiskLevel {
    LOW = 0;
    MEDIUM = 1;
    HIGH = 2;
  }

  message Details {
    int32 amount = 1;
    int64 account = 2;
    RiskLevel risk = 3;
  }

  repeated Details transfers = 4;
  repeated Errors errors = 5;

  google.protobuf.Timestamp last_transfer = 6;
}
```

Note that with protocol buffer messages, fields are numbered to ensure the encoded data is unambiguously parseable. In other words, for the `Transaction` message, a field value of 1 means the `username` will always be in the first position in the series of bytes, the user `id` will be in the second position, the `credentials` in the third, etc.

Once you have downloaded and installed the protobuf compiler (e.g. using `brew`), you can compile the above file into the language of your choice. For instance:

```bash
protoc --go_out=. transfer.proto
```

... will generate a new file, `transfer.pb.go` that contains Golang code that can be used to write to and read from the schema we defined in `transfer.proto`. If we wanted to compile the code to Python, we'd do:

```bash
protoc --python_out=. transfer.proto
```
... which would generate `transfer_pb2.py`.

## Final Thoughts

Using protocol buffers does mean more forethought is required to ensure backwards compatibility. Assigning the field numbers to a message in the `proto` file is tantamount to a commitment that these numbers will not change from version to version. Many seasoned gRPC developers even intentionally skip numbers in their message definitions, to allow for flexibility while also providing backward and forward compatibility as RPCs grow and evolve.

If you're used to the RESTful API paradigm, protocol buffers might take some adjustment. However, they're definitely worth the effort of looking into, as the use cases are becoming more common all the time. Namely, as applications become more and more complex, data becomes more distributed, and user experience increasingly hinges on intermediate data transmission, protobufs will only become more useful!



## Further Reading/Watching

 - [Protocol Buffers - Developer Docs](https://developers.google.com/protocol-buffers/)
 - [Protocol Buffer Examples in C++, Java, Python, and Go](https://github.com/protocolbuffers/protobuf/tree/master/examples)
 - [An Introduction to Protobufs by Ten Loh](https://youtu.be/72mPlAfHIjs)
 - [justforfunc #30: The Basics of Protocol Buffers](https://youtu.be/_jQ3i_fyqGA)
 - [Installing the Protobuf Compiler on a Mac by Erika Dike](https://medium.com/@erika_dike/installing-the-protobuf-compiler-on-a-mac-a0d397af46b8)
 - [JSON vs XML vs Protobufs on Stackoverflow](https://stackoverflow.com/questions/14028293/google-protocol-buffers-vs-json-vs-xml)
