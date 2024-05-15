---
title: "To LLM or Not to LLM (Part 2): Starting Simple"
slug: "starting-simple-with-ai"
date: "2024-05-20T09:00:00-05:00"
draft: false
image: /img/blog/2024-05-08-to-llm-or-not-to-llm-that-is-the-question-part-2/cover-photo.webp
photo_credit: "Photo by [camilo jimenez on Unsplash](https://unsplash.com/@camstejim?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash)"
authors: ['Danielle Maxwell', 'Prema Roman']
profile: img/butterfly.png
tags: ['LLMs', 'AI', 'ML', 'Python', 'Data']
description: "In part 2 of our series, we examine whether the solution to text prediction problems is using simpler -- rather than more complex -- ML models."
---

Sick of hearing about hyped up AI solutions that sound like hot air? We are! Let's use boring old ML to detect hype in AI marketing text and see why starting with a simple ML approach is still your best bet 90% of the time.

<!--more-->

In our [first post in this responsible LLM series](https://rotational.io/blog/responsible-innovation/), we discussed that while LLMs have unlocked new use cases that companies can leverage to generate more revenue, they are not the catch-all solution for every single AI use case.  We identified the following drawbacks:
- High energy consumption
- Difficulty understanding and documenting the underlying data used
- Difficult to deploy, maintain, and monitor software applications using LLMs due to added complexity

In this blog post we will walk through a project that demonstrates how organizations can get started by using simpler ML models that show promise and then iterate and scale up as needed.

## How Do You Get Your News?
If you’re like many adults in the U.S. there’s a great chance that you get your news from social media. According to the [Social Media and News Fact Sheet published by the Pew Research Center](https://www.pewresearch.org/journalism/fact-sheet/social-media-and-news-fact-sheet/), 17% of U.S. adults often used social media outlets for news in 2022. During that same year, 33% of U.S. adults shared that they sometimes use social media to obtain news.

Per the same report, in 2023, the most popular social media sites for those who use social media for news were Twitter, Facebook, and TikTok.

Using social media for news isn't a good or bad thing. Heck, [we](https://rotational.io/blog/how-to-manage-overwhelm/) do it too. But with all the buzz about magic AI solutions clogging up our newsfeeds, developing a model to detect online hype felt like a great use case to test out.

## Don't Believe the Hype
But, first, we had to define hype in a way that a model can understand. After deciding to use a [LinkedIn Influencer dataset from Kaggle](https://www.kaggle.com/datasets/shreyasajal/linkedin-influencers-data), we took to the task of labeling a subset of the posts as **hype** or **not_hype**. Unfortunately, this didn’t lead to the best results.

We determined that it was likely that these categories were too broad and decided to come up with more granular categories.  The following table lists the categories along with the number of instances per category.

| Category | Number of posts |
| ----- | ----- |
| Clickbait | 157 |
| Promotion | 116 |
| Opinion | 54 |
| News | 34 |
| Motivational | 15 |
| Other | 15 |

From there, we tried a number of classification models, but were not able to produce a suitable model.

Here is a look at the Uniform Manifold Approximation and Projection (UMAP) projection of all of the LinkedIn posts.  This visualization shows that there is a lot of overlap between embeddings attributed to each of the categories, which helps explain why it was challenging to find a model that performed well.

![UMAP](img/blog/2024-05-08-to-llm-or-not-to-llm-that-is-the-question-part-2/umap.webp)

Through further analysis we determined that it made sense to combine the clickbait and promotion categories into the **hype** category as the intention behind both types of posts is to get the audience’s attention towards the product, service, or idea the influencer was promoting.  The other categories were combined into a second category we called **non_hype**.  We achieved the best performance using the open source package [XGBoost](https://xgboost.readthedocs.io/en/stable/#).

Here are the precision, recall, and f1 scores for both classes:

![Metrics](img/blog/2024-05-08-to-llm-or-not-to-llm-that-is-the-question-part-2/metrics.webp)

These results are not that bad considering that we did not perform any hyperparameter tuning on the model and had only labeled 399 instances.  Here are the model inferences on a couple of examples.  The first example is a post where the influence is promoting their talk on a podcast.  The model scored the post as **hype**.

![Hype](img/blog/2024-05-08-to-llm-or-not-to-llm-that-is-the-question-part-2/hype.webp)

The following example is an education post on how to improve LLM performance.  The model scored the post as **not_hype**.

![Not Hype](img/blog/2024-05-08-to-llm-or-not-to-llm-that-is-the-question-part-2/not_hype.webp)

## Conclusion

While our model isn't quite ready for production (stay tuned though 😉), we hope this example demonstrates why it make sense to start simple. First off, it's cost effective. All of this work was done in less than a month, using our laptops, not expensive cloud infrastructure. More importantly, it helped us better define our problem and our targets for prediction, and now we can do a *much* better job costing out a more complete solution.

While it may seem that we are dismissing the benefits of LLMs, that is far from the case. In fact, we routinely start with simple models before we scale out to use LLMs.  There was a client project where we tried a number of traditional ML models, which initially provided some signal, but did not quite meet our their needs.  Subsequently, we used the DistilBERT model from Hugging Face, applied transfer learning, and were able to meet the client's goal.

Instead, what we are advocating for is to keep AI systems as simple as possible. These are some of the benefits:

- Simpler systems are cheaper and easier to maintain
- Simpler systems foster easier collaboration among teams
- Simpler systems allow for rapid iteration
- Simpler systems are more profitable


Aiming for simplicity also means that companies can leverage a larger and more generalized talent pool whose diverse perspectives enables organizations to build truly innovative products, i.e., there is no need to be competing for the limited number of people who have a narrow view of what it takes to innovate in the AI space.
