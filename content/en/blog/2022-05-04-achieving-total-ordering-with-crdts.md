---
title: "Achieving Total Ordering With CRDTs"
slug: "achieving-total-ordering-with-crdts"
date: "2022-05-04T15:02:21-06:00"
draft: false
image_webp: images/blog/hourglass.webp
image: images/blog/hourglass.jpg
author: Patrick Deziel
description: "Conflict-free replicated data types are starting to take off in popularity, especially in terms of collaborative applications. In this post we will explore how these data structures can be used to achieve a total ordering of events across many peers."
---

Conflict-free replicated data types (or "CRDTs") are inspiring the creation of more collaborative applications and improving the experience of users of distributed systems. In this post, we will explore how these data structures can be used to achieve a consistent, total ordering of events across many peers.
<!--more-->


## What Is a CRDT?

Distributed systems require coordination between nodes. One effective method is to use locks to prevent concurrent access to shared resources, but this limits collaboration between users. A more advanced method is to use consensus algorithms such as Paxos or Raft; these however are difficult to implement [^1] and network-intensive[^2] due to the amount of communication required between nodes, as each write decision must be agreed on before it can be committed/executed.

CRDTs achieve consensus at the *data* layer. They consist of some state which can be modified and a `merge` function which merges two states together to produce a completely deterministic value. This is a critical differentiator from other consensus mechanisms. Instead of trying to avoid conflict, we embrace that conflict is going to happen and have some way of "auto-resolving" concurrent writes to a value that all peers will consistently agree on. This comes at the cost of sacrificing some user intent, but improves the extent to which peers can operate concurrently.

CRDTs can also be thought of as data structures designed specifically for replication. The `merge` function is idempotent, associative, and commutative. This ensures that merges can be done in any order and therefore peers can operate mostly asynchronously, only communicating with each other when it's necessary to exchange data.

## Okay, But What Does that Look Like in Code?

Programming languages such as Python gives us some fundamental data structures for modeling CRDTs. Python's `set` is the canonical example of a set-based CRDT. It implements an unordered set of unique elements and a `union` function which consistently merges two sets together. We can put a simple class wrapper around this and call it a `GSet` or `Grow-Only Set` CRDT[^3].

```python
class GSet():
    """
    GSet implements a grow-only set CRDT. Items can be added to the set but can't be
    removed.
    """

    def __init__(self):
        self.items = set()

    def add(self, item):
        """
        Adds an item to the set.
        """
        self.items.add(item)

    def merge(self, other):
        """
        Merges another GSet with this one.
        """
        if not isinstance(other, GSet):
            raise ValueError("Incompatible CRDT for merge(), expected GSet")
        self.items = self.items.union(other.items)
        return self

    def get(self):
        """
        Returns the current items in the set.
        """
        return self.items
```

Note that there are inherent limitations with this data structure. There is currently no way to remove an item from the set or realize an ordering of the items. To accomplish this we have to inject some metadata into the items that we are actually inserting into the set, which we will see shortly.

Python's `dict` also shares some properties with the `set` so it allows us to implement a shared counter across an arbitrary number of peers, or a `Grow-Only Counter` or `GCounter`[^4].

```python
import uuid

class GCounter:
    """
    GCounter implements a grow-only counter CRDT. It must be instantiated with a
    network-unique ID.
    """

    def __init__(self, id=uuid.uuid4()):
        self.id = id
        self.counts = {id: 0}

    def add(self, value):
        """
        Adds a non-negative value to the counter.
        """
        if value < 0:
            raise ValueError("Only non-negative values are allowed for add()")
        self.counts[self.id] += value

    def merge(self, other):
        """
        Merges another GCounter with this one.
        """
        if not isinstance(other, GCounter):
            raise ValueError("Incompatible CRDT for merge(), expected GCounter")
        for id, count in other.counts.items():
            self.counts[id] = max(self.counts.get(id, 0), count)
        return self

    def get(self):
        """
        Returns the current value of the counter.
        """
        return sum(self.counts.values())
```
Note that this data structure assumes that separate instances will have distinct IDs. On a single system we can use UUIDs to achieve this, but on distributed systems this issue of peer discovery and distinctness is a really tough problem.

An important property of CRDTs is that they can be composed together create more complex CRDTs. For example, we can use two `GSet`s to implement a `TwoPhaseSet` which has one set for "added" items and one set for "removed" items, solving the problem of not being able to remove items from the `GSet`. This makes the `GSet` and `GCounter` two simple yet powerful abstractions for implementing distributed applications.

## Totally Ordered Events

For a variety of distributed applications (pub/sub, collaborative editing, log integration, etc.) it's helpful to have a total ordering of events across the entire system. We can use a `Sequence` CRDT[^5] to implement this ordering.

```python
class Sequence():
    """
    Sequence is a CRDT that represents an ordered set of objects.
    """

    def __init__(self, id=uuid.uuid4()):
        self.id = id
        self.operations = GSet()
        self.clock = GCounter(self.id)
        self.sequence = []
```

### The Logical Clock

