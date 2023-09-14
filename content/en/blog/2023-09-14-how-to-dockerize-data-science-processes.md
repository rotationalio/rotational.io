---
title: "How to Dockerize Python Data Science Processes"
slug: "how-to-dockerize-data-science-processes"
date: "2023-09-14T11:52:15-05:00"
draft: false
image: img/blog/2023-09-14-dockerize-data-science/container.webp
photo_credit: "Photo by Venti Views on Unsplash"
author: Benjamin Bengfort
profile: img/team/benjamin-bengfort.png
tags: ["Docker", "Data Science", "Python"]
description: "Docker is a useful tool for containerizing long running jobs and services but most devops tutorials focus on web apps and microservices. Data scientists need containers that have a different set of scientific and numeric computing dependencies for data transformations, ETLs, inferencing, and other statistical analysis. This post contains a Python Dockerfile that you can use as a reference for creating your own data science Dockerfile processes and commands."
---

Docker containers are an incredibly useful mechanism for deploying long running applications and services on Kubernetes clusters. Unfortunately most tutorials focus on web applications and microservices whereas data scientists are thinking about long running processes that perform data transformations (ETLs), make inferences, or other jobs that require a different set of dependencies than web development does. In this post, we'll discuss the best way to create Python based Docker containers for data science purposes.

<!--more-->

But before we get any further, if you're using this as a reference to get a Python `Dockerfile`, here is the code snippet you're looking for:

```dockerfile

```

Note that we routinely update this Dockerfile for best practices as we learn them. If you would like to comment on the code or otherwise edit it, you can find the [Dockerfile on this gist]().

## Docker for Data Science