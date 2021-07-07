---
title: "A History of the Cloud and Where It's Going Next"
slug: "cloud-generations"
date: 2021-07-02T15:32:47-04:00
draft: false
image_webp: images/blog/bridgetoclouds.webp
image: images/blog/bridgetoclouds.jpg
author: Edwin Schmierer
description: "How the public cloud has evolved and where it is headed"
---
There's no doubt public cloud providers have transformed the technology landscape; in this post we retrace the evolution of the cloud to gather clues into where the industry is headed next.

## Framing Cloud Generations
Cloud providers such as AWS and Google Cloud have provided critical infrastructure, lowered barriers to entry, and established a global presence. Organizations large and small have a plethora of options when building their technology solutions. But one question we've been exploring is: What is the future of cloud services?

At Rotational, we adopt a "generational" perspective, looking to the past to understand [how the industry has evolved](https://en.wikipedia.org/wiki/Timeline_of_Amazon_Web_Services). We use this frame to hypothesize what the next generation of cloud services may look like through the patterns we've observed.

## Foundations
While the term "Cloud Computing" was first coined in [the mid 1990's](https://www.technologyreview.com/2011/10/31/257406/who-coined-cloud-computing/), the genesis of the cloud goes back to the [1960s](https://en.wikipedia.org/wiki/Virtualization). Many technologies enable the cloud, but the foundational technical breakthrough was [virtualization](https://www.redhat.com/en/topics/virtualization/what-is-virtualization), which allows the resources of a physical machine to be divided among many users or environments. Virtualization opened the door to computing at scale, and the definition and use cases have only broadened over time. The term is now applied up and down the hardware, server and operating system (OS) layers.

### First Generation
We define the first generation of cloud computing services as companies that applied virtualization to rent their spare server capacity. AWS launched in 2006 with the announcements of Amazon Simple Storage Service (S3) and the [Amazon Elastic Compute Cloud (EC2)](https://aws.amazon.com/about-aws/whats-new/2006/08/24/announcing-amazon-elastic-compute-cloud-amazon-ec2---beta/).

At the time, Amazon was in the middle of building out it's e-commerce and logistics platform and recognized two important points:

 1. a key barrier to developing their own applications was that [each engineering team built their own resources](https://techcrunch.com/2016/07/02/andy-jassys-brief-history-of-the-genesis-of-aws/) and;
 2. they had a supply of spare server capacity to offer developers at relatively low cost.

With these services, developers no longer needed to stand up and maintain their own servers and development infrastructure. The basic infrastructure would be provided by Amazon. Effectively, hardware services were abstracted away and could now be located in distant data centers.

### Second Generation
With hardware abstracted away, cloud service providers started to move up the technology stack. Based on demand from clients, cloud service providers began to offer host data and database services in the cloud.

In 2009 AWS launched [Relational Database Service (RDS)](https://en.wikipedia.org/wiki/Amazon_Relational_Database_Service) followed by DynamoDB in 2012. At the same time, Microsoft, Google, and others started to offer their own cloud computing services. Specialized solutions such as MongoDB, which allows for horizontal scaling of databases, [emerged](https://petedejoy.com/writing/mongodb), largely leveraging the cloud and open source software.

From the developer perspective, both hardware and database services could now be abstracted.

### Third Generation
The third generation has been an especially energetic one, as cloud providers have continued their march up the stack.

First, we have seen the emergence of data services and compute in the cloud. Cloud providers now offer fully managed services for developers and data scientists to build and host machine learning models and algorithms. Amazon's SageMaker is prime example.

Another dimension of this generation is the move towards managing complete applications in the cloud. While [containerization](https://blog.aquasec.com/a-brief-history-of-containers-from-1970s-chroot-to-docker-2016) and microservices architecture are not generally new, the ability to manage them in the cloud is. Cloud providers now offer orchestration tools such as Kubernetes that allow for the deployment and maintenance of complex processes and architectures on managed clusters.

Yet another dimension is [serverless architectures](https://www.cloudflare.com/learning/serverless/what-is-serverless/), which means providing compute services without the need for dedicated servers. So developers have the option to pay as they go as opposed to allocating dedicated resources. One purported benefit of serverless is auto-scaling. Amazon Lambda is an example.

With the third generation, cloud services have been neatly compartmentalized into three broad "as-a-service" models:

 - Infrastructure-as-a-Service (IAAS)
 - Platform-as-a-Service (PAAS)
 - Software-as-a-Service (SAAS)

## Patterns & Emerging Tensions
There are several clear patterns.

First is the obvious abstraction of backend services. Underlying backend systems have been abstracted away, at relatively low cost to developers. You can build systems that connect coworkers and users around the world without having to think much about where data is stored or how it's replicated. However, as we'll see below, there are tradeoffs, specifically around visibility, transparency, and optimization.

Along with abstraction is an increasing dependence on a few large public cloud providers that have built infrastructure for their use cases and turned around to offer it to others. Not only is vendor lock-in a concern, there's some question as to whether commoditized one-size-fits-all infrastructures are actually relevant or cost-effective for the everyday cloud consumer.

Another more subtle pattern is the increasingly centralization around large data centers, which has implications for performance and, increasingly, compliance. Legal and political systems are starting to catch up. If you've leveraging and abstracted storage layer built on centralized data centers, how can you be sure you aren't violating GDPR?

Lastly, and perhaps most subtle, is a loss of context in data storage and compute, which translates to a less than ideal experience for developers and end users. If data geography has been effectively abstracted away, will you be able to anticipate geographic scaling events?

## The Emerging Fourth Generation?
At Rotational Labs, we believe the industry is on the cusp of a 4th generation. While excitement about cloud-hosted data, ML, and devops is still high, we're likely headed for a new season that's characterized by a greater emphasis on cloud economics (a la the [Duckbill Group](https://www.duckbillgroup.com/services/cloud-finance-analysis/)) than purely on convenience.

As cloud adoption grows, developers and organizations are asking important questions. We are hearing more and more that context and geography matter to users, developers, infrastructure, communities, and governments. Security and privacy-first computing are also top of mind, as countries are beginning to assert data sovereignty. More organizations are seeking multi-cloud solutions along with co-location (e.g. [Amazon Outposts](https://aws.amazon.com/outposts/)). More applications are being built for the edge as every device is now a "data center". The next generation of cloud services will have it's hands full in contending with this changing technical landscape!

The bottom line is that scale still matters, but it's not enough &mdash; because despite abstraction and centralization, complexity is only increasing. At Rotational, we believe the solution is systems that scale globally and act locally, enabling developers and organizations to scale intelligently, thoughtfully, and respectfully.

***

Photo by [Priscilla Du Preez](https://unsplash.com/@priscilladupreez?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/driving-into-a-cloud?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
