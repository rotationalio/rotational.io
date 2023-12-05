---
title: "{{ replaceRE "^[-0-9]{10}-" "" .Name | replaceRE "-" " " | title }}"
slug: "{{ replaceRE "^[-0-9]{10}-" "" .Name }}"
draft: false
date: "Date of the Event"
title: "Write the event's title"
description: "Write the event's description"
events: ['Podcast', 'Webinar', 'Conference Talk']
event_link: "Add link to watch or listen to the event"
categories: ['Video', 'Audio']
presenters: ['Presenter Name 1', 'Presenter Name 2']
topics: ['Add Topic 1 Here', 'Add Topic 2 Here']
---