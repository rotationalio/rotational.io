---
title: "Making Sense of LLMs"
slug: "making-sense-of-llms"
date: "2025-08-27T09:45:00-04:00"
draft: false
image: img/blog/2025-08-27-making-sense-of-llms/llm-architecture.png
photo_credit: "Image generated using GPT-5"
authors: ['Edwin Schmierer', 'Steve Veldman']
profile: img/butterfly.png
tags: ['AI Agents', 'LLMs']
description: "How LLMs power AI agents and what to consider when choosing the right approach."
---
# Making Sense of LLMs

Now that we’ve covered [agents at a high level](https://rotational.io/blog/ai-agents-defined/) and [prompts](https://rotational.io/tags/prompt-engineering/) specifically, let’s move to the next component in our series: **Large Language Models (LLMs)**, a key subset of generative AI. In an agentic framework, LLMs serve as the “brain” or decision-execution component of the agent.  

---

## What Are LLMs?  
At their core, LLMs are probabilistic machine learning models that have been algorithmically trained on vast text corpora (e.g., [Common Crawl](https://commoncrawl.org/)) to generate text. Most are “next token predictors,” meaning they generate the next word (or token) in a sequence based on what came before. They come in a variety of forms and sizes, including “reasoning” models that generate and evaluate multiple possibilities before producing a final output.  

Generative AI isn’t limited to text. Other modalities include audio, images, and video (and models of any modality can be adapted to domain-specific applications like biology). For this post, though, we’ll focus on text-based LLMs.  

---

## How They Work  
Unlike traditional software, which follows deterministic rules, LLMs operate probabilistically. They aren’t hard-coded with logic; instead, they’re “instructed” via prompts to complete tasks within a given context. They then complete these tasks by generating tokens (which represent words, portions of words, or specific text characters) based on a probability distribution learned during the training process.  

How well they perform depends on several factors: model fit, the quality of the prompt, and the context provided. Outputs can be assessed informally (“does this seem right?”) or through more rigorous evaluation as we discussed in [this post](https://rotational.io/blog/pick-the-best-ai/).  

Most modern LLMs rely on **transformer architecture**, which processes input through multiple layers of statistical analysis and pattern recognition. That’s the “T” in GPT: *Generative Pre-trained Transformer.*  

For a clear visualization of this complexity, see [bbycroft.net/llm](https://bbycroft.net/llm). Thanks to GPUs, these computations happen in milliseconds.  

---

## How Businesses Access LLMs  
Organizations typically access LLMs in three ways:  

### 1. Proprietary Models  
Providers such as OpenAI, Anthropic, Google, and Microsoft offer API-based access to high-performance “foundation” models. These companies invest heavily in training, infrastructure, and R&D. Pricing for individuals and smaller organizations is usage-based, commonly per million input tokens (e.g., $1) and per million output tokens (e.g., $4). The higher output cost reflects the greater compute required to generate text. Enterprise customers may also arrange for "provisioned throughput" or "reserved capacity" agreements, where they pay a fixed fee for a certain level of performance rather than paying per token (though these are typically reserved for large organizations with substantial AI budgets).  

### 2. Open Source Models  
More accurately called “open weight” models because the underlying training data and source code are often unavailable, these can be downloaded and run in your own environment. While some models are small enough to run on a local device like a laptop, most common use cases benefit from models that need to be hosted with GPU access, such as an on-premise server or in a private cloud. 

Examples include **Meta’s Llama, Mistral, and DeepSeek**, many of which are distributed via platforms like [**Hugging Face**](https://huggingface.co/).

### 3. API Gateways  
A newer approach is using providers like **OpenRouter, LiteLLM, or Portkey**, which act as a unified API across many models and providers. This single, standardized interface makes it possible to route queries in real-time based on cost, performance, or availability (including automatic failover for continuity).  

---

## Proprietary vs. Open Source: Trade-Offs  
Choosing between models depends on business priorities and trade-offs:  

- **Proprietary APIs**: 
  - Pros: Low barriers to entry, fast time-to-value, and access to best-in-class models.  
  - Cons: Dependency on a 3rd party, sending you proprietary data to an external processor, limited ability to customize, and risk of costs escalating quickly at scale

- **Open Source Models**: 
  - Pros: Greater control, customizability, and cost management at scale.
  - Cons: Higher upfront investment and the need for skilled teams and infrastructure to host and maintain.  

Other considerations affect model selection including:  
- **Latency**: Edge use cases (e.g., sensors, vehicles, mobile devices) often require local inferencing, making cloud APIs impractical.  
- **Regulation**: Highly regulated industries (e.g., healthcare, defense) may prohibit sending sensitive data to external providers.  
- **Cost efficiency**: As smaller models improve, they’re becoming attractive alternatives for specific workloads.
- **Guardrails**: Best-in-class proprietary models often include robust, thoroughly tested mechanisms to prevent misuse and abuse. However companies that need to ensure their AI models adhere to specific safety, ethical, or compliance policies may require the ability to implement and manage their own guardrails. While a greater level of control is available with self-hosted models, when setting up custom guardrails make sure to plan for the same careful design and thorough testing required for the other components of your AI system.

---

## Build **and** Buy  
Model strategy doesn’t have to be a binary “build vs. buy” decision. The real advantages lie in **flexibility** - companies can now select from hundreds of models and align them with different workflows. Differentiation also comes from tailoring models to your domain expertise.  

Hybrid approaches to model implementation are also feasible. For example, use a commercial API to quickly spin up a **proof-of-concept**, then migrate to a self-hosted model once you scale. Or split workloads by outsourcing **low-risk tasks** to an API while running **mission-critical applications** on open source models.  

The takeaway: **model selection should always be driven by the business case and underlying fundamentals, not hype.**  

---

That’s it for LLMs. Next in our agent series: **tools and integrations**.  

In the meantime, [contact us](https://rotational.io/contact/) if you’re interested in exploring an affordable proof-of-concept for your organization or a demo of Endeavor, our collaborative AI agent management platform for creating trusted, business-aligned agents that deliver real results.
