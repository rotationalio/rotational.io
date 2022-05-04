---
title: "Parliamentary Metaphors"
slug: "parliamentary-metaphors"
date: "2021-07-01T10:07:56-05:00"
draft: false
image_webp: /images/blog/parliament.webp
image: /images/blog/parliament.jpg
author: Benjamin Bengfort
description: "The metaphors we use to describe systems help us understand them and guide how we advance the state-of-the-art. Because they are so important, we should take care not to use metaphors that trap or inhibit software development and explore new metaphors routinely. In this post, we'll talk about the primary metaphor for consensus: parliaments."
---

I am a computer scientist and software engineer, so you may be surprised to learn that one of the most fundamental and influential papers to my career begins as follows:

> Early in this millennium, the Aegean island of Paxos was a thriving mercantile center. Wealth led to political sophistication, and the Paxons replaced their ancient theocracy with a parliamentary form of government. But trade came before civic duty, and no one in Paxos was willing to devote his life to Parliament. The Paxon Parliament had to function even though legislators continually wandered in and out of the parliamentary Chamber.
>
> &mdash; [Leslie Lamport, _The part-time parliament_](https://dl.acm.org/doi/abs/10.1145/3335772.3335939)

The paper, published in [_ACM Transactions on Computer Systems_](https://dl.acm.org/journal/tocs), even has an editorial note that the paper was "discovered" behind filing cabinets and that the original author was an archeologist that could not be reached due to ongoing field work in the Greek isles. The fun of this article disguised the fact that it was one of the first descriptions of the Paxos algorithm (eponymous with the island in the story) &mdash; an algorithm of which there are dozens of variations[^1], is notoriously difficult to understand[^2], and is the foundation of modern distributed systems[^3].

The metaphors we use to describe systems help us understand them and guide how we advance the state-of-the-art. The primary metaphor of consensus is decision making via a parliament primarily because of this paper, and it has guided how researchers, engineers, and implementations reason about complex interactions. This also shows how important metaphors are to technology and innovation in general. In this post, we explore the parliamentary metaphor in detail and discuss what, if any, other metaphors might assist us in reasoning about distributed systems.

## Distributed Consensus

A distributed system is composed of two or more nodes, often referred to as _replicas_ because they replicate a common data state that is accessed by external clients. As a simple example, let's consider an inventory system where users can checkout items so long as they are not checked out by any other user. The state of the system is the list of items in the inventory and a flag if the item is checked out or not.

State machines are at the core of the theory behind distributed consensus; commands are applied to a state machine, e.g. `checkout(x)` or `checkin(y)` that move the machine from one state to the next. The state should also be readable, e.g. `is_available(x)`. However, this brings us to the essential problem behind a distributed system: how do we synchronize the state machines in the face of concurrent operations to any replica in the system? How can we ensure our observations and system understanding are consistent when we read from different replicas?

A useful property of state machines is that if two machines independently apply the same commands in the same order, they will always arrive at the same state. As a result, the primary concern of a coordinated system is deciding the _ordering_ of commands. Please note my use of terminology &mdash; a system must _decide_ the ordering, not _determine_ the ordering.

In theory, humans believe that time is linear and that the likelihood of true instantaneously occurring events is

## References

- Lamport, Leslie. "[The part-time parliament.](https://dl.acm.org/doi/abs/10.1145/3335772.3335939)" Concurrency: the Works of Leslie Lamport. 2019. 277-317.

- Ongaro, Diego, and John Ousterhout. "[In search of an understandable consensus algorithm.](https://www.usenix.org/conference/atc14/technical-sessions/presentation/ongaro)" 2014 USENIX Annual Technical Conference (USENIX ATC 14). 2014.

## Footnotes

[^1]: Paxos variants include, but are not limited to, MultiPaxos, FastPaxos, Multicoordinated Paxos, Raft, Mencius, SPaxos, Flexible Paxos, Generalized Paxos, Cheap Paxos, Disk Paxos, Vertical Paxos, Alia, WPaxos, ePaxos, and more.

[^2]: In the [Raft paper](https://www.usenix.org/conference/atc14/technical-sessions/presentation/ongaro), the authors present a survey of of seasoned researchers, students, and programmers who have difficulty understanding the Paxos algorithm in detail.

[^3]: Heidi Howards' talk [Liberating Distributed Consensus](https://hh360.user.srcf.net/blog/2019/01/my-reactive-summit-2018-talk-is-now-online/) describes how Paxos is "at the heart of how we achieve distributed consensus today".