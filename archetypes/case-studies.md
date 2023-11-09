---
title: "{{ replaceRE "^[-0-9]{10}-" "" .Name | replaceRE "-" " " | title }}"
slug: "{{ replaceRE "^[-0-9]{10}-" "" .Name }}"
noicon: true
description: Briefly introduce the client's problem and solution here
problem: "Describe client's problem here"
approach: "Describe Rotational's approach to solve client's problem"
result: "Describe result after providing solution to client's problem"
stat: "Add a numerical stat about the case study here. (Ex. 85%)"
stat_text: "Add text to be included with the numerical stat" 
icon: "Add Font Awesome icon here. Icons may be found at the following site: https://fontawesome.com/v4/icons/"
---