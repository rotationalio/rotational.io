---
title: "Welcome to the Age of PostSQL"
slug: "age-of-postsql"
date: "2023-05-09T09:44:57-04:00"
draft: false
image: img/blog/postmodern.jpg
author: Rebecca Bilbro
category: Databases, Eventing
photo_credit: Photo by Bervaz via Flickr Commons
description: "Messiness is the norm for data, not the exception. Let's stop searching for the 'one true' database and just pick tools that help us get the job done."
profile: img/team/rebecca-bilbro.png
---

Calling all programmers! It's time to get a bit more curious about data storage, because we're about to enter the age of PostSQL...

<!--more-->

## Hot Mess or Homemade Hybrid?

For some reason, we are all quite insecure about our databases. I've worked on a lot of engineering teams, from the public sector to enterprises to startups, and this may be the one thing everyone has in common. Why?

As programmers, many of us feel a level of ambivalence about architecture. On one hand, are architectural decisions really our business? Do you need to care about the isolation levels of Kafka or the use cases of vector databases?

So while we don't fully understand the data tools we're using or how they measure up to other options, we also know architecture has a *huge* impact on us; it determines the success of our software and ultimately even the organizations we work for. This ambivalence makes us assume we're doing things "wrong" and everyone else is doing it "right" (have you noticed how effectively SaaS and commercial cloud advertising has gotten at tapping into this anxiety??). But it might not be as bad as you think.

Over the last decade I've allowed myself to get increasingly curious about data storage, and what I have actually observed at the organizations I've worked is not a pile of hot messes but a lot of "homemade hybrids" &mdash; creative blends of data storage, querying, and processing tools.

Consider the 5 following hypothetical/anonymized examples of hybrid data layers at different organizations:

- **Enterprise A**, whose frontend and backend teams manage two different PostgreSQL databases and use Google PubSub to ferry data back and forth.
- **Business B**, that uses RDS for secure storage, Redshift for querying, and Databricks for research and development.
- **Company C**, which inherited a legacy MySQL Server database, that gets regular data dumps from 3rd party partners into S3, and uses Athena to materialize the bucket data as pseudo-SQL and Apache Superset to visualize all of it together in a dashboard.
- **Organization D**, that currently uses a CockroachDB instance deployed on Google Cloud to manage its transactional data and a DocumentDB instance on AWS to store more detailed data about customers and products.
- **Startup E**, that's using a custom-sharded LevelDB instance for key-value customer data storage, distributed SQLite for in-app account management, and an event stream to quickly observe scaling events.

Do any of these sound familiar? Are you a Company C? Have you worked for an Enterprise A? Stitching tools together is not a red flag, it's just the norm! There's no such thing as the "correct" architecture; it's purely a question of which data problems you are solving for.

## Red Flags
So what are the red flags in homemade hybrids? Here are some of the signs that it's time to get a bit more curious about storage at your organization:

### 1. The tools you're using aren't working for what you need them to do
For instance, maybe queries are fast, but writes/upserts are so slow that they're preventing you from launching a high value new feature. Or your message bus is crazy fast, but you actually care more about persisting event data than throughput.

### 2. You're doing things manually that databases are good at
For instance, you're generating and applying unique identifiers, or having to devise ways of reconstructing history by putting changes to an object in chronological order.

### 3. You're using batch ETL for a use case better served by eventing
For example, you need to copy data from location X to location Y. Bonus points if this happens periodically and you lay awake at night worrying something important has changed since the last batch ETL.

### 4. The data analysts don't have a way to "talk back" to the application
For example, your data-driven intelligence processes are orphaned and/or require someone to kick off a manual process. Alternatively, your data scientists are building models, but don't feel confident navigating the MLOps.

## Maintenance Surface Area

The challenge is this: every tool comes with fixed, standing operational and maintenance costs. This is true of homemade hybrids as well as off-the-shelf and managed solutions. As we stitch together more and more tools, we have to write more and more code to coordinate our data. Tech teams can leverage external APIs where available, but often need to write their own SDKs or at the very least engage in routine patching to maintain synchronization as the tools and APIs continually evolve.

As coordination code increases, bugs are introduced and our maintenance "surface area" gets bigger. This leads maintenance costs to increase even as, paradoxically, tech debt stays roughly level. You can usually observe this playing out in the organizational budget in real time, as operational costs spike and don't drop back down, and burn rates steadily rise.

