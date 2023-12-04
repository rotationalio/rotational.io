---
title: "{{ replaceRE "^[-0-9]{10}-" "" .Name | replaceRE "-" " " | title }}"
slug: "{{ replaceRE "^[-0-9]{10}-" "" .Name }}"
date: "{{ .Date }}"
draft: false
authors: ['Author Name 1', 'Author Name 2']
categories: ['Add Resource Category 1 Here', 'Add Resource Category 2 Here']
---