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


Protocol buffers are a method for serializing data to efficiently send between programs. The structure is reminiscent of XML or JSON, but unlike these more commonly used text-based serialization methods, protocol buffers are designed to produce extremely compact messages using a binary format. The main tradeoff is that protocol buffers aren't human-readable, so when developing APIs, it's always important to consider the use case. In this post, we'll explore some of the use cases for protobufs and get to know the syntax.

## From Data to Bytes

When we serialize, we're converting from an in-memory representation of data that's good for analysis and/or computation into a form that's better for storage and/or transmission.

Serialization is used to send data between processes. For example, if you've ever called `.fit()` (or `.train()`) on a scikit-learn pipeline or neural network model inside of a Jupyter notebook, you can save (aka marshal or dump) that model into a [pickle](http://scikit-learn.org/stable/modules/model_persistence.html) or [HDF5](https://support.hdfgroup.org/HDF5/) file. When you do that, you're serializing the data structures (matrices, graphs, etc.) of the models along with their hyperparameters, weights, and state into a format that can be saved on disk.

```python
pickle.dump(open("clf.pkl", "wb"))

# or
joblib.dump("kmeans.pkl")

# or
save_model("rnn.h5")
```

The opposite process is deserializing (unmarshalling or loading) the data structure from the on-disk representation into memory.

```python
pickle.load(open("clf.pkl", "rb"))

# or
joblib.load("kmeans.pkl")

# or
load_model("rnn.h5")
```

This is particularly useful if we're loading the model in a different process e.g. a different notebook or even a server that is going to use the model in an API.

## Serialization Methods and Use Cases

There are many ways to serialize data:

