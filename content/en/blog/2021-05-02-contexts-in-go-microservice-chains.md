---
title: "Contexts in Go Microservice Chains"
slug: "contexts-in-go-microservice-chains"
date: "2021-05-02T14:24:33-04:00"
draft: true
image_webp: images/blog/arboreal.webp
image: images/blog/arboreal.jpg
author: Benjamin Bengfort
description : "Contexts are a critical part of services implemented in Golang, but although we see them often in server interfaces they can be a bit mysterious to developers implementing request handlers. In this post we look at a specific example where contexts shine: handlers that have to call multiple internal microservices to serve their response."
---

Contexts are a critical part of services implemented in Golang, but although we see them often in server interfaces they can be a bit mysterious to developers implementing request handlers. In this post we'll take a look at a specific example where contexts shine: services that are implemented as a series of microservice requests. We'll start with the tl;dr of contexts - the two rules that service handlers should implement. We'll then discuss what contexts are, and finally demonstrate a quick experiment using gRPC that shows how context deadlines are propagated to downstream microservices during request processing.

The code for experiment can be found at: [github.com/rotationalio/ctxms](https://github.com/rotationalio/ctxms).

## Contexts in Service Handlers

If you've implemented a gRPC API you'll know that the RPC interface for a request handler is implemented with a function signature that looks something like:

```go
func (s *Server) MyRPC(ctx context.Context in *Request) (out *Reply, err error) {}
```

The first argument is always a `context.Context`, which if you're like me, you think of as "the thing with the deadline for the client". However, if you're also like me, 90% of the time you simply ignore it and implement the request handler without using that argument at all.

So what should you do with the context? There are two main rules:

1. If you implement a long running computation, you should run it in a go routine and `select` from either `ctx.Done()` or the result channel.
2. If you call a downstream contextual function, e.g. a database or a follow-on microservice, you should pass it the same context.

Let's take the first instance first: say you have some work to do that may take a long time. What's a good threshold? I think of frontier API responses as needing to be returned in a second or less; that means you get approximately 500ms for processing, reserving 250ms in either direction for network traffic; therefore "a long time" here is anything that may take more than 450ms, but your needs may vary. As a rule of thumb, I also think of database requests as taking around 20-50ms, so if you're composing transactions programatically and not in SQL - this is another estimation point. Of course different systems will have different response times, so it's always good to measure and know!

The client is likely going to set some kind of timeout on the request, e.g. it will wait 5 seconds before retrying or displaying a message to the user. What happens if the client timeout is exceeded while you're processing? Well the client is going to stop waiting for a response, but the server will continue handling the request - unless we can detect the deadline exceeded. This is where the context comes in.

Therefore we follow rule number one as follows: if you have a function `hardWork` - simply move it into a go routine and return the result in a channel:

```go
func asyncHardWork() <-chan result {
    done := make(chan result, 1)

    go func(done chan<- result) {
        done <- hardWork()
    }(done)


    return done
}
```

Then in your service handler, select either from `ctx.Done()` or the result channel as follows:

```go
select {
case <-ctx.Done():
    return nil, ctx.Err()
case result := <-asyncHardWork():
    return result, nil
}
```

In this code, if the client deadline is exceeded, then the error will be returned immediately and the request handler routine will stop. The asyncHardWork routine will continue until its finished, however, but if you have steps after `hardWork` they won't continue because the request has terminated early. Alternatively, you could create a contextual hard work - for example if `hardWork` is iterative, you could check if the context is done on every pass, using a default to ensure the select is non-blocking:

```go
func hardWork(ctx context.Context) (result, error) {
    for {
        // Check to ensure the context isn't canceled
        select {
        case: <-ctx.Done():
            return nil, ctx.Err()
        default:
            // Keep processing the for loop
        }

        // Computation here
    }

    return result
}
```

This brings us to rule 2: if the downstream function is contextual, e.g. accepts a context as a first argument; you should _always pass the same context to it_. This may seem a little unnatural; for example you may want to pass a shorter deadline to a database transaction, however you don't know how long the client context is - and it may have been passed to you from upstream processing that also took a long time; rely on the client to specify their context!

We can see this especially with database transactions:

```go
func (s *Server) MyRPC(ctx context.Context in *Request) (out *Reply, err error) {
    // Begin a database transaction assuming we have a global variable conn that is a
    // database connection pool -- pass in the same context.
    var tx *sql.Tx
    if tx, err = conn.BeginTx(ctx, nil); err != nil {
        return nil, status.Errorf(codes.FailedPrecondition, "could not start tx: %s", err)
    }
    defer tx.Rollback() // The rollback will be ignored if the tx has been committed later in the function.

    // Do transaction work here.
}
```

If the context is done, then any `tx` calls (e.g. `tx.Query()` or `tx.Commit()`) will return the deadline exceeded error, allowing the transaction to stop processing and be rolled back to ensure that the database state is not left inconsistent.

Using these two rules, your server implementations will be better behaved, take less processing time and memory, and your services will be more robust and effective. But this also leads us to a question - what are contexts?

## What are Contexts?

The [`context`](https://golang.org/pkg/context/) package in the Go standard library provides a type

## Microservice Chains and Context Handling


[![Microservice Context Terminals](/images/blog/2021-05-02-microservice-context-terminals.png)](/images/blog/2021-05-02-microservice-context-terminals.png)

The code for experiment can be found at: [github.com/rotationalio/ctxms](https://github.com/rotationalio/ctxms).