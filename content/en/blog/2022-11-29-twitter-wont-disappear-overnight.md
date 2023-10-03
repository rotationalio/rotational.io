---
title: "No, Twitter Won't Disappear Overnight"
slug: "twitter-wont-disappear-overnight"
date: "2022-11-29T16:52:09-05:00"
draft: false
image: img/blog/2022-11-29-storm-clouds.jpg
authors: [Edwin Schmierer]
profile: img/team/edwin-schmierer.png
tags: ['Distributed Systems']
photo_credit: Photo by Drew Hays on Unsplash
description: "In this post we delve into the logistics of a real world distributed system, and explore what failure does and does not look like."
---


In this post we'll explore the question, how does a distributed system *actually* die?

<!--more-->

> Reports of my death have been greatly exaggerated. - Samuel L. Clemens (aka Mark Twain)

At Rotational, we are avid users of Twitter. Like many, we use the service to engage with the communities we care about, stay informed, and learn from others. As such, we have been watching Elon Musk's "Twitter Drama" with concern and interest. One curious sentiment we've noticed is the expectation from many users that Twitter will fail overnight and suddenly disappear due to mismanagement.

We've seen users post eulogies (with the #RIPTwitter hashtag) and read [articles](https://www.nytimes.com/2022/11/18/technology/elon-musk-twitter-workers-quit.html) foreshadowing Twitter's demise as a social network. This all suggests you'll go to bed after "doom scrolling" on Twitter tonight and wake up tomorrow to a permanent [Fail Whale](https://www.techopedia.com/definition/1987/fail-whale), disconnected from your followers and community.

Putting aside Elon Musk's management decisions and execution (much of which we disagree with), as application developers with a focus on distributed systems, this suggests two fundamental and related misunderstandings about Twitter.


## Misunderstanding 1: It’s “Just” An App

The first misunderstanding is that Twitter is “just a website” or “just an app”. This notion that Twitter is a lightweight app that lives on your mobile device belies a misunderstanding about the brittleness or fragility to online services. This may have been true when Twitter was founded 16 years ago when “Fail Whales” were common across the internet, but times have changed, and Twitter has scaled to serve a global user base that includes [237.8 million daily active users](https://s22.q4cdn.com/826641620/files/doc_financials/2022/q2/Final_Q2'22_Earnings_Release.pdf). To support this level of service consistently, Twitter relies on a robust distributed system with custom databases, sophisticated cloud architectures, and networked microservices. Under the hood, it’s much more than an app.

## Misunderstanding 2: Scaling is “Easy”

The corollary to it’s “just an app” is that scaling is easy. It’s a digital product, so adding new services and users must be marginal, right? In fact, scaling is one of the most challenging and expensive activities of global apps. Just ask [Mastodon](https://joinmastodon.org/) and [Cohost](https://cohost.org/rc/welcome), potential Twitter substitutes that are buckling at the influx of so many new users.

The dirty truth? Distributed systems break *all the time*. Failure is the normal state of a distributed system. Software and devops engineers know this so they architect systems to be resilient by default, specifically to ensure high availability, fault tolerance, and disaster recovery. This is often achieved by building in redundancies (data centers, servers, processes, people), and replicating data across the system. Distributed systems engineers try to leverage the most advanced algorithms coming out of academic research to ensure the best data consistency possible in addition to performance. Software and devops engineers also apply important distributed system design patterns such as circuit breakers and fallbacks to manage major issues. In other words, a great deal of time, energy, and resources go into supporting a robust distributed system.

All that resilience comes at a cost, though, creating complexities related to coordination and consistency that are no doubt difficult to explain to an impatient incoming head honcho.

## Signals to Watch For

If Twitter does fail, it will fail slowly over time, most likely because there are not enough engineers to maintain the system or as microservices are taken offline to cut costs. Some signals of system degradation and potential failure include:

### Latency
Speed is a key indicator. If you notice that it takes much longer for your Twitter feed to update, your messages to post, or to load the app, then this could be an indicator that Twitter's system is degrading.

### Inconsistencies
If you notice that what you see on your phone is different than what you see on your tablet or laptop (e.g. missing or incomplete data), then it could indicate system failures.

### Ordering
Another signal of degradation is out-of-order direct messages (DMs) or your feed displays in an increasingly non-chronological order.

### Unavailable Ancillary Services
In addition to its core microblogging service, Twitter provides ancillary services to developers building tools with Twitter's data. If the [Twitter API](https://developer.twitter.com/en/docs/twitter-api) begins to fail or become unavailable, it could signal that the system in general is at risk.

![elon tweet](img/blog/2022-11-29-elon.jpg)

## The Takeaway: Resiliency is More Critical Than Ever

Twitter is emblematic of how distributed systems have come to play increasingly important and arguably dominant roles in daily life. These systems have become integral to modern digital services, commanding a great deal of resources. Resilient distributed systems will only become more critical as more services, more of our time, and more of the economy move online, requiring always-on, available-anywhere computing services.

The risk for Twitter isn’t the technical infrastructure, but the business model and leadership needed to maintain and grow its services. At this point, Twitter’s fate is unclear. Regardless, the next time you access your favorite app, take a moment to consider the distributed system - and people - who make it reliably available, accessible, and integral to your needs no matter where you are.


---

Photo by [Drew Hays](https://unsplash.com/@drew_hays) on [Unsplash](https://unsplash.com/photos/JHHDUs23wjA).

---