Distributed systems in the physical world consist of nodes that are separated by both distance and time. Communication between nodes is not instantaneous due to distance and incurs some latency. In addition, nodes are running on independent machines which suffer from clock drift. In the absence of expensive, [specialized hardware](https://static.googleusercontent.com/media/research.google.com/en//archive/spanner-osdi2012.pdf), relying on physical time to order events will impact consistency. Therefore, time in a distributed system is often reframed as a [happened-before](https://en.wikipedia.org/wiki/Happened-before) relationship using logical timestamps.

A logical clock can be implemented in a distributed context using a `GCounter` CRDT. Every time a node does a write (e.g., a PUT to a database value), we can simply increment the clock to the next integer value. When we merge the CRDT with another node, the independently running clocks become synced similarly to how physical clocks are synced. If two events happen at the same logical time then we need some mechanism to decide which event happened first. For example, we can order by node name as a tiebreaker. This is an arbitrary ordering but results in a consistent state across nodes.

```
alice@1 -> bob@2 -> alice@3 -> bob@3
```

### The Event Set

To maintain a consistent set of events across a number of nodes, we can use a `GSet`. This is an append-only data structure which is updated when a node emits an event. When creating an event to store in the `GSet`, it gets hashed based on the node name and the current value of the logical clock to ensure that all events are unique. For example, we can imagine collaborative editor which supports an "insert" operation.

```python
def insert(self, position, item):
    """
    Executes an "insert" operation and adds it to the log.
    """

    # Tick the clock
    self.clock.add(1)

    # Create a unique operation ID
    target = self.object_at_position(position).operation
    owner = OpId(self.id, self.clock.get())

    # Add the insert operation to the log and update the sequence
    op = Operation(
        owner=owner,
        action=OperationType.INSERT_BEFORE,
        target=target,
        payload=item
    )
    self.operations.add(op)
    op.do(self.sequence)
```

### Replicating the Events

To achieve eventual consistency across a number of nodes we need to be able to replicate the event log to other nodes. At the CRDT level our `Sequence` needs to be able to merge with an arbitrary `Sequence` that we have received from another node. Merging this composite CRDT is equivalent to merging the two "child" CRDTs: the event set and the logical clock. If we are managing a local state that's not CRDT-based (e.g., an ordered list of objects exposed to the user), we need to "patch" the state by applying the newly discovered events.

```python
def merge(self, other):
    """
    Merge another Sequence with this one.
    """

    if not isinstance(other, Sequence):
        raise ValueError("Incompatible CRDT for merge(), expected Sequence")

    # Sync the local clock with the remote clock
    self.clock = self.clock.merge(other.clock)

    # Get the new operations to be applied
    patch_ops = other.operations.get().difference(self.operations.get())

    # Get a sorted view of the patches to apply
    patch_log = sorted(patch_ops, key=cmp_to_key(self.compare_operations))

    # Patch the sequence using the new operations
    for op in patch_log:
        op.do(self.sequence)

    # Merge the two operation logs
    self.operations = self.operations.merge(other.operations)
```

## Extending the Implementation

Using the `Sequence` CRDT it's possible to implement a distributed log which maintains a total ordering of events across an arbitrary number of nodes. We have used this abstraction to create a prototype for a collaborative Jupyter-like notebook [editor](https://github.com/rotationalio/eirene). In this context, the events refer to inserts and removes of notebook cells and characters within those cells. When two peers want to sync, they send their versions of the notebook to each other. Since the CRDT merge results in a consistent state for both peers, they are both able to render a consistent state to the user.

![Merging Sequences](/images/media/2022-05-04-achieving-total-ordering-with-crdts/alicebob.png)

Feel free to check out our open source demo [client](https://github.com/rotationalio/eirene) and our [talk](https://www.slideshare.net/RebeccaBilbro/conflictfree-replicated-data-types-pycon-2022) at PyCon US 2022!

***

Photo by [Aron Visuals](https://unsplash.com/@aronvisuals?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/time?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

***

#### Further Reading

- [eirene: A client for collaborative Python development](https://github.com/rotationalio/eirene)
- [Enhancing Code Collaboration with Conflict-Free Replicated Data Types (PyCon 2022)](https://www.slideshare.net/RebeccaBilbro/conflictfree-replicated-data-types-pycon-2022)
- [Peritext: A CRDT for Rich-Text Collaboration](https://www.inkandswitch.com/peritext/)
- [Martin Kleppmann - CRDTs: The hard parts](https://youtu.be/PMVBuMK_pJY)
- [Michael Whittaker - Consistency in Distributed Systems](https://mwhittaker.github.io/consistency_in_distributed_systems/3_crdt.html)

#### References

[^1]: [Paxos Made Live - An Engineering Perspective](https://static.googleusercontent.com/media/research.google.com/en//archive/paxos_made_live.pdf)
[^2]: [Scalable but wasteful: current state of replication in the cloud](https://dl.acm.org/doi/10.1145/3465332.3470882)
[^3]: [Grow-Only Set](https://github.com/rotationalio/eirene/blob/main/crdt/gset.py)
[^4]: [Grow-Only Counter](https://github.com/rotationalio/eirene/blob/main/crdt/gcounter.py)
[^5]: [Sequence CRDT](https://github.com/rotationalio/eirene/blob/main/crdt/sequence.py)