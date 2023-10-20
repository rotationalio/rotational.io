---
title: "Welcome to Ensign U!"
slug: "welcome-to-ensign-u"
date: "2023-10-20T12:41:46-04:00"
draft: false
image: img/blog/library.jpg
photo_credit: "Photo by Pablo Dodda"
authors: ['Rotational Labs']
profile: img/butterfly.png
tags: ['Python', 'Eventing', 'ML']
description: "Your end-to-end curriculum for getting started with Ensign, a database-meets-event-streaming platform for data science teams."
---

Like any new tool, Ensign takes a little time to learn. But take it from us (a bunch of seasoned data science experts) -- it will open up a new world of data science applications for you. Check out this beginner-friendly introduction!

<!--more-->

[Ensign](https://rotational.app/) is a flexible database and data streaming engine built for data scientists by data scientists. We make it easy for data teams to build and deploy real-time data products and services that make an impact, no matter your use case.

To help you on your learning journey, we’ve established Ensign U &mdash; a curriculum designed to get your first project up and running.

## First, the Pre-Reqs

If you’re new to real-time data streaming, pubsub and event-driven architecture, here are a few recommended resources:

- Blog: [Introduction to streaming for data scientists](https://huyenchip.com/2022/08/03/stream-processing-for-data-scientists.html) (20 mins)
- Blog: [From batch to online/stream](https://riverml.xyz/dev/examples/batch-to-online/) (10 mins)
- Tutorial: [Pub/Sub for Newbies tutorial](https://youtu.be/JqqfDJdMXdA) (1 hr) &mdash; skip around as needed

Make sure you have Python installed. We recommend using Python >= 3.9.

## Step 1. Start with a Use Case

Start with a [use case](https://rotational.io/ensign/) in mind. This can be any type of streaming data project that you’re interested in and your primary goal *is to bring meaning to the data*.

Looking for [more inspiration](https://ensign.rotational.dev/eventing/use_cases/)?


## Step 2. Pick Your Streaming Dataset(s)

Where is your data coming from? A data source can be a database, a public data API, a running web application, a bunch of IoT sensors, a file system, system logs, or other upstream sources.

Check out our [Data Playground](https://rotational.io/data-playground/) for publicly available APIs that stream data.

## Step 3. Sketch Out Your Data Flow Architecture

Most data scientists want to start by training the machine learning model, since that’s how we’re trained. But this can lead you to a trained model that can't fit into an application without a lot of painful MLOps.

In our experience, data science projects are much easier to deploy if you map out your data flows first, and then start modeling.

Watch these short videos:
- [Batch vs Streaming](https://youtu.be/HDRQ9Fe9g7c?si=F1qbk9huk8K5YJti)
- [Sketch your architecture](https://youtu.be/3AxNSJ9oB24)

## Step 4. Set Up Your Project Infrastructure

Here’s where you need to [create an account](https://rotational.app/register/) and log into Ensign. These videos will help.

- [Create a project](https://youtu.be/VskNgAVMORQ?si=POcN898B0MpQDsCW): A project is a collection of topics: it’s your data repository for streaming events.
- [Name your topics](https://www.youtube.com/watch?v=1XuVPl_Ki4U): Your topic is labeled stream of information you’re interested in.
- [Generate API keys](https://youtu.be/KMejrUIouMw): Use your API keys to connect your data source to your topic.
- [Protect your keys](https://youtu.be/EEpIDkKJopY?si=MrdLtH2TqiYq2kqH): Store your keys as environment variables, not in your repo.

## Step 5. Install PyEnsign

Install the [pyensign sdk](https://github.com/rotationalio/pyensign). We recommend using Python >= 3.9.

You can pip install pyensign with:

```bash
pip install pyensign
```

Or, if you have an older version of pyensign installed (especially before `v0.11b0`), make sure you are on the [latest release](https://github.com/rotationalio/pyensign/releases) by upgrading your pyensign version using:

```bash
pip install --upgrade pyensign
```

Check out the [docs](https://github.com/rotationalio/pyensign) if needed!

## Step 6. Run the Minimal PyEnsign Example

Check that your [API keys](https://youtu.be/EEpIDkKJopY?si=MrdLtH2TqiYq2kqH) and your pyensign installation are working. You can do this by running the [minimal python example](https://github.com/rotationalio/ensign-examples/tree/main/python/minimal).

## Step 7. Run the Earthquake Data Ingestion Example Code

Run the [earthquake example](https://github.com/rotationalio/data-playground/tree/main/earthquakes/python) to ingest data into your topic using your own API keys.

## Step 8. Query Your Ingested Data

Once you get data into your topic, you can view the data by logging into your Ensign account and navigating to `Projects > Project Name > Topic Name`. You will see the details page for your topic, and you can run the sample `Topic Query` provided to view a few of the events you have successfully ingested.

You can also query your data using [EnSQL](https://ensign.rotational.dev/ensql/) &mdash; see an example of [how to do that with PyEnsign and your earthquake data here](https://github.com/rotationalio/data-playground/blob/main/earthquakes/python/analyzer.py).

## Congrats!

Now you have data flowing into your topic. The world is your oyster!

Use this same process each time you have a new data science project, and your chances of getting it deployed will be that much greater!

Here are some common data science projects that can add value to an organization:

- Working with sensitive data? Apply transformations that mask or anonymize data from your data source.
- Create real-time machine learning models that learn on the go.
- Publish streams to web apps, mobile apps, dashboards, an
- Publish data from different topics into a new a new topic
- Collect data from edge devices and sensors.


***
Photo by [Pablo Dodda](https://www.flickr.com/photos/dodda/) on [Flickr Commons](https://flic.kr/p/4A2GQ4).