---
title: "3 Trends that Will Disrupt Managed Services in 2023"
slug: "disrupt-managed-services"
date: "2022-12-23T11:43:15-05:00"
draft: false
image: img/blog/dandelion.jpg
author: Rebecca Bilbro
tags: "Managed Services"
photo_credit: Photo by unbekannt270 from Flickr
description: "In this post, we introduce three trends that are poised to disrupt managed service offerings in 2023 and beyond."
profile: img/team/rebecca-bilbro.png
---

If nothing else, the last year has brought the winds of change to the tech sector. From high-visibility [layoff cycles](https://layoffs.fyi/) at FAANGs and crypto companies, to turbulence in our [social media infrastructure](https://rotational.io/blog/twitter-wont-disappear-overnight/), to pop culture's discovery of deep learning products like AI art and ChatGPT.

But many of us in tech are beginning to sense even bigger, deeper rumblings that suggest some fundamental changes afoot for commercial cloud and managed services. In this post, we'll explore three: (1) native observability, (2) cost-effective scaling, and (3) self-orchestration.

<!--more-->

## Observability

In 2022 the Rotational team had [the privilege to attend a number of tech conferences](https://rotational.io/blog/october-retreats-and-conferences/), and one of the most prevalent themes by far was observability.

Observability (aka "o11y") refers to the engineering practices and tools that enable infrastructure teams to understand application performance and failure in real time. *Note: whether you're brand new to the term or a seasoned observability pro, we recommend checking out [o11ycast](https://www.heavybit.com/library/podcasts/o11ycast), a podcast by Charity Majors, Liz Fong-Jones, and Jessica Kerr for the latest observability news and insights.*

At [Pycon 2022](https://us.pycon.org/2022/schedule/talks/), Bianca Rosa spoke about ["Observability-Driven Development"](https://youtu.be/lxyrmsxY2KA). Many talks at [GopherCon](https://www.gophercon.com/agenda) featured dashboards built with Grafana and Prometheus metrics, including Donia Chaiehloudj's talk on ["Getting the Upper Hen"](https://youtu.be/D46NzhBoQC0). At KubeCon, the exhibit hall was filled with conference sponsors offering new tools to help solve the [tough problem of distributed tracing](https://youtu.be/Q5Vf8bpTDlI). And though many of us have rapidly become dependent on tools like Grafana and Prometheus, it's not clear which types of commercial solutions will take off.

One thing's for sure though; no one is much of a fan of the standard consoles provided by the big cloud providers. Not only are their interfaces crowded and confusing, the data they provide (while it can assist with diagnostics) is not conducive to deeper analysis, and their automated alerting tools are much too prone to false positives to be of much help.

As our expectations as consumers increasingly include the ability to see inside the black box of our node operations, managed services will likely begin to provide more native observability features.

## Cost-Effective Scaling

Those of us who build in the cloud tend to fall into one of two camps -- either you're a diehard fan of one of the big cloud providers or you're a pure Kubernetes oddball who is still attempting to resist the lure of a fully managed option. Those in the first camp are willing to suffer vendor lock-in in exchange for convenience, and those in the second camp are willing to write and manage a lot of hand-crafted artisanal yaml in exchange for cool points.

All jokes aside, there is some question about whether or not there is a real value in striving for cloud agnosticism. Over the last few years, some have argued that [multicloud is actually an antipattern](https://www.lastweekinaws.com/blog/multi-cloud-is-the-worst-practice/) and that [using Kubernetes doesn't guarantee cloud portability](https://medium.com/digital-mckinsey/does-kubernetes-really-give-you-multicloud-portability-476270a0acc7).

For scrappy teams hunkering down to survive a possible recession (and even big companies managing rising operational and COGS budgets), balancing between cost savings and the ability to serve a global userbase will likely lead many to consider alternatives to first-gen managed service offerings.

With [Akamai's recent acquisition of Linode](https://www.akamai.com/newsroom/press-release/akamai-completes-acquisition-of-linode), we at Rotational have made the decision to switch some of our deployed services over to Linode. It's not only a developer-friendly platform that's now nearly as global as the "Big Cloud" providers, it's also way more cost effective. Early on, we decided to go for a "cloud native, cloud agnosticism" approach, and thanks to that, we have been able to make the switch pretty easily, and pass on those savings to our customers.


## Self-Orchestration

Last but not least, 2022 was a year for appreciating how hard being a devOps engineer *really* is (we especially enjoyed [Forrest Brazeal's song about devOps re-org fatigue](https://twitter.com/forrestbrazeal/status/1577298602371809281?lang=en)). From hot takes that "devOps is dead" to blog posts about the [rise of platform engineering](https://www.honeycomb.io/blog/future-ops-platform-engineering), it's clear that there is still very little consensus about how best to delegate the deployment and maintenance of applications as those applications become more and more complex.

Fortunately, if our experiences at GopherCon and KubeCon are any indication, there is help on the way. We saw a lot of new tools emerging for things like observability, gitOps, and enterprise Kubernetes management.

We predict that 2023 will be the year when infrastructure and operations engineers start to get to play a bigger role in the *design* of new products, rather than being consulted only when it comes time to productionalize a feature. As Ops folks are increasingly able to influence the [development of requirements](https://oschvr.com/posts/what-id-like-as-sre/) at the onset of a new project, deployment and maintenance is sure to become less of a pain point.

But devOps and platform engineers are busy! So in order to free up some mental bandwidth for the Ops folks, we also expect to see a new trend emerge: self-orchestration. Whereas the current *status quo* for orchestration is at best a series of sophisticated heuristics and templating systems, we at Rotational believe that there are even better support tools coming powered by new consensus algorithms and machine learning models.


## Conclusion

> If we do not find anything pleasant, at least we shall find something new. - Candide (Voltaire)

It has been a tough year for many, and we send out our sympathies to our tech sisters, brothers, and siblings who lost jobs and teammates. It was also a year that brought signals of more wide-reaching changes to the world's tech services, all of which suggest that there are more disruptions coming and new challenges and problems for us to work together to solve in 2023 and beyond.

Want early access to a platform and community for developers building event-driven applications? Check out our [free beta of Ensign](https://rotational.app/register/).