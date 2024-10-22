---
title: "Recapping PyTorch: Key Takeaways from the 2024 Conference"
slug: "pytorch-conference-2024"
date: "2024-09-24T14:25:57-04:00"
draft: false
image: img/blog/pytorch_2024_recap.webp
authors: ['Rebecca Bilbro']
profile: img/team/rebecca-bilbro.png
tags: ['AI', 'LLMs', 'Fine-tuning']
description: "Find out what you missed at PyTorch Conference 2024!"
---

I spent last week in San Francisco meeting up with the Rotational team to attend [PyTorch Conference](https://events.linuxfoundation.org/pytorch-conference/). If you're an LLM developer and didn't make it this year, here are some of my key highlights and takeaways.

<!--more-->

PyTorch is increasingly becoming a most-loved tool in the toolbelt for many of us who build and finetune language and computer vision models, and this year Rotational was excited to give back to the community as a conference sponsor. One of the coolest things about having a sponsor booth is that you get to talk to a lot of people about what stood out most to them about the conference.  Here are some of the main things people were talking about:

## PyTorch-Native LLMs Are Here

Exciting developments with [TorchTitan](https://github.com/pytorch/torchtitan), [TorchTune](https://github.com/pytorch/torchtune), and [TorchChat](https://github.com/pytorch/torchchat) provide a more streamlined workflow where you can build, finetune, and deploy models directly in PyTorch.

![Towards a PyTorch-Native Workflow](img/blog/pytorch-native-workflow.webp)


## Simplicity Wins

For a long time, the way to make deep learning models better was to make them more complex, but the popular opinion is starting to shift. In his talk on the evolution of LLM architectures, [Sebastian Raschka](https://pytorch2024.sched.com/event/1iw0K/keynote-navigating-the-architectural-timeline-of-llms-sebastian-raschka-staff-research-engineer-lightning-ai?iframe=no&w=100%&sidebar=yes&bg=no) explained that there is a growing trend towards simpler models.

![The Evolution of LLMs: Towards Simplicity](img/blog/llm-architecture-evolution.webp)

For instance, Llama 1 7B ditched the Dropout layers and swapped LayerNorm for the simpler RMS. Simplifying these model architectures makes training, tuning, and deployment easier, and doesn't seem to handicap model performance as much as everyone used to think it would.

## Data Over Hardware

One of the most consistent themes across the talks at PyTorch was the criticality of high quality training data. It turns out that high-quality data can accelerate training faster than expensive hardware upgrades and more effectively than better algorithms.

This calls to mind the old adage that ["more data beats better algorithms"](https://anand.typepad.com/datawocky/2008/03/more-data-usual.html) (perhaps it should be updated to "better data beats better algorithms").

Unfortunately, data quality is one of the things that AI developers rarely control, which has driven most of us to explore more complex algorithms and GPUs. But for the executives and decision-makers out there, spending more on quality data will take you further than spending more on hardware.

## Context Matters in Testing

Testing models is hard, which as [Chip Huyen](https://huyenchip.com/) pointed out in her keynote, "Why You Should Think Twice Before Paying for an Evaluation Tool," is complicating the development of general-purpose LLM training and evaluation platforms.

![Testing LLMs is hard](img/blog/evaluation.webp)

Huyen pointed out that models are also increasingly contextual, meaning that at least some of the evaluation criteria should be model-specific. For instance, if we perform [transfer learning on a pre-trained HuggingFace model](https://youtu.be/NdNh9OIj33Y?si=FluA9OLH-iGcHm86) using a domain-specific dataset, we could quantify how much better the model performs on domain-specific tasks compared to the base model.

## Model Depth vs. Size

For a long time, there hasn't been a clear rule of thumb on how to tune LLM model parameters to improve models for information retrieval versus other more complex tasks. Tuning often requires significant experimentation that can sometimes look more like art than science.

Several speakers and attendees mentioned [recent research](https://arxiv.org/pdf/2404.07066) which suggests that shallow layers can effectively encode simple knowledge bases, while complex reasoning tasks need deeper layers. In other words, to make models "smarter" we may first need to determine if our primary goal is more knowledge or better reasoning.

## Final Thoughts

PyTorch Conference is still oriented towards core developers (most open source package-oriented conferences start out this way, in my experience), and most of the talks were oriented towards issues faced by teams at companies like Meta, NVIDIA, Google, and Intel. There were tons of talks about topics like auto-sharding, hardware acceleration, and ML on the edge. It was fascinating to hear how these organizations understand the current state-of-the-art, and how the PyTorch API is evolving. Next year I'll bet there will be more talks from practitioners (i.e. AI/ML use cases and "what we built with PyTorch").

The PyTorch/Tensorflow [flame wars](https://x.com/fchollet/status/1348664247388049416) feel like a long time ago. Incubated at Google, [TensorFlow](https://www.tensorflow.org/) was open-sourced first (~2016) and initially dominated the deep learning field with its stable API (thanks largely to Keras), and the novel visual diagnostics of Tensorboard. [PyTorch](https://github.com/pytorch/pytorch) was open-sourced by Facebook a year later and has steadily gained popularity, particularly since the release of the v1.0 API. Back in the late 2010's, machine learning practitioners were increasingly talking about much more pythonic PyTorch was compared to Tensorflow, but there was a sense that it wasn't quite as production-ready. Today, both frameworks are still widely used.

One message came through loud and clear in the 2024 conference &mdash; PyTorch is evolving to support generative AI use cases. Given how complex and painful LLM development is for those of us in the trenches right now, this could give PyTorch the edge over other AI/ML frameworks.

If you attended PyTorch this year, let us know what stood out most to you!