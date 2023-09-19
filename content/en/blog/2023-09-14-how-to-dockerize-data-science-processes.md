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

But before we get any further, if you're using this as a reference to get a Python `Dockerfile`, here are the code snippets you're looking for:

```dockerfile
FROM python:3.11-slim

# Do not prompt during apt-get commands
ARG DEBIAN_FRONTEND=noninteractive

# Ensure output to stdout and stderr are written to the terminal without a buffer
ENV PYTHONUNBUFFERED 1

# Add library dependencies for compiling data science python packages
RUN apt-get update && \\
    apt-get install --no-install-recommends -y gcc libc-dev build-essential python3-dev

# Create a user so that we don't run as root
RUN groupadd -r myuser && useradd -m -r -g myuser myuser
USER myuser

# Set the working directory where Python code will be stored
RUN mkdir /home/myuser/app
WORKDIR /home/myuser/app

# Install Python dependencies
COPY ./requirements.txt /requirements.txt
RUN pip3 install -r /requirements.txt

# Switch back to root to clean up after the build process
USER root
RUN apt-get clean autoclean && apt-get autoremove --yes && \\
    rm -rf /var/lib/apt/lists/*

# Switch back to non-root user and copy Python code
USER myuser
COPY ./ ./

# Default command is a python3 interpreter
CMD ["python3"]
```

By default, this Dockerfile will open a python interpreter when run, but you can run override the `CMD` by specifying a different command as an argument to `docker run`. For example, if you build this image and tag it as `myapp:latest` you could run your `main.py` file as follows:

```
$ docker run myapp:latest python3 main.py
```

Note that we routinely update this Dockerfile for best practices as we learn them. If you would like to comment on the code or otherwise edit it, you can find the [Dockerfile on this gist](https://gist.github.com/bbengfort/28a82540c4af38fe9d8aed56c913aebe).

### Docker Ignore

The `.dockerignore` file is an essential part of Python containerization because it reduces the number of files that are copied to the image, thus reducing the overall image size. In particular, it's a good idea to ignore the `.git` folder since the image will not contain `git` or run any `git` commands. An example `.dockerignore` file for Python data science applications is as follows:

```shell
# Ignore docker specific files
.dockerignore
docker-compose.yml
Dockerfile

# Ignore git directory and files
.gitignore
.git

# Ignore text files at the root of the project (optional)
LICENSE
README.md
DESCRIPTION.md
CONTRIBUTING.md
SECURITY.txt

# Ignore local environment and secrets
.python-version
.env
.env.template
.secret
```

### Docker Compose

Docker Compose is an excellent tool for running multi-container applications; for example if you have a database that you'd like to containerize to test locally. A `docker-compose.yml` file allows you to define services to build and run. Below is an example of a `docker-compose.yml` file that has a configuration for our app defined in the `Dockerfile` above.
```yaml
version: "3"

services:
  app:
    build:
      context: .
    volumes:
      - .:/home/myuser/app
    command: >
      sh -c "python3 main.py"
```

Note that this file runs the `python3 main.py` command in order to override the image command and also links a the local directory to the working directory of the app with the `volumes` directive. This linking allows changes in your local directory to be detected by the app if you have a reloader in your program such as with Flask or Django applications.

## Docker for Data Science