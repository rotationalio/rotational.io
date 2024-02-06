---
title: "How to Plan and Scope LLM Projects"
slug: "how-to-plan-and-scope-llm-projects"
date: "2024-02-01T15:07:38-05:00"
draft: false
image: img/blog/2024-02-01-how-to-plan-and-scope-llm-projects/project-plan.jpg
photo_credit: "Photo by [Alvaro Reyes on Unsplash](https://unsplash.com/@alvarordesign?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash)"
authors: ['Prema Roman']
profile: img/team/prema-roman.png
tags: ['AI', 'ML', 'LLM', 'Strategy']
description: "Adopting an agile-based approach to LLM projects enable organizations to thrive in an AI world."
---

Move over ChatGPT, here come the Large Language Models (LLMs). More and more companies are incorporating LLMs into their operations. Are you ready? Here's the guide to how Rotational plans and scopes our LLM projects.

<!--more-->

# 5 Steps to LLM Project Success

The popularity of ChatGPT has brought Large Language Models (LLMs) to the forefront, and many companies we're speaking with are interested in costing out an initial project. Many questions we hear are to the effect of:
*Is this something that will take us 3 months, or 1 year? Will this cost under $50k? Is that even the right magnitude?*

Every company is unique, and our team has seen a lot of extremely innovative pitches for pilot projects. We've even been lucky enough to implement some of them! Over time, we've noticed a few common themes in the scoping and planning of the projects that ultimately realize success. These are:

## Step 1: Define A Use Case Around A **Small, But Real, Pain Point**

