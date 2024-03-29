---
title: "Spooky `asyncio` Errors and How to Fix Them"
slug: "spooky-asyncio-errors-and-how-to-fix-them"
date: "2023-10-13T10:44:23-05:00"
draft: false
image: img/blog/laptop.jpg
photo_credit: "Photo by Philipp Katzenberger on Unsplash"
authors: ['Patrick Deziel']
profile: img/team/patrick-deziel.png
tags: ["Python", "Asynchronous", "Developer"]
description: "asyncio is a handy native Python library for coroutine-based concurrency. Here are some common errors you will encounter and how to fix them."
---

You've heard the `asyncio` library unlocks concurrency for Python with minimal syntactical overhead, but the terminology makes you tremble! Don't panic &mdash; here are 3 of the most common errors you will encounter and how to fix them.

<!--more-->

The most common errors you'll when you start using the Python `asyncio` library are:

1. [RuntimeWarning: coroutine was never awaited]({{< relref "2023-10-13-spooky-asyncio-errors-and-how-to-fix-them.md#runtimewarning-coroutine-was-never-awaited" >}})
2. [My coroutine doesn't run]({{< relref "2023-10-13-spooky-asyncio-errors-and-how-to-fix-them.md#my-coroutine-doesnt-run" >}})
3. [Task exception was never retrieved]({{< relref "2023-10-13-spooky-asyncio-errors-and-how-to-fix-them.md#task-exception-was-never-retrieved" >}})

Here's what those errors mean and how to fix your code.

## RuntimeWarning: coroutine was never awaited

This is the most common problem you will encounter and the easiest to fix. Consider the following program.

```python
async def do_something_asynchronously():
    return "Boo!"

if __name__ == "__main__":
    print(do_something_asynchronously())
```

`do_something_asynchronously` is supposed to return `Boo!`. However, if we try to run the code we'll just see:

```
<coroutine object do_something at 0x1021f2260>
RuntimeWarning: coroutine 'do_something_asynchronously' was never awaited
```

To understand what's going on, let's compare `do_something_asynchronously` to its synchronous alternative.

```python
def do_something_synchronously():
    return "Mwahahaha!"

if __name__ == "__main__":
    print(do_something_synchronously())
```

```
Mwahahaha!
```

Notice that `do_something_synchronously()` returns the expected evil laughter, but `do_something_asynchronously()` returns a coroutine object. Coroutines can't be called like normal functions, they have to be _scheduled_ in the event loop. The `RuntimeWarning` is trying to tell you that it was never scheduled by `asyncio`. Without the warning, it might be difficult to tell if the function even executed.

### Fixing "RuntimeWarning: coroutine was never awaited"

If `do_something_asynchronously()` is the entry point to your asynchronous code, use `asyncio.run()`.

```python
import asyncio

if __name__ == "__main__":
    asyncio.run(do_something_asynchronously())
```

If it's being called by another async function, you need to `await` it.

```python
async def main():
    await do_something_asynchronously()
```

## My coroutine doesn't run

This can be a tricky one because there's no error but your code doesn't run, or does not finish properly. For example, this program just exits immediately.

```python
import asyncio

async def hello():
    await asyncio.sleep(1)
    print("Hello")

async def world():
    await asyncio.sleep(2)
    print("World")

async def do_hello():
    asyncio.create_task(hello())
    asyncio.create_task(world())

if __name__ == "__main__":
    asyncio.run(do_hello())
```

Here `do_hello` schedules two concurrent tasks with `asyncio.create_task()`. The problem is that `asyncio.create_task()` doesn't wait for the tasks to complete. Instead, `do_hello` returns after scheduling the tasks. Once the event loop exits, it doesn't care that `hello` and `world` are not completed.

### Fixing non-running coroutines

The fix is to capture the references to the tasks so we have something to await on. You can use `asyncio.wait` to wait for multiple tasks at once.

```python
async def do_hello():
    hello_task = asyncio.create_task(hello())
    world_task = asyncio.create_task(world())
    await asyncio.wait([hello_task, world_task])
```

## Task exception was never retrieved

In this example we are scheduling some concurrent tasks using `asyncio.create_task()` and waiting for them to complete. However, one of the tasks will raise an exception.

```python
import asyncio

async def divide(a, b):
    return a / b

async def do_math():
    task_a = asyncio.create_task(divide(4, 2))
    task_b = asyncio.create_task(divide(4, 0))
    await asyncio.wait([task_a, task_b])

if __name__ == "__main__":
    asyncio.run(do_math())
```

If we run this code we see the exception but we also get a separate error:

```
Task exception was never retrieved
future: <Task finished name='Task-3' coro=<divide() done, defined at async.py:3> exception=ZeroDivisionError('division by zero')>
Traceback (most recent call last):
  File "async.py", line 4, in divide
    return a / b
ZeroDivisionError: division by zero
```

If we inspect the error we see that the task [Future](https://docs.python.org/3/library/asyncio-future.html) is finished and has an exception on it. This may be confusing because in synchronous land we expect exceptions to bubble up naturally, from `divide` to `do_math` etc. However in async land multiple tasks are running concurrently in the event loop, so task exceptions must be retrieved by reference. The cause of the problem is that `wait` actually returns the completed tasks but because we're not capturing the references the exceptions go uncaught.

### Fixing "Task exception was never retrieved"

The easiest way to handle running multiple tasks is to use `asyncio.gather`. It gathers multiple tasks into one `Future` that you can `await` on. By default it will return immediately when the first exception is raised by a task. This allows you to catch exceptions more gracefully.

```python
async def do_math():
    tasks = asyncio.gather(divide(4, 2), divide(4, 0))
    try:
        await tasks
    except ZeroDivisionError as e:
        print("Caught exception: {}".format(e))
```

If you want tasks to run regardless of exceptions, you can specify `return_exceptions=True` to return the results or exceptions as a list.

```python
async def do_math():
    tasks = asyncio.gather(divide(4, 2), divide(4, 0), return_exceptions=True)
    results = await tasks
    print(results)
```

```
[2.0, ZeroDivisionError('division by zero')]
```

If you still want to use `asyncio.wait`, you can capture the completed tasks and read the results or exceptions manually.

```python
async def do_math():
    task_a = asyncio.create_task(divide(4, 2))
    task_b = asyncio.create_task(divide(4, 0))
    done, _ = await asyncio.wait([task_a, task_b])
    for task in done:
        if task.exception():
            raise task.exception()
        else:
            print(task.result())
```

## Conclusion

Asynchronous programming tends to be out of the comfort zone of many Python programmers, but it doesn't have to be scary! Learning how to approach data processing and modeling using concurrency and parallelism can mean the difference between doing toy analytics and deploying models to production. If you're thinking about diving into asynchronous data science, I hope this post encourages you to push past the errors so that you can build more effective real-world solutions.

Want to learn more? Check out this webinar on getting started with async data science:

<iframe width="560" height="315" src="https://www.youtube.com/embed/WEkAYExL10Q?si=EEWkUwY5FeHqxmlA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>