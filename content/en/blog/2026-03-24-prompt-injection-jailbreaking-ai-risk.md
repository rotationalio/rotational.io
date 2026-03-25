---
title: "Prompt Injection, Jailbreaking, and the Risk Every AI Deployment Inherits"
slug: "prompt-injection-jailbreaking-ai-risk"
date: "2026-03-24T09:00:00-05:00"
draft: true
image: img/blog/2026-03-24-prompt-injection-jailbreaking-ai-risk/otter-guardian.png
photo_credit: "Image generated using GPT-5"
authors: ['Edwin Schmierer']
profile: img/team/edwin-schmierer.png
tags: ['AI Security', 'Enterprise AI']
description: "Jailbreaking and prompt injection are often confused but carry different risks. Understanding both is essential for any leader connecting AI to internal systems, data, and tools."
---
Most AI conversations focus on productivity. Fewer focus on what happens when that same AI becomes a doorway into your systems. AI security can sound abstract until it's tied to business risk. Two misunderstood threats illustrate the double-edged nature of AI: the same capability that makes it useful is what makes it exploitable.
<!--more-->

## Jailbreaking: When the User Tricks the Model

Jailbreaking happens when someone deliberately prompts an AI system to ignore its safeguards. A widely-reported recent example: [an actor used Claude under the cover of a "bug bounty" exercise to obtain roughly 150GB of sensitive data from the Mexican government](https://www.engadget.com/ai/hacker-used-anthropics-claude-chatbot-to-attack-multiple-government-agencies-in-mexico-171237255.html). No malware. No stolen credentials. The model was simply persuaded to cooperate.

## Prompt Injection: When the Content Tricks the Model

Prompt injection is different. Harmful instructions are hidden inside content the AI processes: a website, a document, a file. If the system can't distinguish trusted instructions from untrusted ones, it may take unsafe actions, especially when connected to internal tools or data.

## Why Both Threats Work

At their core, AI models are naive instruction followers. They are built to comply, not to question where an instruction came from. Yes, guardrails help, and models will respect them the vast majority of the time. But LLMs are probabilistic, not deterministic. There is no guarantee they hold every time.

And AI security is fundamentally asymmetric: attackers get infinite attempts. Your defenses only need to fail once.

**AI doesn't just create productivity gains. It creates a new attack surface.** If your AI assistant can reach customer records, internal documents, or operational tools, a model failure isn't a glitch, it's a business incident.

## What This Means for Your Security Strategy

The good news: what works here isn't new. Defense in depth — the same principle that has underpinned security for decades — applies directly. Layered access controls, input validation, human-in-the-loop approvals, least-privilege permissions, and monitoring ensure that when one layer fails, others hold.

Guardrails are a starting point, not a solution. The goal isn't perfect prevention. It's limiting the blast radius when something goes wrong.

Jailbreaking and prompt injection aren't just security jargon. They're proof that what makes AI powerful — its ability to follow instructions — is exactly what makes it a risk. Leaders who understand that will build accordingly.
