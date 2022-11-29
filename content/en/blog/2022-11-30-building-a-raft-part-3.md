---
title: "Building a Raft (Part 3)"
slug: "building-a-raft-part-3"
date: "2022-11-28T19:51:33-08:00"
draft: true
image: img/blog/2022-11-28-building-a-raft/otterRaft.png
author: "Daniel Sollis"
category: "Distributed Systems"
profile: img/team/daniel-sollis.png
description: "Add Description Here"
---

## Heartbeats
One final thing to note about the **AppendEntries** RPC before we move on to leader election. We mentioned earlier that the leader in **Raft** periodically sends out heartbeats to let the followers know that it is still alive and well. This happens to be done using **AppendEntries**. If A follower receives a typical **AppendEntries** request from the leader it can consider that a heartbeat from the leader, but  we can’t simply rely on that, if a leader doesn’t receive requests from clients then there would be no heartbeats! 

Instead, a leader periodically (say, every n seconds or so) will send AppendEntry requests to all of the followers without any new log entries. Followers can then tell this is a heartbeat from the leader and reset their election timeout, preventing a new election and therefore a new term. Speaking of which, it’s time to move on to the other RPC in **Raft**.

## Leader Election
Leader election in **Raft** is handled by the **RequestVote** RPC. First off, remember at the start of this post that we mentioned that there are three states that a **Raft** server can be in: Leader, Candidate and Follower. We haven’t talked about the candidate state yet because this is where it actually comes into play.

!["State change flowchart"](/img/blog/2022-11-28-building-a-raft/stateChanges.png)

If a **raft** server does not receive any communication from the leader (heartbeat or regular requests) for a given amount of time, it will assume the leader has died and will start a new election to become the new leader, incrementing it’s term, voting for itself and sending **RequestVote** RPCs to the other servers in the cluster. If it receives a majority of the cluster’s votes, it declares itself leader and starts sending out heartbeats. Luckily for us, the **RequestVote** RPC ends up being much simpler than **AppendEntries**, but we should still spend some time exploring it in depth.

## RequestVote Steps
#### 1. Reply false if term < currentTerm
Just like in **AppendEntries**, we can assume that if a candidate requesting a vote has a term less than the follower’s term that it is requesting a vote from, then that candidate is not up to date with the rest of the cluster and we should deny the vote.

#### 2. If votedFor is Null or candidateId, and candidate’s log is at least as up-to-date as receiver’s log, grant vote
Each server in a **Raft** cluster keeps track of who it has voted for (until the next successful heartbeat) with a votedFor field. If that field is null, then it hasn’t voted for anyone in the current term and is free to vote for the candidate that sent the request.

## Wrapping up
And that’s about it for the **Raft** algorithm! If you want to take a crack at implementing the algorithm I would encourage you to read the [original whitepaper by Diego Ongaro and John Ousterhout](https://raft.github.io/raft.pdf), it will give you a deeper dive into the algorithm and provide some explanations for more advanced topics in **Raft** like configurations changes and snapshots.