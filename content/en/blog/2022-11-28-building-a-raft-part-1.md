---
title: "Building a Raft (Part 1)"
slug: "building-a-raft-part-1"
date: "2022-11-28T09:30:05-08:00"
draft: true
image: img/blog/2022-11-28-building-a-raft/otterRaft.png
author: "Daniel Sollis"
category: "Distributed Systems"
profile: img/team/daniel-sollis.png
description: "Add Description Here"
---

Recently you may have heard about the growing field of distributed systems, or maybe you already know about it and are just curious. Distributed systems have become more and more of a central part of software engineering each year as the focus of modern applications becomes global. 

<!--more-->

With single applications needing to operate across the entire globe, it begs the question,  how can we maintain availability with our applications and prevent data loss when servers inevitably crash?

This brings us to the topic of consensus algorithms and in particular, **Raft**. Consensus algorithms are a class of algorithms that achieve the goal of  getting multiple servers to agree on a single or a series of values (i.e. a log). This allows for globally distributed servers to be replicated and prevent losses of either availability or data. Raft is a relatively new and extremely popular consensus algorithm that we can use to start diving in!  

## Introducing Raft
**Raft**, like other consensus algorithms, is used to create a series of replicated state machines. State machines in the context are used to stand in for a generic process we might want to replicate, whether that’s a file system, an event broker or really any other storage mechanism.

The **Paxos** algorithm has historically been the go-to algorithm for solving consensus, but **Paxos** is notoriously difficult. Raft was designed to alleviate the difficulty of understanding (and the even tougher challenge of implementing) **Paxos**, and because of this, makes for a good place to start learning about the wide world of consensus algorithms.

## The Basics
First of all, Each server in a **Raft** cluster is at any time in one of three states: 

* **Leader**
* **Follower** 
* **Candidate**

**Raft** is a leader driven algorithm, in a **Raft** cluster there can only be one leader at a given time and that leader is responsible for accepting requests and keeping the log updated. **Raft** is based on the principle that requests flow one way. When a new client request comes in, it will be given to the leader, which will take action and then pass on the new information to the rest of the followers. The leader is also responsible for sending periodic heartbeats to its followers to let them know it is still active.

Followers are in charge of two things, responding to the leader’s requests (such as to append new entries to its log) and, in the case that the follower hasn’t heard from the leader in a long enough time, starting an election to pick a new leader.

Time in **Raft** is divided into what it calls Terms. Terms in **Raft** are equivalent to each leader's reign (); if an election is triggered and a new leader is decided on, a new term begins. Each server in a **Raft** cluster is responsible for keeping track of the current term. Terms are used in **Raft** to allow servers to detect obsolete information and ensure that there is only one leader at a given time.

!["Terms in Raft"](/img/blog/2022-11-28-building-a-raft/raftTerms.png)

It should be noted that leaders also keep track of which log entries are considered committed. An entry is committed if the leader has received confirmation that it has been replicated to a majority of servers. Once an entry is committed **Raft** guarantees that that entry is durable and will eventually be replicated to all other servers.