- **Semi-structured data** ([XML](https://en.wikipedia.org/wiki/XML_Schema_(W3C)), [JSON](https://en.wikipedia.org/wiki/JSON)) are meant to balance human readability with machine readability. XML has schemas and can represent complex, hierarchical data, but is more verbose; JSON is often the default choice for Python programmers because Python `dicts` can be mapped directly to JSON, and vice versa.
- **Configuration formats** ([YAML](https://yaml.org/), [TOML](https://toml.io/en/)) are geared towards human readability and are used to represent simple structures like strings, integers, boolean values, lists, maps, etc. While YAML uses whitespace to delineate fields for parsing, TOML trades some flexibility to offer unambiguous mapping from fields to dictionaries and hash tables.
- **Binary formats** ([Avro](https://avro.apache.org/), [Parquet](https://parquet.apache.org/)) err on the side of machine readability and speed.

There is a tendency to falsely infer competition between different serialization standards. The choice is less about selecting a "correct" one-size-fits-all technique and more about thoughtfully designing around the use case and the user. For example:

##### Use Case 1: Building a Public Data API
*Preferred serialization technique: JSON or XML*

JSON and XML don't require a robust contract between the data provider backend and the data consumers on the other end. For the data providers, that means you can change the schema by adding new fields without necessarily having to deprecate older versions of the API. Likewise, data consumers can get away with not having the schema (or not having the most recent version of it), because the schema can be inferred from the human-readable results that come back from their API calls. For analysts and data scientists who interact with public APIs, this is a key feature.

##### Use Case 2: Cloud Configuration
*Preferred serialization technique: YAML or TOML*

YAML and TOML frequently get used in cloud configuration, deployment, and devops tools like Kubernetes and Heroku. They're convenient because they end up having a lot of boilerplate that can be reused across deployments, and support documentation features like adding comments and notes that you can't do with JSON.

##### Use Case 3: Computing on Massive Datasets
*Preferred serialization technique: Avro or Parquet*

Avro and Parquet are used for large datasets intended for distributed computing where the schema can be self-contained with the data.

### Downsides of Human-Readability

On the other hand, human-readability has costs. For one thing, the serialization techniques described above are not very compact. And how would you validate and verify that your data is in the correct form, or if a service or an API has changed enough to break your system? How long does it take to serialize and deserialize messages?

Perhaps most importantly, if the messages are not going to be used for *communication between people*, these costs might not be worth paying, particularly if the serialization method is slowing down throughput or complicating data security.

Here's where protocol buffers come in!

## Anatomy of a Protobuf

Of the serialization methods described earlier in this post, [protocol buffers](https://developers.google.com/protocol-buffers) ("protobufs") fall into the binary format category. They were originally developed for internal use at Google to serialize data into a dense binary format. Protobufs start with a strictly defined structure, which is then compiled into code that can be used to write to and read from that structure. This compact method is ideal for sending data between programs.

Let's consider an example of how protocol buffers might play a role in a machine learning (ML) application. Imagine that our application functions as a sort of "conductor" for the end-to-end ML application: it trains models, compares the results, and stores the best ones for downstream use. We need a protocol buffer file that defines a generic model message for the system to pass around internally.

##### 1. Define the Schema

First, we need to define the schema for the data, which we'll do in a file called `conductor.proto`. This schema will map data types with field names represented as integers. We start by specifying the syntax. At the time of this writing, protocol buffers are in version 3 (released in [August of 2015](https://github.com/protocolbuffers/protobuf/releases?after=v3.0.0-beta-3.3)), so we'll write `syntax = "proto3";` at the top of our `.proto` file. We also specify the package where this schema will be used (in this case `conductor`).

The primary components of a protocol buffer are `messages`. For our ML Conductor, we'll define a `Model` message that contains fields that describe each of the key pieces of model metadata (the title, type of estimator, timestamp, etc.), together with the actual pickled `Estimator`.

```proto
syntax = "proto3";

// The package specifies the version of the protocol buffers
// and allows us to compare and validate changes in major
// versions of the protobufs.
package conductor.v1;

// Imports allow you to include other protocol buffer
// definitions. In this case, we're using a Google definition
// for a timestamp type that will be serialized into/from a
// Python datetime object or a Go time.Time struct.
import "google/protobuf/timestamp.proto";

// Messages define data types for serialization -
// they'll be classes in Python or Java and structs in Go or C++.
// Messages are composed of fields in the following form:
//
//     type name = number;
//
// When a message is serialized into binary format,
// the fields are ordered by their number and the type
// describes the size and encoding of the binary data;
// the field numbers are therefore extremely important for
// ensuring a message is deserialized correctly!
message Model {
    uint64 id = 1;       // unsigned integer of 64 bits
    string title = 2;    // inline comments describe fields ;)
    string notes = 3;
    bytes  pickle = 4;   // can hold arbitrary binary data

    // This is a nested message, meaning it is accessed
    // via Model.Dataset. Nested messages are used when
    // only referenced inside a specific kind of message.
    message Dataset {
        string snapshot = 1;      // field numbers are relative!
        repeated uint64 rows = 2; // repeated means an array
    }

    // Enums allow you to encode categorical values in a
    // schema-validatable way. This example is also nested
    // with the Model message, but doesn't have to be.
    enum PredictorType {
        UNKNOWN = 0;
        REGRESSOR = 1;
        CLASSIFIER = 2;
        CLUSTERER = 3;
    }

    Dataset dataset = 5;          // type is nested message above
    PredictorType model_type = 6; // type is nested enum above

    // Timestamp is defined by the package.MessageName
    // from the imported proto file.
    google.protobuf.Timestamp fitted_on = 7;
}
```

Note that with protocol buffer messages, fields are numbered to ensure the encoded data is unambiguously parseable. In other words, for the `Model` message, a field value of 1 means the `id` will always be in the first position in the series of bytes, the model's `title` will be in the second position, the training `notes` in the third, etc.

##### 2. Compile the File
Once you have downloaded and installed the protobuf compiler (e.g. using `brew`), you can compile the above file into the language of your choice. For instance:

```bash
protoc --python_out=. conductor.proto
```
... will generate `conductor_pb2.py`, containing Python code that can be used to write to and read from the schema we defined in `conductor.proto`.

Protocol buffers are intended to be application language agnostic and are available in a large number of programming languages. For example, to generate Go code, we'd do:

```bash
protoc --go_out=. conductor.proto
```
... which would generate `conductor.pb.go`.

##### 3. Apply Generated Protobuf Code

Now we can use the generated code inside our application, for instance to serialize and load a previously fitted baseline model to ensure subsequent models are showing improvement:

```python
# To generate the conductor_pb2.py file run the following:
#       protoc --python_out=. conductor.proto
#       pip install protobuf

import pickle

from google.protobuf.timestamp_pb2 import Timestamp
from conductor_pb2 import Model

clf = "CoinFlipClassifier"

model = Model(
    id=42,
    title="CoinFlip Classifier",
    notes="Flipped a coin to set an initial system baseline",
    model_type=Model.PredictorType.CLASSIFIER,
    fitted_on=Timestamp().GetCurrentTime(),
    pickle=pickle.dumps(clf),
)

# Create and add the dataset to the model
dataset = model.Dataset(
    snapshot="2014-04-09",
    rows=list(range(100))
)

# Protobuf objects are immutable, so copying and merging
# is required to modify nested elements.
model.dataset.MergeFrom(dataset)

# Serialize the model
data = model.SerializeToString()

# Load the model
loaded = Model()
loaded.ParseFromString(data)
print(loaded)
```

## Final Thoughts

Beyond thinking about use cases, the choice of how to serialize often comes down to the tradeoff between structure and flexibility. It's easier to get started with JSON than with protocol buffers, but harder to maintain in the long run. And while protocol buffers are harder to change than YAML, they're a lot faster to parse and validate.

Using protocol buffers means more forethought is required to ensure backwards compatibility. Assigning the field numbers to a message in the `proto` file is tantamount to a commitment that these numbers will not change from version to version. Many seasoned gRPC developers even intentionally skip numbers in their message definitions to allow for flexibility while also providing backward and forward compatibility as RPCs grow and evolve.

If you're used to the [RESTful API paradigm](https://restfulapi.net/), protocol buffers may take some adjustment. However, they're definitely worth looking into as the use cases are becoming more common. As applications become more complex, data is continuously more distributed, and user experience increasingly hinges on intermediate data transmission, protobufs will only become more useful!


## Further Reading/Watching

 - [Protocol Buffers - Developer Docs](https://developers.google.com/protocol-buffers/)
 - [Protocol Buffer Examples in C++, Java, Python, and Go](https://github.com/protocolbuffers/protobuf/tree/master/examples)
 - [An Introduction to Protobufs by Ten Loh](https://youtu.be/72mPlAfHIjs)
 - [justforfunc #30: The Basics of Protocol Buffers](https://youtu.be/_jQ3i_fyqGA)
 - [Installing the Protobuf Compiler on a Mac by Erika Dike](https://medium.com/@erika_dike/installing-the-protobuf-compiler-on-a-mac-a0d397af46b8)
 - [JSON vs XML vs Protobufs on Stackoverflow](https://stackoverflow.com/questions/14028293/google-protocol-buffers-vs-json-vs-xml)
