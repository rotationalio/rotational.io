---
title: "{{ replaceRE "^[-0-9]{10}-" "" .Name | replaceRE "-" " " | title }}"
slug: "{{ replaceRE "^[-0-9]{10}-" "" .Name }}"
date: "{{ .Date }}"
draft: true
image_webp: images/blog/
image: images/blog/
author: Your Name
description : "Add Description Here"
---