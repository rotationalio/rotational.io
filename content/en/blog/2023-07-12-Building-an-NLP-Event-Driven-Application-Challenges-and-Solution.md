---
title: "Building a NLP Event Driven Application Challenges and Solution"
slug: "Building-a-NLP-Event-Driven-Application-Challenges-and-Solution"
date: "2023-07-12T21:45:10-04:00"
draft: false
image: img/blog/
photo_credit: "Add Photo Credits Here"
author: Aatmaj Janardanan
profile: img/team/aatmaj-janardanan.png
category: "Debugging"
description: "Sharing challenges encountered when developing an NLP event-driven application"
---

During the process of building an event-driven application that involved fetching data from Baleen, an automated ingestion service for RSS feeds, we encountered a few challenges. In this blog post, I would like to share my experiences and the solutions we discovered along the way.

<!--more-->

## The Initial Issue: No Data Fetching

At the beginning of the development process, we faced a roadblock when we realized that we couldn't see any data being fetched from Baleen while using the subscriber. After investigating the issue, we initially attributed the problem to the current API in the Python SDK for Ensign. But on further investigating Baleen's functionality we could better understand the issue and decided to dig deeper into Baleen's functionality. We ran the Baleen debug command locally and manually triggered the post:adds command to publish a single article at a time. This helped us verify that the cloud version of Baleen was working properly. During our investigation, we discovered that the deployed version of Baleen used a custom marshaller to convert Ensign events into Watermill events. This marshaller was defined in the messages.go file. Its purpose was to marshal the event into msgpack bytes using the event.MarshalMsg function.

{{<figure src="/img/blog/2023-07-12-Building-a-NLP-Event-Driven-Application-Challenges-and-Solution/meme2.png" alt="Meme">}}

## Unmarshalling Watermill Messages in Python

To address the issue of fetching data from Baleen, we needed to find a way to unmarshal Watermill messages correctly in Python. We realized that Baleen was marshaling events with msgpack, which is essentially a binary JSON format. Hence, we needed to find a Python library that could unpack these events accurately.
After some research, we came across the msgpack Python library, which provides CPython bindings for reading and writing MessagePack data. Using this library, we were able to unpack the event correctly by deserializing the msgpack bytes.
With the help of the msgpack library, we could now process the Watermill messages and extract the necessary data for our NLP research.

## Key Learnings:

1.	Understand the API: Gain a clear understanding of the APIs and SDKs to identify any limitations or issues.
2.	Thorough investigation: Conduct extensive research, run local debug commands, and trigger actions to verify functionality.
3.	Custom Marshaller: Recognize the use of custom marshallers for converting events between frameworks, enabling interoperability.
4.	Research Python Library : 
    - Documentation: Read the library's documentation to understand its features, requirements, and usage instructions.
    - Compatibility: Ensure the library is compatible with the Python version and project dependencies.
	- Community Engagement: Evaluate the level of community engagement, such as discussions and forums, to gauge the library's support and active development.
	- Test and Evaluate: Set up a separate test environment to experiment with the library, assess its performance, stability, and suitability for your specific project requirements.
