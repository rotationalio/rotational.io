---
title: "What Are Microfrontends?"
slug: "what-are-microfrontends"
date: "2023-05-23T13:24:42-04:00"
draft: false
image: img/blog/2023-05-29/puzzle-pieces.jpg
photo_credit: Photo by Hans-Peter Gauster via Unsplash
authors: Danielle Maxwell
profile: img/team/danielle-maxwell.png
tags: ['Frontend', 'Microfrontend']
description: "Micro-frontends could be the ideal solution if your monolithic frontend is causing growing pains."
---

Although micro-frontends are not new, they're gaining popularity in the frontend community. Never heard of micro-frontends before? Not quite sure what they are or if you should use them? Well, let’s talk all about it!
<!--more-->

## What’s this micro-frontend thing?
In 2016, Thoughtworks noted the emergence of micro-frontends within their teams as a way to deal with large and sprawling browser applications they found difficult to maintain.[^1] This new approach they discussed is an architecture style where a frontend’s codebase can be divided into smaller pieces or apps. The code is then later integrated together for a uniform experience for web users. Instead of having all of your frontend code in a monolith, it could be split up by pages or features.

If you’re wondering if this is like utilizing the microservices approach, you're right! Just as backend teams have run into issues maintaining monoliths and dealing with deployment bottlenecks, so too have frontend teams.

Would this allow teams to use different frontend frameworks?
Working with micro-frontends gives teams the flexibility to work with different tech stacks. So, yes, one app could be created with React while another uses Angular. However, it’s important to note that just because this *can* be done it doesn't necessarily mean that it *should*.


## How are micro-frontend apps integrated?
One of the main challenges of the micro-frontend architecture is determining how to integrate multiple apps to ensure a cohesive user experience online. Two options are build-time integration and run-time integration.

### Build-time Integration
With build-time integration, each app can be published to a package manager, like npm, and then installed into another app as a dependency. When using this approach, a container app can be used. The container would install all of the other apps as a dependency and then be deployed. Container apps determine when and where to show other apps and display common UI elements such as headers and footers. This may sound simple, but build-time integration will require the container app to update dependencies any time there’s a change and then it must be redeployed.

### Run-time Integration
Once sites are built, it is possible to use run-time integration to combine micro-frontends. With this integration type, there are a few different options to choose from.

First up, there’s server-side composition which puts micro-frontends inside of a view that's cached at the CDN level. Server-side composition can also be provided to the client at compile time. Next there's edge-side composition, which will combine a view at the CDN level that combines micro-frontends from the origin before providing to a client. [^2]

Finally, client-side composition is another option. It can also use a container app that is deployed separately like in build-time integration. However, with client-side composition, it is possible to use methods such as [Module Federation](https://webpack.js.org/concepts/module-federation/) (a Webpack plugin released in 2020), [import maps](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap), iframes (yes, the HTML element), or web components to combine the micro-frontends.

Integrating micro-frontends with client-side composition can take time and is more complex than build-time integration, but the container app would not need to regularly update/install dependencies once an app is changed. Additionally, it would not have to be deployed every time a change is made and this is more in line with the goals of using micro-frontends.

## Want to learn more about micro-frontends?
To learn even more about micro-frontends, I highly recommend checking out [single-spa](https://single-spa.js.org/). It’s a framework that may be used to bring together multiple JavaScript micro-frontends in a frontend application.[^3] Their documentation is a great resource for gaining more knowledge about the architecture. You can also check out a talk I gave at [React Miami](https://youtu.be/u6AIHM7ozQQ) that illustrates some of these same ideas.

*If you're looking to get into microservice architectures, check out [Ensign](https://rotational.app/register/), a platform and community for developers building event-driven apps.*


[^1]: [Micro frontends](https://www.thoughtworks.com/radar/techniques/micro-frontends)
[^2]: [Micro-frontends in context](https://increment.com/frontend/micro-frontends-in-context/)
[^3]: [Getting Started with single-spa](https://single-spa.js.org/docs/getting-started-overview)

Photo by [Hans-Peter Gauster](https://unsplash.com/@sloppyperfectionist?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/3y1zF4hIPCg)