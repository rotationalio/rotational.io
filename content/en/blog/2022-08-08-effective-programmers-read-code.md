---
title: "Effective Programmers Read Code"
slug: "effective-programmers-read-code"
date: "2022-08-08T08:10:14-04:00"
draft: false
image_webp: images/blog/blazes.webp
image: images/blog/blazes.jpg
author: Benjamin Bengfort
description: "While we often think ourselves as authors of code we probably spend more time reading code than writing it. Changing our mindset to think of ourselves as avid code readers will make us more effective programmers."
---

As programmers, we tend think of ourselves as *authors* of code, but our daily engineering practice probably requires us to spend more time reading code than writing it. Perhaps this is even a source of stress for you. Changing your mindset to think of yourself as an avid code *reader* may not only alleviate this anxiety, but also make you a more effective programmer, capable of architecting complex mental maps of code, a technique I refer to as "building the glass castle".

<!--more-->

The operations and jumps described by source code create complex interactions that define the dynamics of our software systems. When we write code, we attempt to elucidate these complexities for two audiences: the execution runtime the code will operate in, and other programmers who will use or maintain the code &mdash; including future you.

Most discussions about how to write good code focus on just one of these audiences, but in practice there is much more middle ground between the two. Both the runtime and the reader have to step through code line by line, interpreting it, and possibly jumping to other locations in the codebase to understand the next step.

The only difference between the runtime and the reader is that the runtime handles a long sequence of instructions, while the reader builds a mental abstraction of those interactions. As we program, we build this abstraction in our heads incrementally, and we must mentally hold it in its entirety as we proceed through our task. Because of the fragility of the model (even a minor distraction can bring it crashing down), I refer to it as the "glass castle".[^1]

For me, the glass castle is both a structure and a map.[^2] I hold individually named components in mental space in a way that organizes related components near one another. The components are linked with mental threads based on their interactions: e.g. calling a method or function of another component or instantiating and referencing an object. When I mentally zoom into a component, I find it is itself made up of smaller components that interact with each other. As I code, I mentally zoom in and out of the model, getting more detail when I need it and encapsulating and summarizing when I don't.

