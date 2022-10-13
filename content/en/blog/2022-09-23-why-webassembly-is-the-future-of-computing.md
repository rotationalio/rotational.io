---
title: "Why WebAssembly Is the Future of Computing"
slug: "webassembly-the-future-of-computing"
date: "2022-09-27T08:51:27-04:00"
draft: false
author: Danielle Maxwell
image: img/blog/rocket.jpeg
photo_credit: Bill Jelen on Unsplash
category: WASM
description: "Learn about WebAssembly, how it is currently transforming web development, and why its future is bright."
profile: img/team/danielle-maxwell.png
---

<!--write the summary part that will be previewed *below* and before the "more" comment-->

If you talk about WebAssembly (WASM), you just may spark debate about whether it is really the next best thing in web development or the second coming of Java applets. In this post, we'll dive into WASM, how it is currently transforming web development, and why we think its future is so bright.

<!--more-->

<!--write the rest of your post below -->

That's exactly what happened on March 27, 2019 when Solomon Hykes, co-founder of Docker, tweeted “If WASM+WASI existed in 2008, we wouldn't have needed to created[sic] Docker. That's how important it is. WebAssembly on the server is the future of computing.”[^1]

If you’re like how I was a few months ago it’s possible that you don’t know much about WASM, and you're wondering how something so big could have passed you by. That’s totally understandable! As our COO, Edwin Schmierer, [wrote earlier this year](https://rotational.io/blog/five-technologies-quietly-transforming-the-web/), WASM is one of those things that has been quietly transforming the web.

Even if you _have_ heard of WASM, it’s still possible that you don’t know much about how it’s currently being used. By the end of this post, you should have a better understanding of what WASM is and how it's being utilized.

## What is WASM?

In March 2017, WASM was released as a binary instruction format for a stack-based virtual machine.[^2] To simplify things, developers can write code in a programming language and compile it to WASM [a list of languages that compile to WASM](https://github.com/appcypher/awesome-WASM-langs) where it is then translated into machine-readable code. This code will then have the ability to run inside the browser making it so that Javascript isn’t the only language with this functionality.

Since WASM allows other programming languages to be used in the browser, many believe that it will replace Javascript. It’s important to note that making Javascript obsolete isn’t one of WASM’s goals. In fact it may be used as a complement to Javascript. If Javascript is your language of choice, don’t worry, it’s not going anywhere.

Another important thing to note is that WASM isn’t only run in the browser. Its non-web embeddings also makes it possible to use on servers and Internet of Things (IoT) applications.

## Why use WASM?

Now, let’s talk about why WASM is growing in popularity. For starters, it’s fast. WASM was designed with speed in mind and runs code close to native speeds. It’s also secure. WASM is executed in a sandboxed environment which makes it so that it doesn’t interact with a host computer. Applications execute independently, and can’t escape the sandbox without going through an appropriate API. Another of WASM’s main benefits is its portability. Once it is compiled, it can be run on multiple platforms. This is also what allows WASM to run outside the browser.

## Who uses WASM?

Over the past 5 years since its release, WASM has helped many applications become faster, more efficient, or move to the browser. Let’s take a look at a few examples.

### Figma

In 2017, the app popular with designers (and recently acquired by Adobe) announced that they’d transitioned from using `asm.js` to WASM to compile their C++ code. Figma shared that this change led to a more than 3x increase in their load time. The company later shared that further optimizations led to improvements in zooming and dragging as well.[^3]

### Google Earth

Over the years, Google has experienced some difficulty making Google Earth available across the web. In 2019, the company announced that they used WASM to compile the application’s C++ to resolve this problem.[^4]

### TensorFlow

With Google Earth’s successful transition to WASM in mind, it’s no surprise that TensorFlow began using WASM as well. In 2020 a WASM backend was announced. The backend was later combined with single instruction, multiple data (SIMD) and multi-threading which led to it performing 10x faster[^5].

### Amazon

In January 2022, Amazon announced it had been using WASM for certain parts of its Prime Video app for about a year. The result of replacing some Javascript with WASM, helped reduce the average frame times on a mid-range TV from 28 milliseconds to 18. It was also noted that replacing some Javascript with WASM saved Amazon 30MB of Javascript memory heap.[^6]

## What’s next for WASM?

To learn more about its future, I recommend viewing the [roadmap listed on WASM’s website](https://webassembly.org/roadmap/). Also, you can read the [WebAssembly Working Group’s First Public Working Drafts](https://www.w3.org/blog/news/archives/9509) for version 2.0.

As for how developers feel about WASM, let's take a look at the results of Scott Logic’s The State of WebAssembly 2022 survey.[^7] Although the number of respondents was 299, this was an increase from the 250 who participated the previous year. More significantly the percentage of respondents who use WASM frequently increased from 47% in 2021 to 67% in 2022.

Additionally, a large percentage of those surveyed are highly-skilled in back-end development which infers an increase in WASM’s popularity with back-end developers. Results also showed an increase in using WASM for serverless and containerization.

One thing to note is that at present, the majority of applications leveraging WASM appear to be closed source or otherwise proprietary. It is very likely that the growth and expansion of WASM into open source communities will be a force multiplier, and we at Rotational are looking forward to seeing that happen.

To some, WASM may be the future of computing. However, I think it is the moment.

---

Photo by [Bill Jelen](https://unsplash.com/@billjelen?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/speed?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

---

#### References

[^1]: [Solomon Hykes' tweet](https://twitter.com/solomonstre/status/1111004913222324225?s=20&t=wkFGgH1RYDkCudA9MX2HoA)
[^2]: [WebAssembly website](https://webassembly.org/)
[^3]: [Figma, faster](https://www.figma.com/blog/figma-faster/)
[^4]: [How we're bringing Google Earth to the web](https://web.dev/earth-webassembly/)
[^5]: [Supercharging the TensorFlow.js WebAssembly backend with SIMD and multi-threading](https://blog.tensorflow.org/2020/09/supercharging-tensorflowjs-webassembly.html)
[^6]: [How Prime Video updates its app for more than 8,000 device types](https://www.amazon.science/blog/how-prime-video-updates-its-app-for-more-than-8-000-device-types)
[^7]: [The State of WebAssembly 2022](https://blog.scottlogic.com/2022/06/20/state-of-wasm-2022.html)
