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
description: "Docker is good for containerizing jobs and services, but most tutorials focus on web apps and microservices. This post is for data scientists! It contains a Python Dockerfile to use as a reference when creating your containers with scientific and numeric computing dependencies for data transformations, ETLs, inferencing, and other statistical analyses."
---

Docker is great, but most tutorials are geared toward devOps users, not data scientists. If you're building long-running processes for NLP, ML, or generative AI, here's a blueprint for Python Docker containers for data science!

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
RUN pip3 install --no-cache-dir wheel
RUN pip3 install --no-cache-dir -r /requirements.txt

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

Docker containers are lightweight, infrastructure-agnostic, standalone, executable packages (images) that include everything needed to run a piece of software including the code, runtime, libraries, and dependencies. Containers are a form of virtualization technology that ensure code can be run in an isolated environment so that dependencies and operating system considerations can be abstracted away such that multiple applications can run in isolated environments on the same hardware.

Because of these properties, containers are an easy and flexible way to deploy and run applications on a compute cluster, particularly Kubernetes clusters. Note that Docker and and Kubernetes are not the only containerization techologies that exist, but are the most popular at the time of this writing.

For data scientists, containers can be used to:

1. Periodically ingest data from external data sources
2. Run data transformation jobs and ETLs
3. Synchronize databases and datasets
4. Scale model training and hyperparameter tuning
5. Create inferencing services for machine learning models

The defining characteristic of these types of jobs? They probably need to be run in a production location outside of a Jupyter notebook!

### Scheduled Jobs

