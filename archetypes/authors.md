---
title: "{{ replaceRE "^[-0-9]{10}-" "" .Name | replaceRE "-" " " | title }}"
name: "{{ replaceRE "^[-0-9]{10}-" "" .Name | replaceRE "-" " " | title }}"
slug: "{{ replaceRE "^[-0-9]{10}-" "" .Name }}"
profile: img/team/firstName-lastName.png
designation : Your Job Title
field: Your Specialty
# If you would like to not include any social media links, delete lines 8 - 17. 
# If you would like to not include a specific social media type, delete the "name", "link", and "icon"
social :
  - name : "linkedin"
    link: 'Add Link to Your LinkedIn Profile'
    icon: 'fa-linkedin-in'
  - name : "twitter"
    link : "Add Link to Your Twitter Profile"
    icon: 'fa-x-twitter'
  - name : "github"
    link: 'Add Link to Your GitHub Profile'
    icon: 'fa-github'
---

<!--Write a brief 1-2 sentence bio/personal description below-->