The primary purpose of the glass castle is to ensure that we can quickly locate related code in the codebase and understand the consequences of making changes to the code. It does serve another purpose, however; like [code "smells"](https://martinfowler.com/bliki/CodeSmell.html), I use the glass castle to understand when there is a structural or architectural problem with the system. For example, when I zoom into a component and see that there are too many external interactions with subcomponents, it's an indication that the parent component is not correctly abstracted. This is very similar to the idea of ["wide vs deep" modules](https://nakabonne.dev/posts/depth-of-module/) described in Ousterhout's [_A Philosophy of Software Design_](https://web.stanford.edu/~ouster/cgi-bin/book.php). The best use of the glass castle is to determine when the system is "tipping over" as we add features or make changes, because it may lead us to refactoring or addressing the initial design that wasn't quite right for the current iteration of software.

The glass castle is essential to our code-writing process at Rotational, which must embrace the complexities inherent to building distributed systems without producing code that is unnecessarily complicated. Recently, I've started to pay more attention to how I construct the glass castle. When I sit down to implement a feature or make a change, the very first thing I do is identify candidate locations in the code where the change needs to be made. These locations are identified in a top-down fashion: I look at the organization of the code and quickly scan through package and module names as well as package documentation.

Once I find the candidate locations, I continue in a bottom-up fashion by identifying the functional dependencies surrounding the location and putting together components and interactions tagged with the input and output data contracts that they make. Often, I have to read the code of the external dependencies of the project to figure out the best possible solutions. I continue grouping, linking, and encapsulating code in my head until I feel like I have enough of a picture that I'm confident in the change I'm about to make.

Before I've written even a single line of code, I've already read hundreds of lines of code. The more complex the change or system (or, the longer I've been away from the system before making a change), the more time I have to spend reading code before writing it. It's through situations like these that I've come to realize, as a programmer, I spend far more time reading code than writing it.[^3]

My students often ask me how to become a better programmer, and my answer has always been "read code, particularly good code, and you'll become a better programmer". The theory was similar to other forms of writing &mdash; as an author, the more you read, the better you'll write &mdash; and there are tons of resources for excellent open source code. More importantly, I noticed that my students would ignore blocks of code to quickly get to writing code and, more often than not, those ignored blocks were where the problems came from. What I understand now is that it's not just practice, or a way to become better or avoid bugs. Instead, reading code is the most essential part of our job as programmers.

The more code we read, the quicker and more effective we are at building the glass castle, and the better the code is that we will write. To become effective authors of good code, we should be first avid readers of good code.

#### P.S. Tips for Readers of Code

Reading code must be a practice that we focus on in order to prepare ourselves for success.

1. _Ensure you have long periods of uninterrupted development time._ Give yourself as much time with the glass castle as possible. At Rotational, we try to schedule all of our meetings for Tuesdays and Thursdays to leave Monday and Wednesday for deep work.
2. _Create shortcuts to build the glass castle faster._ If you can create mental checkpoints, notes to yourself, or other mnemonics, you will avoid treading the same path over and over again.
3. _Diversify the code you are reading._ Don't just read the code that you or your colleagues wrote, or even stick to code in the language you're working in. There is a huge number of excellent open source projects that you can read; make this practice part of your continuous learning strategy.
4. _Glass castle before code review._ The glass castle strategy isn't just about implementing code, it's also about reviewing code.
5. _Read code to write documentation._ It is difficult to make documentation part of the definition of done of a task. Instead create tasks for documentation that allow you to re-read code from a user or test developers perspective.

#### P.P.S. Writing for Those Who Read Code

We started this essay by discussing the two audiences for code: the runtime and the reader. The runtime is the execution environment of the code including the compiler or the interpreter, other code that imports or loads your code, and the operating system that runs your code in a process. The reader is other programmers: users of your code as a module, developers who are writing tests for your code, maintainers who deploy code, fix bugs and improve performance, and "future you" who has the expertise to understand the "what", "how", and "why" of the source code.

The first and most important notion is that these audiences are, themselves, dynamic. The more time that passes from the original implementation of the source code, the more differentiated the runtime and the reader become. We should write code to ensure longevity of executability and understandability.

When it comes to writing code, we certainly should not only focus on or prioritize execution performance if it sacrifices readability. Self documenting code is absolutely something to strive for. On the other hand, some clean coders who comment in excess have probably have taken this to an extreme. Obtuse code serves no one, not future readers and not compilers. Verbose comments that repeat the code make it harder to build the glass castle. Instead, use comments to create markers or way points that help guide the reader to other pieces of important or related code, or places that serve to build the glass castle more efficiently.

Documentation is essential and should give us a high level overview of what the code should do. The best documentation gives us entry points into the code so that we can understand it further, but doesn't go so far that it prevents you from engaging with the code itself. Ensure that all packages, structs, methods, and functions are correctly documented with doc strings and that all are reachable from the map that the documentation describes.

***

Photo by [Nicholas_T](https://www.flickr.com/photos/nicholas_t/) via [Flickr Commons](https://flic.kr/p/NFnpAu)

***


[^1]: My inspiration for the term "glass castle" comes from the ["mind palace"](https://www.smithsonianmag.com/arts-culture/secrets-sherlocks-mind-palace-180949567/) portrayed by Benedict Cumberbach as Sherlock Holmes in BBC's _Sherlock_ (2010). Sherlock uses the mind palace as a memory technique where memories are linked to objects arranged in specific places in the palace. I thought "palace" was a little too grandiose for what I did so I changed it to castle and modified it with "glass" to imply the fragility of the mental abstraction while programming. I suppose "mind glass castle" would be the full term but that was a little unwieldy.

[^2]: My experience of the glass castle is as a graph or molecular structure which I can "see" in my mind. In fact, sight is the best way to describe my interaction with the castle, sort of like how "reading" (instead of "hearing") is the best way to describe how I consume an audiobook. It's a bit hard to describe what I see, just as it would be hard to describe a dream, and people's sensory experiences are unique. I think the important note here is that as you program, you should be mentally interacting with this model in a way that feels right to you, e.g. is it "movement", "tartness", or "touch" for you?

[^3]: And that is before code reviews!