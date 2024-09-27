---
title: "{{ replaceRE "^[-0-9]{10}-" "" .Name | replaceRE "-" " " | title }}"
slug: "{{ replaceRE "^[-0-9]{10}-" "" .Name }}"
headertext: Case Studies
subheadertext: "Real Results: AI in Action"
industry: Add client's industry here
service: Add service type here
case:
  - title: Problem
    description: Describe problem here
  - title: Solution
    description: Describe solution here
  - title: Results
    results:
      - result: Describe result here
      - result: Describe result here
real_results:
  tagline: Innovate or Stagnate
  title: Real Results
  description: Describe results in more detail here
  approach: "Describe Rotational's approach to solve client's problem"
  result: "Describe result after providing solution to client's problem"
---