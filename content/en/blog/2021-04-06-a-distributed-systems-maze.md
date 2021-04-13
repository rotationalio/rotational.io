---
title: "A Distributed Systems Maze"
slug: "a-distributed-systems-maze"
date: "2021-04-06T13:49:57-04:00"
draft: true
image_webp: images/blog/maze.webp
image: images/blog/maze.jpg
author: Benjamin Bengfort
description : "Distributed systems jargon can feel like a maze that your constantly lost in. In this post we try to see our way clear with a maze metaphor to understand why coordination is necessary and difficult."
---

It is easy to get lost in the maze of algorithms, protocols, and terminology related to distributed systems. It's a complex topic and there are a lot of principled approaches each with their own advantages and disadvantages. Most of the talented engineers and technical executives I know get lost when comparing these approaches usually by misunderstanding two fundamental concepts: coordination and consistency.

These concepts are by no means easy to understand, and most distributed systems approaches try to take advantages of different properties and relaxations of coordination and consistency requirements, further confusing things. To try to create an explanatory mental hook, in this post we don't focus on distributed systems at all, but instead use the metaphor of multiple people navigating a maze to try to understand why coordination is necessary and difficult and what creates consistency issues.

A bit fanciful? Sure, but hard to forget!

Imagine there are two robots trying to find their way through the same exact maze in two different buildings. The robots are given commands by a human team in each building; each robot can communicate with each other but the human teams cannot communicate and they can only give commands to one robot. Successfully completing the task requires both robots to leave the maze as quickly as possible.

Let's make the commands purposefully simple - the human teams can tell their robots to turn left or right, move forward or backward, or to take and send a picture from the forward facing camera. Robots can only execute one command at a time.

If the robots are strictly coordinated then when they receive a command from their human team they will pass the command to the other robot, then execute the command; if it receives a command from the other robot it will simply execute the command. Coordination in this scenario quickly gets out of hand: if two teams give commands simultaneously: "turn left" and "move forward", then the first robot will turn left then move forward, while the second robot will move forward then turn left. They are now in two different positions and the more commands they get, the worse it is. It's unlikely in this scenario that either robot will be able to leave the maze.

We can try to fix the situation by only allowing one robot to receive commands from the human teams. This will ensure that the two robots do not end up in two different positions because the order the first robot receives commands will be the same order that the second robot receives them. However, this causes a lot of load on the first robot, slowing it down &mdash; so we could relax this further and allow the "take picture" command to be executed by both robots. Note that taking a picture will not cause the two robots to be in two different positions, the worst case is that one of the teams receives a picture before the robot immediately moves (e.g. the picture is stale). This scenario is referred to as primary/backup copy in distributed systems.


Multiple robots - eventual consistency?

What do consistency failures look like?

Can we implement transactions?

Now let's add more robots - scale! What if we want no consistency issues?

