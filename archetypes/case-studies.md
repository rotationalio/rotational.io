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
    # If there should only be 1 bullet point in the Results box, delete one of the - result fields
    results:
      - result: Describe result here
      - result: Describe result here
    # - result: This is how to add an additional result field
real_results:
  tagline: Innovate or Stagnate
  title: Real Results
  description: Describe results in more detail here
  approach: "Describe Rotational's approach to solve client's problem"
  result: "Describe result after providing solution to client's problem"
---