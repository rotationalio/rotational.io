---
title: "Introducing Whisper"
slug: "introducing-whisper"
date: 2021-10-01T16:32:47-04:00
draft: false
image: img/blog/whispering_wheat.jpg
author: Edwin Schmierer
category: Security
description: "Shhh..there's a better way to share secrets. Introducing Whisper, our secret-sharing utility."
profile: img/team/edwin-schmierer.png
---

Imagine you have a new engineer joining your team and you need to provide passwords for access to critical systems. Or you need to send a sensitive file to a client. Or you need to share encryption keys with a team member. What do you do?

<!--more-->

You might text a password or key (hopefully using [Signal](https://signal.org/en/) since it uses end-to-end encryption), but that won't work for lengthy keys, files, or large docs. You might write it on a piece of paper or place it on a thumb drive, but both are limited by proximity, which frankly doesn't work too well when remote work has become the norm. Or you might email it but that exposes several security risks. What if the recipient forwards it or is hacked or never deletes the message so it remains indefinitely in their inbox? How secure is email, really? If you're using a popular free email service, the Terms of Service may give the provider limited permissions to access your data.

## Whisper: A Secret-Sharing Utility

We encounter these issues at Rotational everyday, so we created a secret-sharing utility called [Whisper](https://whisper.rotational.dev/). As a remote and global-first team by design, Whisper demonstrates our desire at Rotational Labs to build collaboration tools with security-first principles in mind. Users can securely share and control access to confidential information such as passwords, documents, config files, keys, and certificates across an organization. Senders can limit access attempts, set an expiration time (e.g. 5 minutes to 7 days), and/ or require a password to access the secret while recipients can destroy secrets once accessed.

Whisper leverages [Google Secret Manager](https://cloud.google.com/secret-manager) to provide a convenient interface for the kinds of secure information transfer use cases we routinely encounter. These use cases include onboarding new employees, sharing data with clients and vendors, and securing internal communications on engineering teams.

We've [open-sourced Whisper](https://github.com/rotationalio/whisper), meaning you can check it out to ensure it satisfies your organization's protocols, or even create your own implementation. Alternatively, Rotational offers low-cost hosting solutions.

Stay tuned for an upcoming post about the technical details under the hood. For now, please try [Whisper](https://whisper.rotational.dev/) and send feedback to [info@rotational.io](mailto:info@rotational.io).

---

Photo by <a href="https://unsplash.com/@kent_pilcher?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Kent Pilcher</a> on <a href="https://unsplash.com/s/photos/wind-blowing-on-wheat?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
