---
title: "Test Driving Event Driven Applications With Watermill"
slug: "test-driving-event-driven-applications-with-watermill"
date: "2023-01-19T17:09:12-05:00"
draft: true
image: img/blog/sunrise_c.jpg
author: Prema Roman
category: Microservices, Eventing, Event Driven Applications
profile: img/team/prema-roman.png
description: "First of two blog posts introducing Watermill and Ensign"
---

Event driven architecture (EDA) is a powerful framework for building modern applications as described [here](https://rotational.io/blog/five-technologies-quietly-transforming-the-web/).  Unlike conventional applications, which follow a request-response pattern, EDA enables the decoupling of microservices and allows for asynchronous passing of data between them, which results in lower latency and higher throughput and is well suited for modern, distributed system architectures.  It has opened up opportunities for organizations to build more robust real-time applications.

There are many ways to build event driven applications and there are several tools available as detailed [in this post](https://rotational.io/blog/eventing-platforms/).  However, building event driven applications is hard.  It requires advanced software engineering skills and DevOps skills to get projects up and running.  On top of that, there is a lack of standardization among tools, so it is difficult to make changes to tooling after the fact.

This is where [Watermill](https://watermill.io) comes in.  Watermill enables developers unfamiliar with EDA to get started building event driven applications.  Furthermore, it provides a standardized API that allows developers to experiment with different EDA tools.  It is very simple to start building applications in one tool, and with just a few changes, switch to another.  The goal of Watermill, as the creators have stated, is "to make communication with messages as easy to use as HTTP routers."  They also add: "Just like you don’t need to know the whole TCP stack to create a HTTP REST server, you shouldn’t need to study all of this knowledge to start with building message-driven applications."

At the core of EDA is the `event` or `message`, for example, a customer added an item to a shopping cart or a smart light just turned on.  In the EDA framework, a `producer` or a `publisher` produces/publishes these events to a `topic`, while a `consumer` or `subscriber` listens to the topic and consumes and processes messages as they arrive.  There are several advantages to this framework.  First, the producer and consumer applications can be built independently of each other and the processing can be asynchronous.  There is no need for blocking code execution as there is in a traditional request/response framework where the client has to block until it gets a response from the server.  Second, the producer application can simply send data in its raw form and it is up to the consumer application to do the data transformations that is suited for its use case.  This opens up the possibilities of having multiple consumers listening on the same topic to serve various business functions.

Watermill provides a very simple interface to create a publisher and a subscriber.

```go
type Publisher interface {
	Publish(topic string, messages ...*Message) error
	Close() error
}

type Subscriber interface {
	Subscribe(ctx context.Context, topic string) (<-chan *Message, error)
	Close() error
}
```

Creating a new publisher or subscriber is also very straightforward.  Here is an example of how you can add a new publisher using an event streaming platform of your choice through the Watermill API. 

<table>
<tr>
<th>Kafka</th>
<th>Ensign</th>
</tr>
<tr>
<td>

```go
publisher, err := kafka.NewPublisher(
		kafka.PublisherConfig{
			Brokers:   brokers,
			Marshaler: kafka.DefaultMarshaler{},
		},
		logger,
	)
	if err != nil {
		panic(err)
	}
	defer publisher.Close()
```

</td>
<td>

```go
publisher, err := ensign.NewPublisher(
		ensign.PublisherConfig{
			Marshaler: marshaler,
		},
		logger,
	)
	if err != nil {
		panic(err)
	}
	defer publisher.Close()
```

</td>
</tr>
</table>

Here is how you can add a new subscriber:

<table>
<tr>
<th>Kafka</th>
<th>Ensign</th>
</tr>
<tr>
<td>

```go
sub, err := kafka.NewSubscriber(
		kafka.SubscriberConfig{
			Brokers:       brokers,
			Unmarshaler:   marshaler,
			ConsumerGroup: consumerGroup,
		},
		logger,
	)
	if err != nil {
		panic(err)
	}
```

</td>
<td>

```go
sub, err := ensign.NewSubscriber(
		ensign.SubscriberConfig{
			Unmarshaler: marshaler,
		},
		logger,
	)
	if err != nil {
		panic(err)
	}
```

</td>
</tr>
</table>

As you can see, it is fairly straightforward to get started.  Watermill also offers functionalities such as retry logic, throttling, poison queue, and observability metrics through the use of a component called [router](https://watermill.io/docs/messages-router/).  The following flowchart shows how the router can be used.

!["Router"](/img/blog/2023-01-19-test-driving-event-driven-applications-with-watermill/router.png)

For those who have worked with HTTP requests, this probably looks familiar.  The idea behind the router is that you can add any number of handlers that determine how to handle new messages that arrive on a topic.  If you need to add more functionality to execute before or after the handler functions, Watermill has added middleware options, which are essentially decorator functions on top of the handler function.  These middleware functions can be added to a specific handler or directly on the router to apply to every single message that is sent to the router.

The following is the function signature for a handler:

```go
func (r *Router) AddHandler(
	handlerName string,
	subscribeTopic string,
	subscriber Subscriber,
	publishTopic string,
	publisher Publisher,
	handlerFunc HandlerFunc,
) *Handler
```

The `handlerName` is a unique value assigned to the handler.  The handler receives the messages from the `subscribeTopic` and the handlerFunc is the function that gets executed by the subscriber when a new message arrives on the `subscribeTopic`.  The handlerFunc returns new messages and puts them on the `publishTopic`.  At this point, the publisher code gets executed. If there is no need for a publisher, then there is also an option to use a `NoPublisherHandler` where the handler only executes the subscriber function when a new message arrives in the `subscribeTopic`.

The function signature for a middleware is as follows:

```go
type HandlerMiddleware func(h HandlerFunc) HandlerFunc
```

Watermill already comes with several middleware options which are available [here](https://github.com/ThreeDotsLabs/watermill/tree/master/message/router/middleware) but you can also build your own custom middleware and add it to the router.  The following is an example where multiple middlewares are added to the router:

```go
// Router level middleware are executed for every message sent to the router
   router.AddMiddleware(
        // CorrelationID will copy the correlation id from the incoming message's metadata to the produced messages
       middleware.CorrelationID,

        // The handler function is retried if it returns an error.
       // After MaxRetries, the message is Nacked and it's up to the PubSub to resend it.
       middleware.Retry{
            MaxRetries:      3,
            InitialInterval: time.Millisecond * 100,
            Logger:          logger,
        }.Middleware,

        // Recoverer handles panics from handlers.
       // In this case, it passes them as errors to the Retry middleware.
       middleware.Recoverer,
    )
```

With all of these building blocks, a [Getting Started](https://watermill.io/docs/getting-started/) guide, and several [examples](https://github.com/ThreeDotsLabs/watermill/tree/master/_examples) in the Watermill repo to try out, it is very easy to get started building event driven applications.  In the next blog post, I will cover an end-to-end use case using Watermill and **Ensign**, which is a new event streaming platform that not only has real-time stream processing capabilities but offers totally ordered and persistent storage as well as data governannce and geo-compliance controls.