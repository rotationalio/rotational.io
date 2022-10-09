---
title: "{{ replaceRE "^[-0-9]{10}-" "" .Name | replaceRE "-" " " | title }}"
slug: "{{ replaceRE "^[-0-9]{10}-" "" .Name }}"
date: "{{ .Date }}"
draft: true
image: img/blog/
author: Your Name
category: "Add Category Here"
photo_credit: "Add Photo Credits Here"
description: "Add Description Here"
---
