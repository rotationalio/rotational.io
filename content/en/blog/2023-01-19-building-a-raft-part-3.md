---
title: "Building a Raft (Part 3)"
slug: "building-a-raft-part-3"
date: "2023-01-09T19:51:33-08:00"
draft: true
image: img/blog/2023-01-19-building-a-raft-part-3/otterRaftThree.png
author: "Daniel Sollis"
category: "Distributed Systems"
profile: img/team/daniel-sollis.png
description: "In the third and final part of our series on the Raft consensus algorithm we'll wrap up by going over leader election."
---

In the third and final part of our series exploring the popular Raft consensus algorithm we'll finally explore how Raft handles leader election, and in doing so discover how Raft is so incredibly resilient.

<!--more-->

There's One final thing we need to cover about the **AppendEntries** RPC that will be very important for leader election.

## Heartbeats
We mentioned in part 2 that the leader in **Raft** periodically sends out heartbeats to let the followers know that it is still alive and well. This happens to be done using **AppendEntries**. If a follower receives a typical **AppendEntries** request from the leader it can consider that a heartbeat from the leader, but  we can’t simply rely on that. If a leader doesn’t receive requests from clients then there would be no heartbeats!

Instead, a leader periodically (say, every n seconds or so) will send AppendEntry requests to all of the followers without any new log entries. Followers can then tell this is a heartbeat from the leader and reset their election timeout, preventing a new election and therefore a new term. Speaking of which, it’s time to move on to the other RPC in **Raft**.

## Leader Election
Leader election in **Raft** is handled by the **RequestVote** RPC. First off, remember at the start of this series we mentioned that there are three states that a **Raft** server can be in: Leader, Candidate and Follower. We haven’t talked about the candidate state yet because this is where it actually comes into play.

!["State change flowchart"](/img/blog/2023-01-19-building-a-raft-part-3/stateChanges.png)

If a **raft** server does not receive any communication from the leader (heartbeat or regular requests) for a given amount of time, it will assume the leader has died and will start a new election to become the new leader, incrementing it’s term, voting for itself and sending **RequestVote** RPCs to the other servers in the cluster. If it receives a majority of the cluster’s votes, it declares itself leader and starts sending out heartbeats. Luckily for us, the **RequestVote** RPC ends up being much simpler than **AppendEntries**, but we should still spend some time exploring it in depth.

## RequestVote Steps
#### 1. Reply false if term < currentTerm
Just like in **AppendEntries**, we can assume that if a candidate requesting a vote has a term less than the follower’s term that it is requesting a vote from, then that candidate is not up to date with the rest of the cluster and we should deny the vote.

#### 2. If votedFor is Null or candidateId, and candidate’s log is at least as up-to-date as receiver’s log, grant vote
Each server in a **Raft** cluster keeps track of who it has voted for (until the next successful heartbeat) with a votedFor field. If that field is null, then it hasn’t voted for anyone in the current term and is free to vote for the candidate that sent the request.

## Wrapping up
And that’s about it for the **Raft** algorithm! If you want to take a crack at implementing the algorithm I would encourage you to read the [original whitepaper](https://raft.github.io/raft.pdf) by Diego Ongaro and John Ousterhout. It will give you a deeper dive into the algorithm and provide some explanations for more advanced topics in **Raft** like configuration changes and snapshots.

Writing your own implementation of **Raft** is definitely a difficult task, but if you're at all interested in distributed systems it's a fantastic way to get started down the path of learning about the field. For further reference you can check out [Rotational Labs' implementation of Raft.](https://github.com/rotationalio/Raft). If you missed the first two parts of our **Raft** series you can find part 1 [here](https://rotational.io/blog/building-a-raft-part-1/) and part two [here](https://rotational.io/blog/building-a-raft-part-2/).