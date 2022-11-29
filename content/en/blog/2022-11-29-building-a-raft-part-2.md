---
title: "Building a Raft (Part 2)"
slug: "building-a-raft-part-2"
date: "2022-11-28T19:51:18-08:00"
draft: true
image: img/blog/2022-11-29-building-a-raft-part-2/otterRaftTwo.png
author: "Daniel Sollis"
category: "Distributed Systems"
profile: img/team/daniel-sollis.png
description: "In the second part of our series on the Raft consensus algorithm we'll be covering log replication."
---

In the second part of our series on the Raft consensus algorithm we'll be going over what is the beating heart and core of the algorithm: log replication, handled by the AppendEntries RPC

<!--more-->
## Log Replication
**Raft** is mainly composed of two Remote Procedure Calls (RPCs), one handling log replication across servers and the other handling leader election. The RPC that handles log replication, AppendEntries, is the beating heart of the **Raft** algorithm. The **Raft** paper delineates five clear steps for AppendEntries, and it is important to understand each one to understand **Raft**, So we should spend some time going over each one and its purpose.

## AppendEntries Steps
#### 1. Reply false if term < currentTerm
This step handles the problem of out of stale leaders. Since terms are incremented when a new leader comes to power, if a server received an AppendEntries request from a server with a term less than its own, we can assume that this server is out of date, and is not the correct leader (this could also happen if network delays cause an AppendEntries to be late, at which point a new leader may be elected and the request is out of date.)

#### 2. Reply false if log doesn’t contain an entry at prevLogIndex whose term matches prevLogTerm
This step handles the problem of Log ordering. Consider the case where we have three sequential AppendEntries requests sent from a leader to a follower. Because of network delays, these may end up arriving at the follower out of order, causing incorrect log ordering in the follower’s log. 

!["Example of network delay"](/img/blog/2022-11-28-building-a-raft-part-2/networkDelay.png)

To prevent this, **Raft** uses two fields in the AppendEntries request containing the previous request the leader issued. In this way we can ensure that each follower has received the previous command before committing a new one. This also provides two emergent properties, together called the Log Matching Property, that are very important to Raft:

1. If two entries in different logs have the same index and term, then they store the same command
2. If two entries in different logs have the same index and term, then the logs are identical in all preceding entries

#### 3. If an existing entry conflicts with a new one (same index but different terms), delete the existing entry and all that follow it
In the case of things like network partitions (let’s say a leader loses contact with the rest of the cluster, failing to sync with them, but is still receiving client requests), we may run into a situation where a server’s log is out of sync with the rest of the cluster.

!["Possible follower states"](/img/blog/2022-11-28-building-a-raft-part-2/possibleFollowers.png)

To fix this, the leader forces followers to delete inconsistent entries and…

#### 4. Append any new entries not already in the log.
Following up from the previous step, the leader forces followers to duplicate its own log when it finds inconsistencies in the follower’s log.

#### 5. If leaderCommit > commitIndex, set commitIndex min(leaderCommit , index of the last new entry)
Finally, if the index of the highest log entry known by the leader to be committed (leaderCommit) is greater than the highest log entry known by the follower to be committed (commitIndex), than we update the follower with a new commitIndex that is either in line with the leader’s commitIndex, bringing the follower into sync with the leader, or the length of the log, if that is smaller, since in that case we know we don’t yet have all log entries that have been committed.

