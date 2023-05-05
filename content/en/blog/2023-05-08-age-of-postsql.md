---
title: "Welcome to the Age of PostSQL"
slug: "age-of-postsql"
date: "2023-05-08T09:00:00-04:00"
draft: false
image: img/blog/postmodern.jpg
author: Rebecca Bilbro
category: Databases, Eventing
photo_credit: Photo by Bervaz via Flickr Commons
description: "Messiness is the norm for data, not the exception. Let's stop searching for the 'one true' database and just pick tools that help us get the job done."
profile: img/team/rebecca-bilbro.png
---

Does the data layer at your organization feel like a special kind of hell? Do you dream of a database that matches your platonic ideal of relational/NoSQL storage (perfectly normalized/indexed)? The truth is that we are all PostSQL now.

<!--more-->

## Hot Mess or Homemade Hybrid?

For some reason, we are all quite insecure about our databases. I've worked on a lot of engineering teams from the public sector to enterprises to startups and this may be the one thing everyone has in common. What I have actually observed in practice is not a host of hot messes but instead a lot of creative blending of data storage, querying, and processing tools.

Consider the 5 following hypothetical/anonymized examples of hybrid data layers at different organizations:

- **Enterprise A**, whose frontend and backend teams manage two different PostgreSQL databases and use Google PubSub to ferry data back and forth.
- **Business B**, that uses RDS for secure storage, Redshift for querying, and Databricks for research and development.
- **Company C**, which inherited a legacy MySQL Server database, that gets regular data dumps from 3rd party partners into S3, and uses Athena to materialize the bucket data as pseudo-SQL and Apache Superset to visualize all of it together in a dashboard.
- **Organization D**, that currently uses a CockroachDB instance deployed on Google Cloud to manage its transactional data and a DocumentDB instance on AWS to store more detailed data about customers and products.
- **Startup E**, that's using a custom-sharded LevelDB instance for key-value customer data storage, distributed SQLite for in-app account management, and an event stream to quickly observe scaling events.

Do any of these sound familiar? Are you a Company C? Have you worked for an Enterprise A? Stitching tools together is not a red flag, it's just the norm! (*Note: red flags to look out for are discussed later in this piece*)

The challenge is this: as we stitch together more and more tools, we have to write more and more code to coordinate our data. Tech teams can leverage external APIs where available, but often need to write their own SDKs or at the very least engage in routine patching to maintain synchronization as the tools and APIs continually evolve.

As coordination code increases, bugs are introduced and our maintenance "surface area" gets bigger. This leads maintenance costs to increase even as, paradoxically, tech debt stays roughly level.

You can usually observe this happening in your budget if you're looking close; operational costs spike and don't drop back down; your burn rates steadily rise.

So what could we be doing differently? Rather than internalizing our frustrations with whatever tool(s) we initially selected (or more likely, inherited) and doubling down, we should look for tools that will actually help us solve our problem.

Lean into a "PostSQL" solution earlier on, and without shame.

## What is PostSQL?

So what is PostSQL? A PostSQL database is one that embraces the specificity of a new data problem &mdash; probably one that's emerged over the last 5-10 years. They often have eclectic features such as elements of both relational and NoSQL databases, or a unique combination of NoSQL features, or else a hybrid object-oriented and functional perspective of data. They are not billed as one-size-fits-all tools, and take a non-dogmatic approach when comparing themselves to other tools and solutions.

Here are a few examples:

- [DuckDB](https://duckdb.org/) is like a columnar SQLite for OLAP, and it's recently taken the Python/data science communities by storm. It's good at in-memory analytics, and you can interact with it like you'd use a Pandas dataframe.
- [Tigerbeetle](https://tigerbeetle.com/) is a database for distributed financial transactions, and solves a lot of the practical problems (latency, byzantine attacks, etc) that have come out of the Blockchain movement.
- [RisingWave](https://www.risingwave.dev/docs/current/intro/), currently in beta, is like a PostgreSQL for Kafka and Pulsar users. It offers a database for longterm topic storage, querying, and aggregation.
- [Ensign](https://rotational.io/ensign/), also now in [free beta](https://rotational.app/register), offers fully managed eventing for data analytics, making it easier for teams to share data with less beaurocracy and publish data science outputs back to the application.


## Red Flags
What are some of the signs to look out for that it might be time for a PostSQL solution rather than building (and forever maintaining) a homemade hybrid?

### 1. The tools you're using aren't working for what you need them to do
For instance, maybe queries are fast, but writes/upserts are so slow that they're preventing you from launching a high value new feature.

### 2. You're doing things manually that databases are good at
For instance, you're generating and applying unique identifiers, or having to devise ways of putting changes to an object in chronological order.

### 3. You're doing things manually that eventing is good at
For example, you need to copy data from location X to location Y. Bonus points if this happens periodically and you lay awake at night worrying something important has changed since the last batch.

### 4. The data analysts don't have a way to "talk back" to the application
For example, your data-driven intelligence processes are orphaned and/or require someone to kick off a manual process. Alternatively, your data scientists are building models but don't feel confident navigating the MLOps.


## Conclusion

> Through a vicious circle of pure reason, skepsis itself becomes dogma. -Johann Georg Hamann

If your organization is either right on the verge or in the midst of some kind of conversion, migration, or upgrade of their data layer, ask yourself:

- How hard will this be to hook up to our legacy stuff?
- How much will it really cost me to keep it operational?
- How many dedicated engineers are going to have to maintain it?

We're often made to feel that our org's data is a special kind of hot mess. That we should have one, much cleaner data store that matches our platonic ideal of a relational (it's perfectly normalized) or NoSQL (it's perfected indexed) database. But if those ideals aren't serving your organization, it's time to let go of them.

Messiness is the norm for data, not the exception. Let's stop searching for the "one true database" and instead, lean into the glorious messiness. Pick tools that honor the reality of your data and help you get the job done. We are all PostSQL now!


Photo via [Flickr Commons](https://flic.kr/p/2mN8Cfg) from Bervaz.

