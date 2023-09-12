---
title: "{{ replaceRE "^[-0-9]{10}-" "" .Name | replaceRE "-" " " | title }}"
slug: "{{ replaceRE "^[-0-9]{10}-" "" .Name }}"
date: "{{ .Date }}"
draft: false
image: img/blog/
photo_credit: "Add Photo Credits Here"
author: Your Name
profile: img/team/your-name.png
tags: "Add Tags Here"
description: "Add Description Here"
---

Add description or snippet here.

<!--more-->

Time to write the post!