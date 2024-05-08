---
title: "To LLM or Not to LLM, That Is the Question (Part 2)"
slug: "to-llm-or-not-to-llm-that-is-the-question-part-2"
date: "2024-05-08T09:33:34-05:00"
draft: false
image: img/blog/2024-05-08-to-llm-or-not-to-llm-that-is-the-question-part-2/elena-mozhvilo-unsplash.jpg
photo_credit: "Photo by [Elena Mozhvilo on Unsplash](https://unsplash.com/photos/white-and-blue-round-device-FBaJVyV_NvU?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash)"
authors: ['Danielle Maxwell', 'Prema Roman']
profile: img/butterfly.png
tags: ['LLMs', 'AI', 'ML', 'Python', 'Data']
description: "When it comes to AI projects, be cautious about the hype around cutting-edge technologies that make promises they can't deliver"
---

<!--more-->

We tried a number of classifiers but were not able to produce a suitable model.  Here is a look at the Uniform Manifold Approximation and Projection (UMAP) projection of all of the LinkedIn posts.  This visualization shows that there is a lot of overlap between embeddings attributed to each of the categories, which helps explain why it was challenging to find a model that performed well.

![UMAP](img/blog/2024-05-08-to-llm-or-not-to-llm-that-is-the-question-part-2/umap.png)

Through further analysis we determined that it made sense to combine the clickbait and promotion categories into the **hype** category as the intention behind both types of posts is to get the audience’s attention towards the product, service, or idea the influencer was promoting.  The other categories were combined into a second category we called **non_hype**.  We achieved the best performance using the open source package [XGBoost](https://xgboost.readthedocs.io/en/stable/#).  

Here are the precision, recall, and f1 scores for both classes:

![Metrics](img/blog/2024-05-08-to-llm-or-not-to-llm-that-is-the-question-part-2/metrics.png)

These results are not that bad considering that we did not perform any hyperparameter tuning on the model and had only labeled 399 instances.  Here are the model inferences on a couple of examples.  The first example is a post where the influence is promoting their talk on a podcast.  The model scored the post as **hype**.

![Hype](img/blog/2024-05-08-to-llm-or-not-to-llm-that-is-the-question-part-2/hype.png)

The following example is an education post on how to improve LLM performance.  The model scored the post as **not_hype**.

![Not Hype](img/blog/2024-05-08-to-llm-or-not-to-llm-that-is-the-question-part-2/not_hype.png)

This example demonstrates how companies can get started on AI projects with small upfront costs to see if there is signal and then scale up and cost up as necessary.  All of this work was done in less than a month using personal laptops, not expensive cloud infrastructure.  

While it may seem that we are dismissing the benefits of LLMs, that is far from the case.  In fact, we have also worked on projects that eventually became successful because we used LLMs.  There was a client project where we tried a number of traditional ML models, which initially provided some signal, but did not quite meet our their needs.  Subsequently, we used the DistilBERT model from Hugging Face, applied transfer learning, and were able to meet the client's goal.

Instead, what we are advocating for is to keep AI systems as simple as possible.  These are some of the benefits:

- Simpler systems are easier to maintain
- Aiming for simplicity means that companies can leverage a larger talent pool whose diverse perspectives can enable them to build truly innovative products, i.e., there is no need to be competing for the limited number of people who have a narrow view of what it takes to innovate in the AI space
