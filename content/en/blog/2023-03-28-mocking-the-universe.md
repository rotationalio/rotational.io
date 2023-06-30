---
title: "Mocking the Universe: Two Techniques for Testing gRPC with Mocks"
slug: "mocking-the-universe"
date: "2023-03-28T13:29:11-04:00"
draft: false
image: img/blog/2023-03-08-mocking-the-universe/monkey-in-mirror.jpg
author: Daniel Sollis
authors: 
  - Daniel Sollis
category: Golang, Programming, Testing, gRPC
profile: img/team/daniel-sollis.png
description: "Mocking can be an easy way to get around gRPC connections when testing."
---

At Rotational, [we use gRPC](https://rotational.io/blog/what-are-protocol-buffers/) [quite a bit](https://rotational.io/blog/documenting-grpc-with-openapi). It's great for specifying network APIs, but can challenge us to find new ways to thoroughly test the code. Follow along with this post to learn two ways of using [mocking](https://rotational.io/blog/fake-it-when-you-make-it/) to test gRPC services!

<!--more-->

## Why Mock?

The main reason for using mocks is that they allow you to get around dependencies.

If you are testing a discrete piece of code, you want to test THAT piece of code, not every dependency it's using as well (hopefully you have separate tests that cover those dependencies 😉).

The same goes for code using gRPC. When a piece of code calls an RPC, you don't want to have to test the entire **gRPC service** as well as the network (which can be unreliable and *super* hard to test). But how can we avoid stepping into the implementation details when testing gRPC?

The easiest way to get around this is to avoid gRPC altogether, with what we at Rotational refer to as **"package mocks"**. The second technique, which we call **"universal mocks"**, allows us to directly test gRPC methods in a more structured way. Read on to learn more about both and see some examples.

## Package Mocks

In many cases, different gRPC service calls can be isolated into their own packages that contain structs (likely a **gRPC client** or a struct containing the client) that implement the service's procedure calls. By mocking these structs, **"package mocks"** enable you to avoid not only the **gRPC calls**, but any other dependencies that might show up in the service's implementation.

Lets imagine we have the following service defined:

```proto
syntax = "proto3";

service Database {
    rpc Get(GetRequest) returns (GetReply) {};
    rpc Put(PutRequest) returns (PutReply) {};
}
```

In our `database` package (let's imagine it's inside a file called `database/database.go`) we might have the following struct defined:

```golang
type Database struct {
    conf database.config
    client DatabaseNetworkClient
}
```

This struct will take care of all of the service's RPC implementation and will also take care of any state (such as configuration or caching) that the service requires. If we add a new interface called `Store`, which the `Database` struct implements:

```golang
type Store {
    Get(GetRequest) GetReply
    Put(PutRequest) PutReply
}
```

We can now start defining a "package mock" that will allow us to circumvent calls to the `Database` service by creating a new struct that also implements `Store`.

```golang
const (
    MockDBGet = "MockDB specified error on call to Get"
    MockDBPut = "MockDB specified error on call to Put"
)

type MockDB struct {
    Calls      map[string]int
	ErrorOn    string
}

func NewMockDB(conf) *MockDB {
	return &MockDB{
		Calls: make(map[string]int),
	}
}

func (d *MockDB) Get(context.Context, GetRequest) (*GetReply) {
	d.Calls[MockDBGet]++
	if d.ErrorOn == MockPeersGet {
		return nil, errors.New(d.ErrorOn)
	}
	return &GetReply{
        Success: true
    }, nil
}

func (d *MockDB) Put(context.Context, PutRequest) (*PutReply) {
	d.Calls[MockDBPut]++
	if d.ErrorOn == MockPeersGet {
		return nil, errors.New(d.ErrorOn)
	}
	return &PutReply{
        Success: true
    }, nil
}
```

The fields we've added to the mock struct are particularly useful. By using the `Calls` map, you can verify that the number of calls you expect have actually happened. With the `ErrorOn` field, you can trigger any RPC call to fail when needed for testing purposes.

## Universal Mocks
Package mocks work perfectly for testing code that uses the package that we are mocking, but what about testing the package and it's RPC calls directly? This going to require a different technique, which we at Rotational refer to as **"universal mocks"**.

When testing a package that implements a **gRPC service** we seemingly won't be able to get around having to deal with RPC calls, which bring with them all of the complications of dealing with an unreliable network and whatever dependencies are part of the RPC handling code on the other side of the network.

Fortunately for us gRPC comes with a built in solution, the [Bufconn package](https://pkg.go.dev/google.golang.org/grpc/test/bufconn). Bufconn provides a way to get around the network dependency by creating an in-memory buffer that simulates a real **gRPC connection**.

What about the service at the other end of the connection though? Doesn't that still have dependencies that we don't want to deal with? Well, we can mock it with a **"universal mock"**.

Let's go back to our original **Database** definition:

```golang
type Store {
    Get(GetRequest) GetReply
    Put(PutRequest) PutReply
}

type Database struct {
    conf database.config
    client database.DatabaseNetworkClient
}
```

In order to test this struct we'll need to create a mocked server with bufconn that this struct's client can connect to, this will be the "universal mock", and will look something like this:

```golang
type RemoteDB struct {
	conn        *bufconn.Listener
    srv         *grpc.Server
    Calls       map[string]int
    OnGet       func(context.Context, GetRequest) (*GetReply, error)
    OnPut       func(context.Context, PutRequest) (*PutRequest, error)
}
```

This looks a lot like the Package mock with a few modifications. We keep the `Calls` map to count specific RPC calls but add a bufconn and `grpc.Server` to serve with. The `OnGet` and `OnPut` field's type is a bit odd and we'll go over those later. Creating a new `RemoteDB` will be a bit different than with the package mock:

```golang
func NewRemoteDB() *RemoteDB {
	database := &RemoteDB{
		conn:  bufconn.Listen(bufsize),
		srv:   grpc.NewServer(),
		Calls: make(map[string]int),
	}
	pb.RegisterDatabaseNetworkServer(database.srv, database)
	go database.Serve()
	return database
}

func (r *RemoteDB) Serve() {
	if err := r.srv.Serve(r.conn); err != nil {
		fmt.Println(err.Error())
	}
}

func (r *RemoteDB) ClientOptions() (opts []grpc.DialOption) {
	// Create the dialer
	dialer := func(context.Context, string) (net.Conn, error) {
		return r.conn.Dial()
	}
	opts = append(opts, grpc.WithContextDialer(dialer))

	// Disable transport security
	opts = append(opts, grpc.WithInsecure())

	return opts
}
```

In the `NewRemoteDB` function we have to instantiate a new `bufconn` and gRPC server that we need to register and serve. We also have an additional function for serving with the gRPC server and a method for returning the preferred `gRPC.DialOptions` to make connecting to the mocked server easier.

The final piece of the puzzle is the RPC implementations; this is where those odd field types from before come in:

```golang
func (r *RemoteDB) Get(ctx context.Context, in GetRequest) (out *GetReply, err error) {
	r.Calls[GetRPC]++
	return r.OnGet(ctx, in)
}

func (r *RemoteDB) Put(ctx context.Context, in PutRequest) (out *PutRequest, err error) {
	r.Calls[PutRPC]++
	return r.OnPut(ctx, in)
}
```

The use of the `Calls` field is largely the same as with the package mock, but we are basically just calling the functions stored on the `OnGet` and `OnPut` fields. Because these reference stored functions (which can do arbitrary behavior), this allows us to specify whatever functionality we want the server to have for these RPCs!

For example if we want the server to simply return an empty reply:

```golang
mock := NewRemoteDB()
mock.OnGet = func(context.Context, GetRequest) (*GetReply, error) {
	return &GetReply{}, nil
}
reply := mock.Get()
```

Putting all of this together we get the following universal mock:

```golang
const(
    GetRPC  = "Database/Get"
	PutRPC  = "Database/Put"
	bufsize = 1024 * 1024
)

type RemoteDB struct {
	conn        *bufconn.Listener
    srv         *grpc.Server
    Calls       map[string]int
    OnGet       func(context.Context, GetRequest) (*GetReply, error)
    OnPut       func(context.Context, PutRequest) (*PutRequest, error)
}

func NewRemoteDB() *RemoteDB {
	database := &RemoteDB{
		conn:  bufconn.Listen(bufsize),
		srv:   grpc.NewServer(),
		Calls: make(map[string]int),
	}
	pb.RegisterDatabaseNetworkServer(database.srv, database)
	go database.Serve()
	return database
}

func (r *RemoteDB) Serve() {
	if err := r.srv.Serve(r.conn); err != nil {
		fmt.Println(err.Error())
	}
}

func (r *RemoteDB) ClientOptions() (opts []grpc.DialOption) {
	// Create the dialer
	dialer := func(context.Context, string) (net.Conn, error) {
		return r.conn.Dial()
	}
	opts = append(opts, grpc.WithContextDialer(dialer))

	// Disable transport security
	opts = append(opts, grpc.WithInsecure())

	return opts
}

func (r *RemoteDB) Get(ctx context.Context, in GetRequest) (out *GetReply, err error) {
	r.Calls[GetRPC]++
	return r.OnGet(ctx, in)
}

func (r *RemoteDB) Put(ctx context.Context, in PutRequest) (out *PutRequest, err error) {
	r.Calls[PutRPC]++
	return r.OnPut(ctx, in)
}
```

### Connecting the Universal Mock

The last step is to have the `Database` struct's client to the universal mock. We need to add a method to the struct that handles connecting to an RPC server:

```golang
func (d *Database) Connect(opts ...grpc.DialOption) (err error) {
	if d.client != nil {
		return nil
	}

	var cc *grpc.ClientConn
	if cc, err = grpc.Dial("bufnet", opts...); err != nil {
		return fmt.Errorf("could not dial database service: %s", err)
	}

	d.client = NewDatabaseNetworkClient(cc)
	return nil
}
```

With this method in place, creating and connecting to a universal mock becomes easy as can be:

```golang
mock := NewRemoteDB()
err = database.Connect(mock.ClientOptions()...)
```

## Conclusion

At Rotational we frequently use both "package mocks" and "universal mocks". The first allows us to test behavior that would normally engage external gRPC calls without actually having to make external calls. With the second type, we can also get around any gRPC calls by simulating gRPC connection and the expected or resultant behavior.

Together these techniques have enabled us to more easily test our gRPC services, including those for [Ensign](https://ensign.rotational.dev/getting-started/), our managed eventing platform that takes a lot of the stress out of building microservices. If you're interested in reading more on how we use mocks, check out [this post next]( https://rotational.io/blog/fake-it-when-you-make-it/).

Happy mocking!

*Want early access to a platform and community for developers building event-driven apps? Check out our [free beta of Ensign](https://rotational.app/register/).*