Consider the following Python program in `main.py` that runs a series of jobs at a pre-defined schedule using the [schedule](https://schedule.readthedocs.io/en/stable/) library:

```python
import time
import schedule

from myapp import report, ingest, health_check


def main():
  schedule.every().hour.do(ingest)
  schedule.every(5).minutes.do(health_check)
  schedule.every().day.at("9:15", "America/New_York").do(report)

  while True:
    schedule.run_pending()
    time.sleep(15)


if __name__ == "__main__":
  main()
```

This script is a long-running process that every 15 seconds checks to see if one of the scheduled jobs should be run. The example shows that data should be ingested every hour, a health check run every 5 minutes, and a report run every day at 9:15am ET. A long running task like this is meant to be run forever on a stable computer and restarted when it fails -- Docker containers make it easy to deploy these types of processes.

**NOTE:** This script is an example only; there are many ways to schedule jobs to be executed using Docker containers, such as [`CronJob`](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/) on a Kubernetes cluster.

### Challenges

The primary issue with data science code and Docker containers is compiling and building scientific and numeric computing dependencies. Most of the `scipy` and `numpy` based tools that we use have CPython dependencies that depend on the presence of a C compiler and `libpython`. Machine learning libraries have dependencies on other C libraries such as `libsvm` and `libblas` or `lapack` for linear algebra computation.

The good news is that Docker containers allow for reusability and operating-system agnostic compilation. If your team is having trouble installing dependencies then Docker containers can be a good way to share code for development. The bad news is that you have to figure out how to create a container that supports these dependencies, and that is where this blog post comes in!

## Dockerfile, Step-By-Step

In this section, I'll go over how we made the choices for our `Dockerfile` and discuss ways that you can adapt the above `Dockerfile` to your specific usage.

**1. Base Image**

```Dockerfile
FROM python:3.11-slim
```

The base image we selected was `python:3.11-slim`. When selecting a base image there is a trade-off between how much setup work is done for you and the size of the final image. Smaller image sizes are generally better because images often have to be stored in the cloud (which has volume based processing) and smaller images are generally loaded and run more quickly.

The `python:3.11-slim` image is a Debian-based image, which allows us to use `apt-get` commands to install the C dependencies we need, but the `slim` version keeps it lightweight. This image also already has Python installed, which reduces the amount of work we need to do. You can change the [version of Python used in the image](https://hub.docker.com/_/python), but we recommend using `slim` or a Debian-specific variant of slim such as `bookworm-slim`.

**2. Environment**

```Dockerfile
# Do not prompt during apt-get commands
ARG DEBIAN_FRONTEND=noninteractive

# Ensure output to stdout and stderr are written to the terminal without a buffer
ENV PYTHONUNBUFFERED 1
```

I try to put [build arguments](https://docs.docker.com/build/guide/build-args/) and environment variables at the top of Dockerfiles since they influence not just the runtime but also the buildtime of the Docker container.

The `DEBIAN_FRONTEND` variable ensures that we are not prompted to continue when using `apt-get` commands; though this can also be achieved with the `--yes` flag.

The `PYTHONUNBUFFERED` environment variable ensures that Python writes directly to `stdout` and `stderr` without buffering the output in memory. Buffers are usually good idea for environments where multiple processes are running and to ensure efficiencies of writes. However, Docker containers are isolated and immediately writing ensures that no output is lost when a container crashes or restarts.

**3. Install external, non-Python dependencies**

```Dockerfile
# Add library dependencies for compiling data science python packages
RUN apt-get update && \\
    apt-get install --no-install-recommends -y gcc libc-dev build-essential python3-dev
```

This is the section where we can install the C dependencies we need to compile our code effectively. I've included some basic dependencies but you can add others here as necessary. For example, if you'll be compiling `psycopg2` for PostgreSQL database access, you will likely want to add `libpq` to the list of dependencies.

Note that this step has to be run as root so don't switch to a different user before executing this step!

**4. Don't run as root**

```Dockerfile
# Create a user so that we don't run as root
RUN groupadd -r myuser && useradd -m -r -g myuser myuser
USER myuser

# Set the working directory where Python code will be stored
RUN mkdir /home/myuser/app
WORKDIR /home/myuser/app
```

For security purposes, you should avoid running your Python applications as the root user, following the [principle of least privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege). This will make your production environments much safer since an attack on your program cannot leak to the outside host.

In this snippet we're creating a user and group called `myuser` (which you can change to whatever makes sense for your app) and creating our workspace in that user's home directory in a subdirectory called `app`.

**5. Install Python dependencies**

```Dockerfile
# Install Python dependencies
COPY ./requirements.txt /requirements.txt
RUN pip3 install --no-cache-dir wheel
RUN pip3 install --no-cache-dir -r /requirements.txt
```

The next step is to install the dependencies from our `requirements.txt` file. First we install the [`wheel` package](https://realpython.com/python-wheels/) to ensure that we simplify and speed up the installation of our dependencies that were distributed with wheels. Note that we use the `--no-cache-dir` directive here to ensure that we do not save the downloaded packages locally, thus reducing the size of our Python image.

**6. Cleanup installation**

```Dockerfile
# Switch back to root to clean up after the build process
USER root
RUN apt-get clean autoclean && apt-get autoremove --yes && \\
    rm -rf /var/lib/apt/lists/*
```

Now that we're done installing and compiling our Python resources, we can clean up our Debian environment, again to reduce our image size as much as possible. These `apt-get` commands need to be run s root, so we will briefly switch back to the `root` user before continuing with the user we created.

**7. Finalize Build**

```Dockerfile
# Switch back to non-root user and copy Python code
USER myuser
COPY ./ ./

# Default command is a python3 interpreter
CMD ["python3"]
```

The last step is to switch back to our local user and to copy all of our Python files and modules from our project. This `Dockerfile` has a default command of running a Python interpreter, which is good for development, but you probably want to change your `CMD` to something more specific for your long running process.

## FAQ

Some common questions that I've received will be added to this section. If you have a question, please don't hesitate to [contact us]({{< ref "contact" >}}) and we'll add your question to the FAQ!

### Why not use multi-stage builds?

[Multi-stage builds](https://docs.docker.com/build/building/multi-stage/) are another technique to optimize Dockerfiles and reduce image size. They allow you add build-time dependencies that are not present in the final image.

We could create a Python multi-stage image where we use a build step to install everything into a virtual environment, then copy the virtual environment into our final step. However, many data science dependencies that require C compilation load shared objects at runtime from linked-libraries. Since these shared objects would have to be copied as well, we stuck with a single stage build.