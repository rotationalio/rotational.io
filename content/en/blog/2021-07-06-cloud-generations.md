---
title: "Cloud Generations"
slug: "cloud-generations"
date: 2021-07-02T15:32:47-04:00
draft: false
image_webp: images/blog/bridgetoclouds.webp
image: images/blog/bridgetoclouds.jpg
author: Edwin Schmierer
description: "How the public cloud has evolved and where it is headed"
---
There is no doubt that public cloud providers such as AWS and Google Cloud have transformed the technology industry. They have provided critical infrastructure, lowered barriers to entry, and established a global presence. Organizations large and small have a plethora of options when building their technology solutions. One question we have asked ourselves is: What is the future of cloud services? One useful frame to answer this question is to look at the past and how the industry has evolved. We've adopted a "generational" perspective using [Amazon Web Services (AWS)](https://en.wikipedia.org/wiki/Timeline_of_Amazon_Web_Services) as the canonical example and asked what could the the next generation of cloud services look like through the patterns we've observed.

## Foundations
While the term "Cloud Computing" was first coined in [the mid 1990's](https://www.technologyreview.com/2011/10/31/257406/who-coined-cloud-computing/), the genesis of the cloud goes back to the [1960s](https://en.wikipedia.org/wiki/Virtualization). While many technologies enable the cloud, the foundational technical breakthrough was [virtualization](https://www.redhat.com/en/topics/virtualization/what-is-virtualization), which allows the resources of a physical machine to be divided among many users or environments. While the definition and use cases of virtualization have broadened over time, it effectively opened the door to computing at scale and is now applied at the hardware, server and operating system (OS) layers.

## Framing Cloud Generations

### First Generation
We define the first generation of cloud computing services as companies that applied virtualization to rent their spare server capacity. AWS launched in 2006 with the announcements of Amazon Simple Storage Service (S3) and the [Amazon Elastic Compute Cloud (EC2)](https://aws.amazon.com/about-aws/whats-new/2006/08/24/announcing-amazon-elastic-compute-cloud-amazon-ec2---beta/). Amazon was in the middle of building out it's e-commerce and logistics platform and recognized two important points: (1) a key barrier to developing their own applications was that [each engineering team built their own resources](https://techcrunch.com/2016/07/02/andy-jassys-brief-history-of-the-genesis-of-aws/) and; (2) they had a supply of spare server capacity to offer developers at relatively low cost. With these services, developers no longer needed to stand up and maintain their own servers and development infrastructure. The basic infrastructure would be provided by Amazon. Effectively, hardware services were abstracted away and located in distant data centers.

### Second Generation
With hardware abstracted away, cloud service providers started to move up the technology stack. Based on demand from clients, cloud service providers began to offer host data and database services in the cloud. AWS launched [Relational Database Service (RDS) in 2009](https://en.wikipedia.org/wiki/Amazon_Relational_Database_Service) followed by DynamoDB in 2012. At the same time, Microsoft, Google, and others started to offer their own cloud computing services. Database specialists such as MongoDB, which allows for horizontal scaling of databases, [emerged](https://petedejoy.com/writing/mongodb), largely leveraging the cloud and open source software. To developers, both hardware and database services were abstracted.

### Third Generation
This generation can be defined along a few dimensions that's lead us to where we are now as cloud providers continue their march up the stack. First, we have seen the the emergence of data services and compute in the cloud. Cloud providers now offer fully managed services for developers and data scientists to build machine learning models and algorithms. Amazon's SageMaker is prime example. At the same time, Another dimension of this generation is managing processes in the cloud. While [containerization](https://blog.aquasec.com/a-brief-history-of-containers-from-1970s-chroot-to-docker-2016) and microservices architecture are not generally new, the ability to manage them in the could is. Cloud providers now offer orchestration tools such as Kubernetes services to manage clusters. Yet another dimension is [serverless architecture](https://www.cloudflare.com/learning/serverless/what-is-serverless/), which means providing services without having dedicated servers for those services. So developers pay as they go as opposed to access to dedicated resources. One purported benefit of serverless is auto-scaling. Amazon Lambda is an example.

With the third generation, cloud services have been neatly compartmentalized into three broad "as-a-service" models: (1) Infrastructure-as-a-Service (IAAS); (2) Platform-as-a-Service (PAAS) and; (3) Software-as-a-Service (SAAS).

## Patterns & Emerging Tensions
Looking at the past and present, a few patterns emerge. First is the obvious abstraction of backend services. Underlying backend systems have been abstracted away, at relatively low cost to developers. However, there are tradeoffs, specifically around visibility, transparency, and optimization. Along with abstraction is an increasing dependence on a few large public cloud providers that have built infrastructure for their use cases and turned around to offer it others. Vendor lock-in is a concern. Another more subtle pattern is increasingly centralization around large data centers, which has implications for performance and, increasingly, compliance. Lastly, and perhaps most subtle, is a loss of context in data storage and compute, which translates to a less than ideal experience for developers and end users.

## The Emerging Fourth Generation?
As we look ahead, the next generation of cloud services will have to contend with a changing technical landscape that is increasingly influenced by context and geography. Context and geography increasingly matter to users, developers, infrastructure, communities, and governments. Security and privacy-first computing are top of mind and countries are beginning to assert data sovereignty. More applications are being built for the edge as every device is now a "data center". More organizations are seeking multi-cloud solutions along with co-location. [Amazon Outposts](https://aws.amazon.com/outposts/) is an example. The bottom line is that scale still matters, but it's not enough. Despite abstraction and centralization, complexity is only increasing. Developers and organizations have to scale intelligently, thoughtfully, and respectfully.

If we step back and ask, where are we now if this framework of cloud computing generations, we're are most likely between the 3rd and 4th generation. As public cloud adoption grows, more developers and organizations are asking important questions. We are interested in building solutions. At Rotational Labs, we're interested in systems that scale globally and act locally.

***

Photo by [Priscilla Du Preez](https://unsplash.com/@priscilladupreez?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/driving-into-a-cloud?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
