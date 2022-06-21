---
title: "Five Technologies Quietly Transforming the Web"
slug: "five-technologies-quietly-transforming-the-web"
date: "2022-06-20T13:00:01-04:00"
draft: false
image_webp: images/blog/model_t.webp
image: images/blog/model_t.jpg
author: Edwin Schmierer
description: "This post describes the significance of five technologies - new and old - that are transforming the web as they gain widespread adoption and become the foundation for next gen applications."
---
With almost 30 billion connected devices, "this isn’t Al Gore’s internet anymore." 

Consider this: According to [Cisco’s Annual Internet Report](https://www.cisco.com/c/en/us/solutions/collateral/executive-perspectives/annual-internet-report/white-paper-c11-741490.html), there will be 29.3 billion internet-connected devices in 2023, or more than three for every human. The internet has no doubt transformed society and industry, as well as it has proved to be resilient and scalable. It also continues to evolve.<!--more--> 

Under the hood, we believe there are five technologies that are transforming the web. Many of these technologies have been around for years, but are just now gaining widespread adoption and thus becoming the foundation for applications of the next generation.

# #1: Artificial Intelligence (AI)/ Machine Learning (ML)

Let’s start with the most obvious and least “quiet”: AI/ ML. We’ve all experienced the hype (and most likely the disappointment). What might not be obvious is that the most impactful applications of AI/ML are the ones you never hear about.

Companies have begun to natively weave AI/ML into a range of consumer and business applications, applying it to specific use cases. On the consumer side, health applications and devices that can track a variety of vitals specific to a user are an obvious example. Fraud detection is a good example of use in industry. AI/ML depend both on models and, most crucially, the quality and volume of data. Increasingly, what matters most is the application of data in context. 

From an ethical perspective, this raises questions about privacy and data custodianship: who owns the data and thus can derive the most value from it? How do users opt in and opt out? How are the underlying models managed and audited? 

We’ve seen a range of data privacy laws emerge over the past few years. Moreover, data across applications tend to be siloed, providing only a partial picture or incomplete solution. This poses a challenge to users who must navigate several data sources, cross-pollinating in order to gain better insights and richer experiences.

# #2: HTTP2 & HTTP3

One of the core protocols underlying the internet is Hypertext Transfer Protocol, also known as HTTP. At its core, HTTP is an application-layer protocol that enables websites and servers to communicate and share resources. When a user lands on a website, an HTTP request is sent to a remote web server, which then receives, processes, and responds to the request with an HTTP response. 

HTTP/1.1 has proved a durable and elegant solution to share media resources across the web. Still, its plaintext encoding has engendered a need for it to adapt in order to fit many use cases it wasn’t necessarily designed for, such as web sockets and long-term connections. As an analogy, HTTP/1.1 is like the Model T automobile, in that Henry Ford didn’t know we would build interstate highways; HTTP/1.1 simply wasn’t designed to handle massive-scale internet traffic and multi-modal content. 

In contrast, HTTP/2 marks a significant improvement from HTTP/1.1. Standardized in 2015, the primary difference is that HTTP/2 is a binary format in contrast to plaintext encoding. Because of its binary encoding, [HTTP/2](https://ably.com/topic/http-2-vs-http-3) allows for full duplex communication; the web browser can handle multiple requests in parallel over one connection. Because of its binary format, HTTP/2 adds security and massively improves performance, e.g. variable inline encoding, compression, and better performance management overall. In other words, HTTP/2 is much better suited than its predecessor for secure, multi-channel communication at scale. 

Currently, [HTTP/3](https://twitter.com/danielbryantuk/status/1534500437671411714) is under development as a standard and gaining traction. HTTP/3 better addresses how we access the internet today &mdash; with users streaming data across multiple devices, locations, and access points. The bottom line: mass adoption of HTTP/2 and HTTP/3 will enable a diversity of richer and more secure experiences across modalities.


# #3: Event-driven Architecture (EDA)

Since [Apache Kafka](https://kafka.apache.org/) was open sourced in 2011, event-driven applications have gained popularity. Event-driven Architecture (EDA) refers to a design pattern for building applications as a collection of highly decoupled, single-purpose event processing components that asynchronously receive and process events.

This design pattern allows organizations to track and detect “events” and then instantly act on them. Events are broadly defined as “a significant change in state.” Examples include a consumer placing an item in an online shopping cart or a sensor reading a threshold temperature.

EDA is perhaps best understood in contrast to conventional application frameworks. Traditional web applications follow a request-response design pattern: a resource such as a server or database waits passively for a client to make a request. Once a request is made, the server responds and waits passively for the next request. In effect, communication is passive, which affects performance, user experience, and potentially availability, since both client and server depend on a synchronized connection.

EDA flips this approach by employing active agents that produce and consume events asynchronously. Producers publish events to a log (or logs) that any number of consumers can subscribe or listen to and act upon. With EDA, data flows move from a passive, “polling/ querying” approach to an active, “subscribe to a stream of changes” approach.

EDA-designed applications consist of active agents passing messages to each other, more effectively mirroring real-life data flows and communications, instead of passive services. EDA opens the door to interactions and streaming experiences that are more immediate and high-quality, and that possess a greater capacity for resiliency and fault tolerance.
From an analytics perspective, EDA allows for more granular, higher-frequency updates on a continual basis, leading to much fresher data and quicker time to insight as opposed to “batch” paradigms defined as one big update, once per day, and slow to query.

# #4: WebAssembly (WASM)

On the front-end side of web applications (i.e. what users typically interact with in the browser), [WebAssembly](https://webassembly.org/)(WASM) is gaining traction. Javascript, released in 1995 by Netscape, has been the primary language for developing front-end or client-side web interfaces.

While Javascript still dominates today, it was not natively designed for CPU-intensive applications such as video processing, 3D rendering, multimedia games, cryptographic computations, and augmented/ virtual reality (AR/VR) applications in the browser. WASM fills this (rather large) gap as user expectations change and backend systems evolve to support more broad, computationally-intensive applications. Developed by the World Wide Web Consortium (W3C) and released in 2015 as a standard, WASM 1.0 is supported by Chrome, Firefox, Safari, and Edge to handle high-performance applications.

To be clear, WASM is not a programming language; it is a conceptual machine that converts code written in a high-level programming language to browser-understandable machine code. The fundamental idea is that the browser has a virtual machine that executes machine code with its own instruction set. Developers can write programs in any programming language &mdash; such as Javascript on the client side or C on the server side &mdash; and these programs are then compiled by a WASM module into machine code.

WASM was designed to be fast, efficient, portable, and secure. Because WASM compiles machine code in the browser, the browser handles its access to operating system features so it can leverage common hardware capabilities to execute at “near native speeds”. Portability is also important. Since WASM is a conceptual machine with a binary instruction format, it executes independently of operating systems, browsers, and languages while maintaining backward compatibility. 

Together with the [WebAssembly System Interface](https://hacks.mozilla.org/2019/03/standardizing-wasi-a-webassembly-system-interface/) (WASI), WASM offers an alluring future:  developers will be able to build high-speed web apps in the language of their choice with a fast, scalable, secure way to run the same code across all devices i.e. in the browser, locally, in the cloud, and at the edge.

# #5: Distributed Systems

As the number of users and devices grows, complexity increases and distributed systems become more important. Distributed systems go beyond cloud computing: distributed systems invoke independent components installed on different systems (cloud or not) to communicate with one another across geographies to achieve a shared objective.

Application developers have to manage an array of increasing complexities, both technical and social. On the technical side, there are issues of security, consistency, consensus, performance, and durability across an increasingly mobile user base. From a social perspective, there are issues of consumer privacy and complying with data sovereignty laws as well as increasing interest in data transparency, visibility and custodianship.

Distributed systems play a key role in designing, managing, and maintaining next generation applications that meet user expectations for performance, security, privacy, and availability. At Rotational, we believe many of these issues revolve around locality: putting the computing resources where they need to go, no matter where that is. Computing and storage in context have become increasingly important, and distributed systems are a critical element to making complexity possible and manageable.

# Every Device Is A Data Center

We live in an age when every device is a data center. The internet and its underlying technologies are evolving to adapt to this reality. Application developers and organizations that build digital products must also adapt and leverage these technologies to build next-generation applications.These technologies should not just be in reach of large, well-resourced  cloud-native tech companies; they should be accessible to all builders. 

At Rotational, we strive to make meaningful contributions and partner with developers building next-generation applications. As a first step, over the next few months, we’ll take a deeper dive into each of these technologies or trends. We hope you’ll come along for the ride.

***

Photo by [Internet Archive Book Images](https://www.flickr.com/photos/internetarchivebookimages/) on [Flickr Commons](https://flic.kr/p/otfVz5)

***         