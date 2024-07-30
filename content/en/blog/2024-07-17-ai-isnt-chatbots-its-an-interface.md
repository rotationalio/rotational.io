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

Why is everyone so excited by AI? Chatting with a bot isn't the game changer; the game is changing because AI represents a new method of interacting with complex computing resources and data -- one that is far more accessible than previous methods.

<!--more-->

At this early stage, chatting with ChatGPT and generating images and text seems a bit like a one-trick pony, particularly as "chat with your X" products seem to be flooding the market. It feels like the question on everyone's mind is how they can leverage AI for their work and their organizations, and what impact it might have on their own careers and productivity. I propose a simple shift in thinking: if AI is an interface to my computer, what new and interesting things might I be able to do, and what audiences might be able to access and manipulate our data more easily?

Let's start with a simple example: most organizations have database management systems that store critical customer and operational data. The interface to a relational database system is SQL, a structured query language. In order to meaningfully analyze and interpret that data, a specialist is needed to create correct queries then formulate the output with visual graphs, tables, and perhaps some insights.

A large language model (an LLM) is a generative deep learning model; meaning that it is trained on text and language data and can generate text and language - including SQL. With a bit of fine tuning or prompt engineering, an LLM can be trained to understand your database and models and to not just translate a query such as "how many vehicles in my fleet have a freight capacity of at least 1500 kg and are available for the next 30 days?" but also execute that query and prepare a meaningful response to the user. The user can then ask follow-on questions using the original context, e.g. "refine the results grouping by make, model, and year".

What the AI has done is shifted development and operational responsibilities of your data closer to the end user and reduced the amount of user interface development that may have been required. Instead of a requirements gathering process that asks what queries may our users be conducting followed by software engineering, database development, and user interface to provide access to that query -- we simply watch what our users are asking of the AI on a routine basis and formalize those tasks into agents that can correctly (or deterministically) respond to those requests.

This does not eliminate the responsibilities of software and data engineers; rather it shifts our focus. Instead of guessing what tools and applications might increase productivity, reduce costs, or increase revenue lines, we focus on how we can improve interactions with the AI. For example, if we have seen some modest cost savings in fleet coordination and routing using an LLM that has a 70% performance acceptance rate, it's likely that we can build a deterministic system that improves that performance by much more!

One way do this is to create _task specific agents_: these are fine-tuned, function calling LLMs that are specialized at a very specific task; e.g. tasking and coordinating vehicles in a fleet. Often these agents deal with repetitive, boring tasks where a human user may make inconsistent decisions. These types of agents can reduce the marginal costs of your organization by allowing your team to focus on more creative or more productive work.

In order to get to this place in your AI journey, you need a domain-specific LLM; e.g. an LLM that understands your data. OpenAI does offer a customized GPT feature, but if you don't want to send your proprietary business data to a third party, then you should consider fine-tuning your own model and hosting it in house! Unlike other software products, LLMs are fairly expensive to run as they require GPUs or other specialized hardware; however those costs can be more easily controlled in your own VPC rather than dealing with the variable costs of tokens.

Ok, so what does this mean for you? If we start thinking of AI as an interface to our business specific data, it's time to shift our thinking from "what are the use-cases of AI?" to "what are the pain points in my business processes, and what data do we have available"? It's time to get creative, because it's not just code, tabular, and language data -- it's also video, audio, and multi-modal data types that can be accessed with the human langauge interface.

If we're managing a fleet of vehicles, perhaps we can use an iPhone with modern inferencing chips to take video of our vehicles before and after they go out on their route to quickly detect changes or damage. Perhaps we can take a picture of loads going out to predict fuel usage, weight, or delivery-specific conditions. Then using this collected data, we could ask questions of the AI about the condition of our fleet, analyze capital expenditures, and more: the AI is an interface into the data about your specific operations.