It's hard to learn how to spot good use cases for AI &mdash;  it's something that comes with experience (or you can [hire us!](https://rotational.io/services/)). There are some telltale signs that you learn to look for (things like very repetitive review tasks, extremely unique vocabularies and acronyms) that signal an opportunity to solve a problem with data. 

But when you're just starting out, it can feel a little overwhelming, since LLMs can be used in a wide variety of applications: chatbots, text summarization, content creation, information retrieval, etc. LLMs have so many potential uses that companies can't figure out where to start.  One way to get past this hurdle is to simplify your goals.  It's best to think in terms of only one or two specific use cases at the beginning, then build up from there.

There are two approaches to defining use cases:
1. What new solutions can we build using LLMs given our expertise in the industry?
2. What pain points are we currently experiencing that can be reduced by using LLMs?  What business processes are currently too inefficient?

Many companies focus on the first approach.  Developing new solutions has the potential to generate more revenue that will help grow the business.  But while the second approach is not nearly as glamorous, the best use case for AI is to streamline existing functions that cause friction which potentially lead to employee turnover and customer churn.

Let's take customer service as an example.  Despite all the innovations in customer service such as self-service systems and chatbots, many customers have negative experiences because the automated solutions do not meet their needs.  How many times did you input all of your information through an automated system only to have a customer service representative (CSR) ask you for the same information?

Imagine instead if your CSRs had some knowledge about the customer's history with your business that will enable them to provide a more tailored experience?  Think about how much better that interaction will be and now instead of having an unhappy customer you have a customer who is delighted and is more likely to recommend your company to others.  This leads to a virtuous cycle leading to enhanced customer experiences that create the kind of enthusiasm for your product that ultimately helps grow your business. As your business grows, the CSRs handle the demands better than ever, boosting the number of happy clients, who will start to champion your products.

This is exactly the [strategy](https://www.entrepreneur.com/finance/williams-sonoma-a-retail-odyssey-in-the-modern-market/468587) that Williams-Sonoma used to maintain profitability in a difficult market.  


## Step 2: Assemble A Data Team To Help With Scoping

Assemble a cross-functional team of data scientists, data engineers, software engineers, along with a product manager plus stakeholders who are responsible for providing feedback.  It is critical that the people who are building the product have direct access to those who are actually using it in order to ensure alignment and quick feedback loops.  If you don't have the talent in-house, you can start by hiring consultants and then develop the talent within your organization.

It is imperative to scope any successful project **with a team**. Engineers and algorithmic thinkers define problems in different terms than product owners do, so plan sufficient lead time and budget to get at least a few other data people engaged in these scoping and planning activities with you.


## Step 3: Create A Data Product Requirements Document (DPRD)

A Data Product Requirements Document (DPRD) defines the requirements for the product that your technical team will be building.  It serves as a roadmap that ensures that the business and technical teams are aligned on the product's purpose. This is a slightly different twist on the traditional Products Requirements Document (PRD) that is tailored specifically for machine learning products.

The DPRD does not have to be overly complicated.  In fact, it's best to keep it to as few pages as possible so that it is easy to reference through the course of product development.  The following is an outline of what should be included in the document.

- **Purpose:** It is very important to ensure that everyone has a shared understanding of what the end goal is.  The end goal dictates the type of LLM(s) used and the metrics required to evaluate them.
- **Data sources:** It is also critical to define the data sources used to build the LLM.  This can be either internal data or third party data or a combination of both.
- **Architecture diagram:** The architecture diagram serves as a guide to show the data flows from data ingestion all the way up to the end user interface where the model predictions/outputs are served.  This doesn't have to be anything fancy.  It is also not advisable to prematurely commit to a tech stack.
- **Dependencies:** Dependencies include everyone who is involved in product development as well as external dependencies such as external personnel or tools.  It is important to identify these in order to understand the costs and risks involved.
- **Evaluation metrics:** Evaluation metrics provide a guide to help evaluate the performance of the LLM(s).
- **Feedback/Monitoring framework:** Once the metrics are defined, they need to be part of a monitoring framework that will be used to continually monitor the performance of the LLM.  It is not sufficient to just use metrics during the model training phase.  Model drift and data drift cause models to go stale after they are released and so it is essential to have monitoring in place.  There should also be a mechanism to capture and use feedback to continually improve the product over time.  In fact, feedback is even more important than metrics because feedback from end users is what can provide the best insight into where the model is weak and the areas that require improvement.


## Step 4: Choose The Right LLM For The Job

ChatGPT captured everyone's attention in 2023 with its ability to perform a wide variety of tasks like writing articles and drafting emails.  However, using it in an enterprise solution comes with many risks.  It can get very expensive and users don't have the ability to address issues when they arise and there are privacy concerns.  Also, OpenAI controls when and how features are added or updated, which can have detrimental impact on your business if you rely on features that are no longer supported.  Furthermore, while ChatGPT has proven to be good at a lot of general tasks, it doesn't do as well in narrow domains.

Fortunately, [Huggingface](https://huggingface.co), [Mistral](https://mistral.ai), and others provide open source LLMs that companies can fine tune with their own data to build domain-specific LLMs tailored for their specific use case.  Organizations using these open source LLMs have the ability to build the features that are most relevant for their use cases and do not have to worry about a third party vendor having access to their IP.  These LLMs are categorized by the types of tasks they can perform and there is plenty of documentation to get started. 

And the best part?  Companies don't need a lot of data.  Open source LLMs are already pre-trained on a large corpus of data but with a technique called transfer learning, these models can be fine tuned on a much smaller corpus from a specific domain.  The end result is that not only are costs cut on compute and data, the results are much more accurate than those generated by a proprietary closed source LLM such as ChatGPT.


## Step 5: Cost Out The Whole Cost

Costing out the whole cost means considering both developer time and money, as well as the realities of off-the-shelf solutions, which we have all used enough of to know will never fully automate anything.

Traditionally, machine learning projects were built in a research-oriented fashion, much like waterfall in software engineering.  The focus was on building the best model for the task.  But just as waterfall did not last as a framework in software engineering, research-oriented machine learning is not suitable in the workplace because companies need to see immediate value in their machine learning investments in order to be competitive.

So how can organizations balance the need for both speed and accuracy?  The answer: take a cue from software engineering projects and employ an agile-based framework to machine learning projects.  An agile based framework for a machine learning project looks like this:

- Break down a large project into smaller tasks that can be completed within 1 or 2 sprints (two weeks to a month).  
- Create a feedback mechanism through which stakeholders provide feedback to the model developers so that the model can be improved over time.

Here is the thing: just because an ML model performed well during the training phase doesn't mean that it will necessarily perform well in production.  This is because there are a lot of uncertainties.  Nobody knows ahead of time the kind of data the model will encounter in production.  On top of that, data is constantly evolving, so a deployed model can get stale quickly.  

It is precisely for this reason that it's best to do the work in short cycles so that feedback can be incorporated early and often to ensure that machine learning projects succeed.

A typical machine learning project consists of the following tasks:
- Data ingestion
- Feature selection and engineering
- Model selection and evaluation
- Model deployment
- Model monitoring

Estimate to complete each task in 1 to 2 sprint cycles, with a little cushion time to ensure that you are incorporating feedback into each step.  Your project will look something like this:

<img src="img/blog/2024-02-01-how-to-plan-and-scope-llm-projects/ml-cycle.png" width="400" height="600">


### Project Cost Considerations

- **Build versus buy:** As mentioned before, companies can purchase a pre-built solution so that they don't have to hire staff to build these solutions but they are left at the mercy of the vendor and will have to consider the risk associated with dropped features and privacy violations.  An alternative solution is to consider hiring talent in house or start with consultants to build the LLM and hand it off after deployment.
- **Open source versus proprietary LLMs:** Generally speaking, open source LLMs have permissive licensing arrangements, which means that they are either free to use or cost significantly less than using a closed source LLM like ChatGPT.
- **First-party data versus third-party data:** First-party data will be cheaper than third-party data and often that might be all that is needed to develop the solution.  Only consider augmenting with third-party data if the data that is present within the organization is insufficient.  How much data do you need?  The answer is not as much as you may think.  Refer to the example below.
- **Computer hardware requirements:** If you are fine tuning an open source LLM on a small subset of your data, it is entirely possible to have a working solution using just a single beefy laptop.  In other words, it is not a requirement to load up on GPUs.

*To wrap all of this into a specific example, we were involved in a project where we built a domain-specific LLM for an organization using a pre-built model from Hugging Face using just 12 MB of the company's data and through the course of **three iterations** built a solution in a single laptop that **revolutionalized** the organization's business.*


## Bonus Tip: Stay Agile

Even if it seems that every day there is some new development in the LLM space and it appears that your competitors are ahead of the curve, don't despair.  In spite of all of the hype, we are still at the early stages of the AI revolution.  The best strategy to remain competitive in a rapidly changing world is to embrace an agile mindset whereby you start small, gather feedback, and adapt as necessary.





