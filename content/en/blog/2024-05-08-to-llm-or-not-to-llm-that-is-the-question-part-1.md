---
title: "To LLM or Not to LLM, That Is the Question (Part 1)"
slug: "to-llm-or-not-to-llm-that-is-the-question-part-1"
date: "2024-05-08T09:33:34-04:00"
draft: false
image: img/blog/2024-05-08-to-llm-or-not-to-llm-that-is-the-question-part-1/elena-mozhvilo-unsplash.jpg
photo_credit: "Photo by [Elena Mozhvilo on Unsplash](https://unsplash.com/photos/white-and-blue-round-device-FBaJVyV_NvU?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash)"
authors: ['Danielle Maxwell', 'Prema Roman']
profile: img/butterfly.png
tags: ['LLMs', 'AI', 'ML', 'Python', 'Data']
description: "When it comes to AI projects, be cautious about the hype around cutting-edge technologies that make promises they can't deliver"
---

We have seen a proliferation of Large Language Models (LLMs) due to the popularity of ChatGPT.  LLMs are responsible for the current AI revolution as companies seek to replicate the success of OpenAI.

<!--more-->

Here’s the thing: there is a lot that went into the development of ChatGPT.  Microsoft [invested a billion dollars](https://www.bloomberg.com/news/articles/2023-03-13/microsoft-built-an-expensive-supercomputer-to-power-openai-s-chatgpt?sref=ExbtjcSG) in OpenAI that enabled it to set up the massive infrastructure needed to train ChatGPT on terabytes of data.  On top of that consider the energy consumption incurred as the model was being trained.  Timnit Gebru et al. in their [research paper](https://dl.acm.org/doi/10.1145/3442188.3445922) referenced a benchmark study conducted by Strubell et al. where they made the following observation:

> Training a single BERT base model (without hyper parameter tuning) on GPUs was estimated to require as much energy as a trans-American flight.   

They also note that the size of the data that is used to train these models makes it all the more difficult to effectively understand and document the data and its characteristics.  

This only scratches the surface of all the complexities and risks organizations must face as they consider using LLMs within their organization.  All of this work was done to only develop the model.  The work doesn’t end there.  This model has to be integrated into a software application that will serve a business need.  This means that there will be additional costs to set up the infrastructure for the software application.  But that’s not all - because this is a machine learning application instead of a traditional software application, work needs to be done to maintain both the model AND the software application.  All models suffer from “drift” over time, that is, their ability to make accurate inferences decreases.  This means that models need to be retrained on a periodic basis.  Companies also have to account for inaccurate inferences, which means that they will need a way to collect that information and use it to refine the model. 

There are also cases where implementing LLMs led to catastrophic results.  This is because LLMs are prone to hallucinations, which are nonsensical or misleading responses to user queries.  For example, Air Canada was [forced to pay](https://www.theguardian.com/world/2024/feb/16/air-canada-chatbot-lawsuit) one of its customers after its chatbot mistakenly stated that the customer can apply for bereavement rates and will be refunded retroactively.  OpenAI also suffered from an [outage](https://status.openai.com/incidents/ssg8fh7sfyz3) that stemmed from a bug that was introduced when it upgraded its application.  The reality is that such bugs are possible due to the added complexity of LLMs.  

There are strategies that have been introduced to mitigate hallucinations such as prompt engineering and retrieval augmented generation (RAG).  But these strategies only add more complexity to an already complex system.

As you can see, replicating OpenAI’s success is a costly affair.  While LLMs have been instrumental and have unlocked a lot of use cases that were previously not possible, we have to consider the trade-offs.  It may appear that if you are not using LLMs, you are missing out.  But that is far from the truth.  The best approach to achieve ROI on your investments is to first take a step back and ask yourself what is the end goal you wish to achieve.  After that, have your team work on brainstorming ideas on how to achieve this goal.  LLMs are only one set of tools in a large collection of tools that businesses can leverage.  We propose answering the following questions at the start of a project:

- Can the problem be solved by using business rules?
- Can the problem be solved by using advanced analytics?
- Can the problem be solved by using traditional machine learning?

What we have observed in our experience is that it is best to start simple and work your way up.  Believe it or not, in spite of all the stories around LLMs being this catch-all solution to solve all business problems, there are many problems that businesses currently face that can be solved by traditional machine learning.  For example, consider a use case where your business has a content management system that is highly disorganized and not tagged and classified.  Consider an employee who is already pressed for time who has to go through this disorganized system to find the one document that they need.  Now multiply that with the number of employees and the number of times they have to do this on a regular basis.  You can see how much productivity is lost by this activity, not to mention the frustration your employees feel when doing this task.  This is a task that several existing classification models are good at.  None of them need to be trained on the amount of data that ChatGPT was trained on nor do they require expensive hardware.

## Stay tuned!

In the next blog post, we will illustrate this concept with a project we worked on where we started with a use case, and tried out simple models to see how far we could get.


