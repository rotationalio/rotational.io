---
title: "Let The Right One In: Model Selection for the AI Era"
slug: "pick-the-best-ai"
date: "2025-05-02T09:48:50-04:00"
draft: false
image: img/blog/mst-stress-otter-v2-md.png
photo_credit: "Photo generated using GPT-4o and some creative human prompting."
authors: ['Rebecca Bilbro']
profile: img/team/rebecca-bilbro.png
tags: ['AI', 'Data Science', 'LLMs']
description: "There's no such thing as a best AI model, but the fastest path to alignment is the Model Selection Triple methodology."
---

There's no such thing as a best AI model. You have to science it. If you're new to experimental design for machine learning, here's a quick and dirty intro to the **Model Selection Triple** methodology.

<!--more-->

## What is the Model Selection Triple?

One of the most influential ideas in my early career and one that continues to guide how I think about building AI systems today comes from a now 10-year-old paper that came out of a decades-old ACM special interest group focused on large-scale data management problems and databases. I realize this was probably not your first guess. Most people would probably guess it was the [attention paper](https://arxiv.org/abs/1706.03762) or the [purple book](https://web.stanford.edu/~jurafsky/slp3/) or maybe the [original proposal for scikit-learn](https://arxiv.org/abs/1309.0238).

But the paper that lives rent-free in my head is ["Model selection management systems:
The next frontier of advanced analytics,"](https://cseweb.ucsd.edu/~arunkk/vision/SIGMODRecord15.pdf) by a group of researchers from the University of Wisconsin-Madison and Microsoft. “Model selection,” the authors explain, “is iterative and exploratory because the space of [model selection triples] is usually infinite, and it is generally impossible for analysts to know a priori which [triple] will yield satisfactory accuracy and/or insights.”

This one line from this one paper is largely responsible for inspiring the [Yellowbrick API](https://www.scikit-yb.org/en/latest/tutorial.html). According to Kumar et al's original conception, **model selection triples** consist of:
  - **algorithms** (i.e. model architecture like SVM, random forest, neural net)
  - **features** (i.e. data attributes extracted via your etl, wrangling, selection and engineering pipeline)
  - **hyperparameters** (e.g. alphas, num_trees, learning rates, decision thresholds, etc)

This abstraction mapped pretty cleanly to the ML workflows we in industry were already using, and we ended up with an open source machine learning API that grouped machine learning diagnostic tools into sensible categories: tools that help you with [algorithm comparison](https://www.scikit-yb.org/en/latest/api/classifier/index.html), tools that help you with [feature selection](https://www.scikit-yb.org/en/latest/api/features/index.html), and tools that help you with [hyperparameter tuning](https://www.scikit-yb.org/en/latest/api/model_selection/index.html).

I gave my first big machine learning talk at PyCon 2016 ([cringe](https://youtu.be/c5DaaGZWQqY?si=EOHGXp7B3SAr5IjD)). It was terrifying. I stood in front of an audience of like 600 people and told them that machine learning was hard and that it sucks to feel like you are just randomly guessing about which model to use when you're using machine learning to do mission critical stuff. But I'm glad I allowed myself to get so vulnerable because it hit a nerve. So many people reached out to say they also felt like they were throwing spaghetti at a wall.

Quickly it started to feel like all of Data Science as a field was on the same page that the fastest path to the most optimal model for the problem you are trying to solve is to construct experiments where you would only vary one of {features, algo, params} at a time, and inspect the outcomes of those experiments so that you could be sure that you were trending towards accending the accuracy gradient (or descending the error gradient).

So anyway, [`yellowbrick`](https://github.com/DistrictDataLabs/yellowbrick) really took off (and I guess [some people still like it,](https://pypistats.org/packages/yellowbrick) nbd).

But somehow in the age of AI we have lost the plot. I am watching people running around testing LLMs like proverbial beheaded chickens.

So here's my pitch for why the original principles of machine learning still apply (and just maybe, they are *even more necessary* than they were back in 2016 when our models were stupid but wicked fast and easy to run on cheap compute). The **model selection triple** is still the most efficient and effective methodology to science AI.

## Why MST Still Matters for LLMs

- Prompts are the new features
- Temperature, top-p, context length = new hyperparameters
- LLM experimentation is still *model selection*, just with different knobs
- Without structure, teams make multiple changes at once — and learn nothing

## The Problem with AI Workflows Today

- Prompt engineering is treated as magic, not a method
- Teams often don’t track what they changed, or why
- Evaluation is subjective, informal, or ignored
- Model performance is often gauged through “gut feel” rather than metrics
- Leads to wasted compute, unclear ROI, and inconsistent outcomes

## Extending the Triple for LLMs

- Add **evaluation design** as a fourth dimension
  - What does “good” look like? Who defines it? How do we measure it?
- Add **task decomposition** as a meta-layer
  - Real-world workflows often require sequences like:
    `Extraction → Classification → Justification`
- Anchor each experiment with a clear **hypothesis**
  - Avoids scope creep and reinforces alignment with business goals


## Conclusion

So hopefully you see the general idea here &mdash; rigor isn’t the enemy of speed.
The teams who treat experimentation as a science, not a scramble, will win.

> _My team specializes in bringing structure and velocity to AI experimentation. If you’re building something high-stakes and proprietary, I’d love to talk._
