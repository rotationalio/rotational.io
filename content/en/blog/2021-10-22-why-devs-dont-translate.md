---
title: "Why Developers Don't Translate The Docs"
slug: "why-devs-dont-translate"
date: "2021-10-21T20:25:35-04:00"
draft: false
image: img/blog/hubble_tarantula_nebula.jpg
author: Rebecca Bilbro
category: i18n
photo_credit: Judy Schmidt via Flickr
description: "Many tech projects do not translate their docs, often at the expense of reaching a more global userbase. In this post we explore why."
profile: img/team/rebecca-bilbro.png
---

Stars, forks, likes, upvotes, downloads. In a world where user metrics rule, why don't more technical projects translate their docs to reach more global users?
<!--more-->

Have you ever wondered why the large majority of software is monolingual? Think about the documentation, examples, code, and API of your stack of choice. It's likely that it is available in one language only (usually English). Incredibly, this holds true for some of the biggest, most well-known, and well-funded projects. You'd think making tech accessible to speakers of other languages would be a surefire way to rapidly gain global users and market share, so what gives?

At Rotational, we're in the business of building globally distributed applications. Distributed systems are composed of many technological problems &mdash; from the hardware in data centers to the consensus algorithms that maintain consistency guarantees. But if you plan to have users, they're also sociocultural systems, and high throughput with strong consistency doesn't matter if linguistic accessibility is the bottleneck.

The truth is, translating docs is way, **way** harder than you might think. In this post, we'll dive into the 5 main reasons that prevent developers and tech companies from taking this seemingly obvious step:

## Reason 1 - We think English has it covered

To cut right to the main reason developers don't translate their docs, we tend to believe that English is universal. Indeed, English is spoken in some form by [many people](https://www.statista.com/statistics/266808/the-most-spoken-languages-worldwide/) around the world:

> In 2021, there were around 1.35 billion people worldwide who spoke English either natively or as a second language, slightly more than the 1.12 billion Mandarin Chinese speakers at the time of survey. Hindi and Spanish accounted for the third and fourth most widespread languages that year. - Szmigiera (2021)

Perhaps it is because the history of software development to date has been marked by such dramatic growth that we mistakenly believe there will always be more users out there for us to acquire. However logic suggests that this cannot remain true indefinitely, especially if we limit ourselves to English speakers. With a global population of [nearly 8 billion people](https://www.worldometers.info/world-population/), there are far fewer people who speak English than not.

Moreover, offering software in an English-only format runs the very real risk not only of _failing to intice_ new users, but even _alienating_ them. In a 2006 report, “Can’t Read, Won’t Buy: Why Language Matters”, DePalma et al. discovered that unless you’re already a successful international brand, [using English-only as a sales medium will alienate people](https://rotational.io/blog/cant-read-wont-buy/) in other countries who do not speak English, or don’t use it as a primary language.

## Reason 2 - We think machine translation has it covered

Another big reason that developers don't translate their docs is because we believe that translation is a "solved" problem when it comes to artificial intelligence. This misconception has been fed on a stream of articles about the efficacies of GPT-3, the ubiquity of machine translation tools such as Google Translate, and fearmongering around the coming Singularity.

Language is complex and nuanced, filled with features that index linguistic relativities, cultural memberships, and extra-linguistic contexts that are all but impossible to encode, and which routinely expire. Look no further than the leading translation software companies, nearly all of which supplement pretrained neural models with expert human translators. Still don't believe me? Treat yourself to a viewing of [Hamilton According to Google Translate](https://www.youtube.com/watch?v=thtKA71xZ7k).

[Language models are getting bigger and better](https://rotational.io/blog/a-parrot-trainer-eats-crow/), but we're not there yet (maybe one day though!).

## Reason 3 - We think translators are expensive and hard to find

Well, yeah. Much like the process of finding a great barber, babysitter, or car mechanic, finding a translator that you trust and feel good about is hard. And you might be left feeling a bit insecure about how much you're willing to spend to get your docs translated.

Gig economy platforms such as Fiverr are flush with translators for a wide range of languages, but the majority offer only non-technical translation services. When your star rating on the platform factors heavily in to your search ranking, and therefore on your likelihood of getting jobs, it probably pays to play it safe with news articles and short stories.

Tech language is hard to translate. By corollary, technical translators may indeed be more difficult to find and more expensive than their non-technical counterparts. But what can you do? At Rotational, technical translation is something we have learned to build into our product and operations budgets.

## Reason 4 - The tools we use make it hard

There are a number of ways of building technical documentation, from document generators like Sphinx and document hosting services like Read the Docs (both of which we use for the open source machine learning project [Yellowbrick](https://www.scikit-yb.org/en/develop/)), to static site generators like Jekyll and Hugo (we use Hugo for most of our docs at Rotational). As much as these tools reduce the burden of creating project documentation, for the most part, their value proposition is distinct from internationalization (i18n) or localization (l10n) support.

If you plan to use a static site generator to build your project documentation, consider selecting [a template that will support multilingual docs](https://themes.gohugo.io/tags/multilingual/), even if you aren't quite ready to take the plunge yet with translation. But keep in mind that the majority of these templates have been contributed by individual creators and as such owe us little in the way of guarantees &mdash; you may discover that some site text is hardcoded in English, or that character-based alphabets and Cyrillic scripts are less well supported.

In our journey to internationalize and localize our documentation for the [Global Directory Service](https://vaspdirectory.net/) (a secure peer registry system for lawful international cryptocurrency transactions), one of the most surprising discoveries we have made at Rotational is that there is no real international standard for Markdown. Frustratingly, this means that some text editors seem to garble together character encodings and Western punctuation marks such as square brackets and parentheses, on which Markdown rendering relies.

## Reason 5 - We fear maintaining translated documentation

Maintaining documentation is a huge pain point in the tech world; it's something we all grumble about having to do, and yet also complain about when we as users can't find the package documentation for the latest version.

There's no doubt about it &mdash; maintaining multiple translations of the documents adds a significant burden on top of an already-loathed task.

On top of that, there's the issue of "LQA" &mdash; linguistic quality analysis &mdash; which drives home the challenge of reviewing and maintaining documentation that you can't understand, and thus can't systematically assess for quality or staleness.

## Conclusion

In 2019, one of the contributors to the Yellowbrick project, Juan Kehoe, translated some of our documentation into Mandarin. Although her translation was partial and we have struggled to keep it up-to-date, we routinely hear from [developers in China](https://cloud.tencent.com/developer/news/238057) that they chose to learn Yellowbrick because it had supporting documentation in Chinese. It was a game-changer for us.

In other words, if this post paints a somewhat bleak portrait of the challenges you will face when you endeavor to translate your technical documentation into other languages, do not lose heart. In our experience, getting started is the hardest part, and even small steps can cover a lot of ground.

And, if you're anything like us, you read in these inconveniences a brighter future, one filled with even better tools designed to address the problem of making software more accessible across linguistic and cultural borders and connecting with users around the world.

Do you have a project that puts i18n and l10n first? Are you working on an International Markdown/Markup standard? Keeping a beat on the next generation of language coverage tools? If so, we want to hear about it!

---

<!-- [Photo](https://flic.kr/p/Yaz1mM) by Judy Schmidt on Flickr, CC By 2.0 -->
