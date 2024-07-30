---
title: "AI isn't Chatbots, it's an Interface"
slug: "ai-isnt-chatbots-its-an-interface"
date: "2024-07-17T12:21:05-05:00"
draft: false
image: img/blog/sea-otter-dreaming.webp
photo_credit: "AI Generated Image from Canva"
authors: ['Benjamin Bengfort']
profile: img/team/benjamin-bengfort.png
tags: ['AI', 'HCI', 'Use Cases']
description: "The reason everyone is so excited by AI is not that it can generate seemingly meaningful text in a chat, but rather that it can change the way we work with data by providing a more natural human interface to computing resources."
---

Why is everyone so excited by AI? Chatting with a bot isn't the game changer. Instead, AI represents a new method of interacting with complex computing resources and data -- one that is far more accessible than previous methods.

<!--more-->

At this early stage, chatting with ChatGPT and generating images feels a bit like a one-trick pony. As "chat with your X" products flood the market, the question on everyone's mind is whether AI can be used for anything of *real* impact, i.e. to increase productivity, reduce operating costs, or grow the business?

These are good questions, because they signal a shift from superficial applications of AI to a focus on business outcomes. To this end, I propose a simple shift in thinking. When you see the term "AI", don't think of chatbots, but rather of something deeper and more profound: an **interface**.

In software engineering and computer science circles, the word **interface** is admittedly somewhat overloaded. It describes the user interfaces of the apps we use everyday, as well as the API service definitions at the data interchange level between machines under the hood. Nonetheless, the term **interface** is useful, because it acknowledges the existence of boundaries (e.g. between hardware components, software systems, data assets, and the people who use them), and the need for ways of communicating across those boundaries.

AI is not merely a chatbot, but an interface to my computer's file system, installed applications, and operating system. Normally, there are many boundaries that separate us from these components of our computer systems; at the very least, they require a great deal of programming experience and knowledge to access and use. Consider what new and interesting things you might be able to do with an interface that is so flexible and accessible?

## Talking to Your Database

Let's start with a simple example: most organizations have database management systems that store critical customer and operational data. The interface to a relational database system is SQL, a structured query language. In order to meaningfully analyze and interpret that data, a specialist is needed to create correct queries then formulate the output with visual graphs, tables, and perhaps some insights.

A large language model (an LLM) is a generative deep learning model; meaning that it is trained on text and language data and can generate text and language - including SQL. With a bit of fine tuning or prompt engineering, an LLM can be trained to understand your database and models and to not just translate a query such as "how many vehicles in my fleet have a freight capacity of at least 1500 kg and are available for the next 30 days?" but also execute that query and prepare a meaningful response to the user. The user can then ask follow-on questions using the original context, e.g. "refine the results grouping by make, model, and year".

What the AI has done is shifted development and operational responsibilities of your data closer to the end user and reduced the amount of user interface development that may have been required. Instead of a requirements gathering process that asks what queries may our users be conducting followed by software engineering, database development, and user interface to provide access to that query -- we simply watch what our users are asking of the AI on a routine basis and formalize those tasks into agents that can correctly (or deterministically) respond to those requests.

## Shifting Responsibilities

This does not eliminate the responsibilities of software and data engineers; rather it shifts our focus. Instead of guessing what tools and applications might increase productivity, reduce costs, or increase revenue lines, we focus on how we can improve interactions with the AI. For example, if we have seen some modest cost savings in fleet coordination and routing using an LLM that has a 70% performance acceptance rate, it's likely that we can build a deterministic system that improves that performance by much more!

One way do this is to create _task specific agents_: these are fine-tuned, function calling LLMs that are specialized at a very specific task; e.g. tasking and coordinating vehicles in a fleet. Often these agents deal with repetitive, boring tasks where a human user may make inconsistent decisions. These types of agents can reduce the marginal costs of your organization by allowing your team to focus on more creative or more productive work.

## Interfacing Across Multiple Modalities

Ok, so what does this mean for you? If we start thinking of AI as an interface to our business specific data, it's time to shift our thinking from "what are the use-cases of AI?" to "what are the pain points in my business processes, and what data do we have available"? It's time to get creative, because it's not just code, tabular, and language data -- it's also video, audio, and multi-modal data types that can be accessed with the human language interface.

If we're managing a fleet of vehicles, perhaps we can use an iPhone with modern inferencing chips to take video of our vehicles before and after they go out on their route to quickly detect changes or damage. Perhaps we can take a picture of loads going out to predict fuel usage, weight, or delivery-specific conditions. Then using this collected data, we could ask questions of the AI about the condition of our fleet, analyze capital expenditures, and more: the AI is an interface into the data about your specific operations.

## The Journey Begins Within

Many are tempted to look outward for interesting use cases of AI ("what is everyone else doing?"). However, we find that the most successful journeys begin when an organization looks inward, identifying pain points that indicate an opportunity to solve an in-house problem. This will ensure that AI outcomes can be quantified in terms of hours saved, deals won, etc., and thus tied to concrete business outcomes.

The next step is to build a domain-specific LLM; e.g. an LLM that understands your data. OpenAI does offer a customized GPT feature, but if you don't want to send your proprietary business data to a third party, then you should consider fine-tuning your own model and hosting it in house! Unlike other software products, LLMs are fairly expensive to run as they require GPUs or other specialized hardware; however those costs can be more easily controlled in your own VPC rather than dealing with the variable costs of tokens.

To learn more about how to get started, check out our webinar on Demystifying LLMs, and check out the other blogs and resources available from Rotational Labs.

