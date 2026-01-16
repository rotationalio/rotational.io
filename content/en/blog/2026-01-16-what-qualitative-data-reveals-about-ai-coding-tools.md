---
title: "Finding the Sweet Spot: What Our Qualitative Data Reveals About AI Coding Tools"
slug: "what-qualitative-data-reveals-about-ai-coding-tools"
date: "2026-01-16T06:57:40-05:00"
draft: false
image: img/blog/2026-01-16-what-qualitative-data-reveals-about-ai-coding-tools/working-with-agents.webp
photo_credit: "Image generated using GPT-5"
authors: ['Rebecca Bilbro', 'Beci Lambrecht']
profile: img/butterfly.png
tags: ['AI Tools', 'Project Management']
description: "Analyzing numbers didn't tell the whole story. Here's what we learned from asking our engineers about their experience with AI coding assistants."
---

In the first installment of this [internal study](blog/do-ai-coding-assistants-help/), we described the six-month study we conducted this past year to better understand how AI coding assistants impacted the team at Rotational. 

<!--more-->

In that first post, we focused on quantitative measures of productivity: stories completed, points per sprint, and other easily accessible metrics. Those interim results were inconclusive, but the study sparked a lot of thoughtful discussion (both internally and on LinkedIn), much of it pointing out that productivity is complex and contextual, and that proxy metrics don't capture it very well (especially once people begin to optimize their behavior around what's being measured). To better understand what was actually changing, we turned to qualitative feedback from engineers about their day-to-day experience using these tools. In this post, we'll focus on what they told us in qualitative interviews.

### **It's Not About "Good" or "Bad"**

What emerged most clearly from these interviews was not a binary judgment of "helpful" or "harmful," or even a clear preference for a specific tool (we were testing both VS Code and Cursor). Instead, our engineers described a pretty big usage spectrum, ranging from minimal use of AI to near-complete delegation of code generation.

---
> On our team, you've got people who aren't using a coding assistant at all, and others who are using it so heavily that entire PRs look like they were written by the tool.
---

Across these perspectives, a consistent pattern appeared: there seems to be a "sweet spot" of adoption. Light to moderate use successfully reduced friction and improved developer experience, while heavy reliance introduced new challenges. In other words, more usage was not necessarily better usage.

### **The Real Win: Offloading Keystrokes, Not Thinking**

Where AI coding assistants were most effective was in offloading mechanical effort rather than cognitive work.

---
> I've been trying to use it more to reduce my keystrokes rather than reduce my cognitive load. Don't offload the thinking. Just offload the typing.
---

Our engineers repeatedly pointed to tasks like refactoring repetitive code, updating docstrings, making systematic edits, or performing tedious transformations as areas where these tools genuinely helped. In these cases, the assistant acted less like a substitute for thinking and more like an accelerator for execution. Importantly, our team emphasized how much they valued preserving their sense of code ownership and comprehension.

---
> I don't want it to offload the thinking for me; that part still needs to be mine.
---

### **The Other End of the Spectrum**

Their concerns were most concentrated on the other end of the usage spectrum. When large portions of code were delegated wholesale to an AI assistant, engineers described breakdowns in learning and collaboration. There were worries that junior developers might learn to generate code before learning how to read it, a reversal of a skill hierarchy many senior engineers see as foundational.

---
> I've often said that reading code is more important than writing it, and that's even more true with AI coding assistants.
---

Even experienced engineers reported friction: effective use required them to develop new habits around prompting, configuration, and style control, and those skills were unevenly distributed.

---
> As a senior engineer, it's going to take me time to develop these new habits, but I'm willing to try if it leads to real productivity gains.
---

And, as discussed in the first installment of this analysis, collaboration suffered as well. Because most prompts were invisible, PR intent became harder to guess, and as a result, code reviews became more difficult when reviewers couldn't understand the goals or context for the new changes. While these costs didn't show up in our sprint metrics, everyone felt them.

---
> If you're using different tools for writing and reviewing code, they can have very different opinions about what 'good' code looks like and that can make reviews harder.
---

### **Why the Numbers Told an Ambiguous Story**

Taken together, our qualitative findings help explain why the quantitative data told such an ambiguous story. AI coding assistants do change how work gets done, but not in a uniform or easily measurable way. They are most valuable when they accelerate work we already understand, and most harmful when they replace processes that build shared understanding and trust.

---
> It's been helpful to really stop and evaluate how I'm using it, rather than just assuming more automation is better.
---

From this perspective, the lack of a clear productivity signal isn't a failure of either of the tools we were testing or of our study, but it is a reminder that productivity is as much about comprehension as it is about output. So the question isn't whether or not to use AI coding assistants, but how to use them without displacing the human understanding that the software lifecycle depends on.

### **Learning in Public**

It feels important to continue discussing as a team how and how much we are employing coding assistants. We can start to feel insecure if we're offloading too much - but we're all figuring this out together. That's something our team really values: being willing to try new things, share what we're learning (even when it's messy), and adjust our approach based on what actually works. At the end of the day, the goal isn't to be the team that uses AI the most, it's to be the team that ships value, maintains code quality, and keeps learning — together.  