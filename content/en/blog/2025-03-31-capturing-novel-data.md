---
title: "The Underappreciated Art of Capturing Novel Data"
slug: "capturing-novel-data"
date: "2025-03-31T10:25:02-04:00"
draft: false
image: img/blog/the-data-collectors.jpg
photo_credit: "Photo generated using GPT-4o and some creative human prompting."
authors: ['Steve Veldman']
profile: img/butterfly.png
tags: ['AI', 'Data']
description: "Learn how to go beyond commodity models and commodity results by creating a dataset as unique as your problem."
---

While the internet is an endless source of free data, everyone is training on the same tired datasets, and they’ve likely got more years of practice. Building a novel dataset tailored to your problem can be a game-changer (if done right).

<!--more-->

## To Go Beyond Commodity Results, You Have To Go Beyond Commodity Models

Now that AI has become mainstream, most of our customers see plugging in a public chatbot API as table stakes, not innovation. How do you deliver a competitive advantage in a landscape where AI models are commodities?

One of the best ways to improve a large foundational model for a specific use case is to transform it from a generalist into a specialist &mdash; typically by fine-tuning it on a task- or domain-specific dataset. Such datasets can be found all over the internet, ranging from completely free to incredibly expensive. Some are quite good, many are more than adequate, and many more are only marginally better than having no data at all. But even the best suffer from two major flaws: they almost certainly lack the specific context of your business, and your competitors can use them too. This means that at best, you’ve fine-tuned your model in a way that anyone can replicate, and at worst, you’ve trained a model that won’t withstand real-world use.

To gain an edge, sometimes we need to go beyond fine-tuning with publicly available data. Instead, we need datasets uniquely suited to the problem at hand.

## Primary Data Collection May Be Necessary Even If You Have Proprietary Data

Earlier this year, we faced a novel computer vision problem with no existing dataset that fit our needs. The objects we needed to detect didn’t naturally appear in the environment &mdash; in fact, the goal of the application was to keep these kinds of objects out of the environment. In other words, the customer had plenty of proprietary data, but it wasn’t adequate for the target use case.

Where many teams might have thrown up their hands and abandoned the project, I’m proud to say we took it as an exciting challenge.

While collecting a novel dataset is surely not always going to be the best solution, my goal in this post is to get you think about it as at least one option. I suspect that many of you find yourselves in similar situations all the time, with a fantastic machine learning use case that everyone is ready to greenlight except for one small problem: the data.

Do most business have plenty of unique, proprietary data flowing through their systems (ERP data, accounting logs, marketing metrics, etc.)?
**Yes!**

Is transforming raw data into a usable, high-quality dataset a well-established process in data science?
**Yes!**

And yet... finding enough of the right kind of internal proprietary data is still really hard. Sometimes the data doesn’t exist digitally (i.e. it isn't being captured), or as was the case for us, the data you need doesn’t naturally occur in the environment.

## "I Would Do Anything For Love, But I Won't Do That" - Meatloaf the MLE

Perhaps my biggest takeaway from this experience is that data collection actually is my problem as a machine learning engineer. I know I'm not the only one out here humming along to the classic anthem, "I would do anything for F1, but I won’t do *that*." You’ll train on noisy data, overfit on the most overpriced of hardware, and tune hyperparameters to death, but collecting primary data? That’s where you draw the line.

Many of us are spoiled by the vast public datasets on HuggingFace, Kaggle, and beyond. While these datasets are invaluable for experimentation and proof-of-concept, their abundance means that our data science learning paths often do not require us to develop skills in dataset creation. I'll admit that mine did not until recently.

Fortunately, going through the exercise even once was a real eye-opening experience. Here are a few key lessons I learned:

1. Before you dive in, make sure you know exactly what you’re trying to accomplish. Defining the problem upfront helps you stay focused and make better decisions along the way.

2. Things will go wrong, that’s just part of the process. Maybe the weather doesn’t cooperate, or the equipment fails. Plan for setbacks and stay flexible.

3. Instead of jumping in headfirst, run a quick, small-scale test to see what works and what doesn’t. It’s better to catch issues early than to find out later you’ve been collecting unusable data.

4. Keep track of everything &mdash; what you’re doing, why you’re doing it, and any changes you make along the way. This will be important for coordination, troubleshooting, and data annotation.

5. Speaking of which, accurate labeling is **crucial**. Whether you’re doing it manually or using tools (we did both), take the time to make sure your annotations are consistent and meaningful.

6. Don’t wait until the end to see if your data makes sense. Periodically check your progress to catch mistakes before they snowball into bigger issues.

7. It takes a village. I wouldn't have been able to do this by myself. We were able to leverage our collective expertise across a wide range of domains (including project management, video production and the specific domain the project was operating in) to plan and execute the creation of a completely novel, primary dataset on which to fine-tune a computer vision model.

## Unlocking New Opportunities

Data collection in the real world is not for the faint of heart. It’s resource-intensive, often unpredictable, and requires creative problem-solving. Our project demanded careful planning, human resources, and the ability to adapt quickly. There were moments when the obstacles seemed daunting.

Initially, I questioned whether the effort was worth it. But as we progressed, it became clear: capturing primary data was the only way to truly solve the problem. Our hard-won dataset became the foundation for a model that not only met our client’s needs but also provided a competitive advantage &mdash; something no off-the-shelf dataset could deliver.

*Have you ever gathered a primary dataset? Share your experiences! Or, if you’re looking to tackle a unique problem that requires a custom dataset, connect with us at Rotational. We’d love to help.*