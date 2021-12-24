---
title: "Data Curation: A Whale of a Problem"
slug: "data-curation-baleen"
date: 2021-12-24T11:37:43-05:00
draft: false
image_webp: images/blog/whale.webp
image: images/blog/whale.jpg
author: Nabiha Naqvie
description: "Recent developments in Artificial Intelligence (AI) and Natural Language Processing (NLP) indicate a growing need for better mechanisms for collecting curated datasets, and introduces a new open source tool for this purpose."
---

Once you become an AI/ML practitioner, you quickly realize that the machine learning work is often the *least* challenging step in the pipeline. So what's still really, really hard? Getting good data! In this post, we'll explore why that is and introduce a new open source tool for data curation, Baleen. <!--more-->

The world of AI has seen a rapid increase in its practical usage, as AI companies and startups raised $33 billion during 2020.[^1] Many companies like Urbint are using AI and real-world data to predict and prevent incidents that threaten critical infrastructure, workers, the community, and the environment.[^2] Similarly, DataRobot claims to have the only AI Cloud platform with an AI-native strategic team to help its customers use and understand their data.[^3] Natural language processing applications have also seen a surge; 60% of technology leaders report that their NLP budgets grew by at least 10% in 2021, while 33% reported a 30% increase, and 15% reported they had more than doubled.[^4]

Although this accelerated movement towards AI, NLP, and Machine Learning has added value to how we interact with and perceive the world, we are consistently reminded to be cautious about the acceleration of technology. The fears of some detractors are difficult to take seriously, but even some of the most brilliant minds have expressed concerns:

> We cannot quite know what will happen if a machine exceeds our own intelligence, so we can't know if we'll be infinitely helped by it, or ignored by it and sidelined, or conceivably destroyed by it. -Stephen Hawking [^5]

So what is it that we're worried about? Data.

## Why Data is the Real AI/ML Problem

Many machine learning models are built off of general rather than custom datasets.  GPT-3 (Generative Pre-trained Transformer 3) is an NLP model that is trained on a large text corpus to generate human-like text.[^6] It caused a lot of excitement around human-like text production, where newspaper companies like The Guardian were publishing articles that were written by GPT-3.[^7] GPT-3 was considered the next big thing in the AI and the NLP world because its uses were unlimited: generating code, Regex, cloning websites, object-use case generation, creating charts and plots, playing games, identifying painting, producing quizzes, meme maker, etc.[^8]

However, there was a turning point to this invention that sparked a lot of controversy, as independent researchers found that given the word "Muslim" as a prompt, GPT-3 could generate 60% of its sentences that including bombs and violence. Similarly, there was a greater association of negative words with "Black people". OpenAI addressed this issue by stating that:

> GPT-3, like all large language models trained on internet corpora, will generate stereotyped or prejudiced content[^9]

The goal of training GPT-3 on a large, general dataset may have been to imbue the model with general intelligence, but unfortunately its creators also unknowingly fed toxic elements into the machine learning model. As a result, GPT-3 is ultimately limited by the data used to teach it to "speak", much of it rife with racism, sexism, and religious prejudice. This is one of the key [pitfalls of megamodels](https://rotational.io/blog/a-parrot-trainer-eats-crow/) trained on uncurated text.

Are models better when trained on more specific data? Github's Copilot may be an example of AI that is trained on custom dataset. Copilot (run by OpenAI Codex) is designed to help developers generate code faster. It works by "understanding" the previous lines of code and suggesting individual lines and whole functions instantly[^10], and is trained on code respositories on Github.[^11] In order to properly utilize NLP, AI and deep learning, we need to produce quality models that contain quality data.

## Getting Better Data for AI/ML

So how can you create your own curate data to ensure your machine learning models have the best quality input? At Rotational, our emphasis is to approach NLP (and other ML problems) by first generating and storing custom datasets to allow for better machine learning models. This is where projects like Baleen can fill in the gap.

[Baleen](https://github.com/rotationalio/baleen) is an example of an automated ingestion service for RSS feeds to construct a corpus for NLP research. Written in Golang, the ingestion system fetches RSS feeds and stores raw data into S3. Baleen also collects data quality measurements with language statistics, such as total words, vocabulary (unique words), hapaxes (words that only occur once through the corpus), rate of corpus growth, number of entities, etc.[^12] Users can specify their own [custom list of RSS feeds](https://github.com/rotationalio/baleen/tree/develop/fixtures) to Baleen. Note that because  publishers and authors of the original articles hold the copyright to their works, data collected via Baleen should not be used for commercial purpose, only for educational purposes. Nonetheless, Baleen presents an example that others can use as a model for data collection and curation.


***

Photo by [Art of Backpacking](https://flic.kr/p/8GAVjS) on [Flickr Commons](https://flic.kr/p/8GAVjS)

---
[^1]: https://builtin.com/artificial-intelligence/ai-companies-roundup
[^2]: https://www.urbint.com/about
[^3]: https://www.datarobot.com/abo
[^4]: https://www.globenewswire.com/news-release/2021/09/21/2300838/0/en/Enterprise-Investments-in-Natural-Language-Processing-Surge-in-2021-and-Accuracy-Remains-the-Top-Concern-New-Research-Reveals.html
[^5]: https://www.bbc.com/news/technology-30290540
[^6]: https://en.wikipedia.org/wiki/GPT-3
[^7]: https://www.theguardian.com/commentisfree/2020/sep/08/robot-wrote-this-article-gpt-3
[^8]: https://www.educative.io/blog/top-uses-gpt-3-deep-learning
[^9]: https://onezero.medium.com/for-some-reason-im-covered-in-blood-gpt-3-contains-disturbing-bias-against-muslims-693d275552bf
[^10]: https://copilot.github.com/
[^11]: https://www.fast.ai/2021/07/19/copilot/
[^12]: https://github.com/rotationalio/baleen