You might guess that choosing a brand name cloud solution is the best way to minimize costs. However, research [^1] [^2] [^3] suggests most companies don't actually get much of a return from commercial cloud. It's surprisingly tough to take a generic cloud solution and make it work really well for any non-trivial business problem.

So the trick is to minimize your maintenance surface area and pick tools geared towards the *specific issues* you're observing in your data layer, and that's what PostSQL is all about.


## What is PostSQL?

So what is PostSQL? Well, it might look a little quirky at first.

A PostSQL database is one that embraces the specificity of a new data problem &mdash; probably one that's emerged over the last 5-10 years. They often have eclectic features such as elements of both relational and NoSQL databases, or a unique combination of NoSQL features, or else a hybrid object-oriented and functional perspective of data. They are not billed as one-size-fits-all tools, and take a non-dogmatic approach when comparing themselves to other tools and solutions.

Here are a few examples:

- [DuckDB](https://duckdb.org/) is like a columnar SQLite for OLAP, and it's recently taken the Python/data science communities by storm. It's good at in-memory analytics, and you can interact with it like you'd use a Pandas dataframe.
- [TigerBeetle](https://tigerbeetle.com/) is a database for distributed financial transactions, and solves a lot of the critical safety problems (gray failure, latency, etc) that the DeFi movement taught us to worry about.
- [RisingWave](https://www.risingwave.dev/docs/current/intro/), currently in beta, is like a PostgreSQL for Kafka and Pulsar users. It offers a database for longterm topic storage, querying, and aggregation.
- [Ensign](https://rotational.io/ensign/), also now in [free beta](https://rotational.app/register), features fully managed eventing for data analytics, making it easier for teams to share data with less bureaucracy and publish data science outputs back to the application. It also offers event persistence and end-to-end encryption by default.

The main thing that distinguishes PostSQL solutions is that they're not only unapologetically unconventional, they also help solve very real, very timely problems. Think: performant and energy-efficient machine learning; strongly consistent high-speed transactions; event persistence; data privacy; realtime analytics; MLOps. These are relatively new problems, and they're still hard to solve.


## Conclusion

> Through a vicious circle of pure reason, skepsis itself becomes dogma. -Johann Georg Hamann

We're often made to feel that our organization's data layer is a special kind of hell. That our problems could be solved by migrating to a data store that matches our platonic ideal of a relational (it's perfectly normalized) or NoSQL (it's perfected indexed) database. But if those ideals aren't serving your organization, it's time to let them go.

Instead of doubling down on overgeneralized commercial cloud solutions, or internalizing our frustrations with whatever homemade hybrid we've inherited, we should look for tools that will actually help us solve our problem.

If your organization is either on the verge or in the midst of a data layer upgrade, ask yourself two questions:

- How hard will this tool be to hook up to our legacy stuff? Your legacy stuff probably powers a lot of important functions and reports, and it may be harder to get rid of than you think. It may also still have utility, like serving as a sink or source in your new architecture.
- How much will it really cost me to keep the tool operational and how many dedicated engineers are going to have to maintain it? It might seem safer to buy from a big box cloud vendor, but no tools come entirely free of operational costs (cloud vendor APIs are always changing too!) and it may be costly to customize a brand name solution to your business case.

Messiness is the norm for data, not the exception. Let's stop searching for the "one true database" and instead pick tools that honor the reality of our data and help get the job done. Don't be afraid to get curious and lean into the PostSQL revolution!

[^1]: [McKinsey, Technology Trends Outlook 2022 Cloud and edge computing](https://www.mckinsey.com/~/media/mckinsey/business%20functions/mckinsey%20digital/our%20insights/the%20top%20trends%20in%20tech%202022/McKinsey-Tech-Trends-Outlook-2022-Cloud-Edge.pdf)
[^2]: [Accenture, Closing the Datavalue Gap](https://www.accenture.com/_acnmedia/pdf-108/accenture-closing-data-value-gap-fixed.pdf)
[^3]: [Deloitte, Tech Trends 2023](https://www2.deloitte.com/us/en/insights/focus/tech-trends.html#above-the-clouds)

Photo via [Flickr Commons](https://flic.kr/p/2mN8Cfg) from Bervaz.

