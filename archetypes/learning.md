---
title: "{{ replaceRE "^[-0-9]{10}-" "" .Name | replaceRE "-" " " | title }}"
slug: "{{ replaceRE "^[-0-9]{10}-" "" .Name }}"
draft: false
event_date: "YYYY-MM-DD" (Include the time, "YYYY-MM-DDT13:00:00-05:00", if the event will happen in the future and would like to display a registration button.)
image: "img/resources/event-image.png"
name: "Write the name or title of the event"
description: "Write the event's description"
events: ['Podcast', 'Webinar', 'Conference Talk']
registration_link: https://link-to-register-for-event.com
call_to_action: "Write call to action for upcoming event"
video_link: youtube.com/link-to-video (If using YouTube, use the embed URL listed after src.)
audio_link: https://link-to-audio-source.com
categories: ['Video', 'Audio']
presenters: ['Presenter Name 1', 'Presenter Name 2']
topics: ['Add Topic 1 Here', 'Add Topic 2 Here']
photo_credit: "Add photo credit"
---