---
title: "{{ replaceRE "^[-0-9]{10}-" "" .Name | replaceRE "-" " " | title }}"
slug: "{{ replaceRE "^[-0-9]{10}-" "" .Name }}"
draft: false
event_date: "Write the date of the event"
image: "event-image.png"
name: "Write the name or title of the event"
description: "Write the event's description"
events: ['Podcast', 'Webinar', 'Conference Talk']
event_link: "Add link to the resource"
categories: ['Video', 'Audio']
presenters: ['Presenter Name 1', 'Presenter Name 2']
topics: ['Add Topic 1 Here', 'Add Topic 2 Here']
---