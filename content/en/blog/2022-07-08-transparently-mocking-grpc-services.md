---
title: "Transparently Mocking gRPC Services"
slug: "transparently-mocking-grpc-services"
date: "2022-07-08T09:32:01-04:00"
draft: false
author: Patrick Deziel
image: img/blog/blue_laser.jpg
tags: ['gRPC', 'Mocks', 'Programming']
photo_credit: JJ Ying via Unsplash
description: "gRPC is a common framework used to facilitate communication between microservices, but testing these services can be a challenge. In this post we will present a simple strategy for mocking gRPC services in Go."
profile: img/team/patrick-deziel.png
---

gRPC is an effective way of implementing service-to-service APIs. However, there are limited tools available for mocking and testing gRPC services out of the box. One option is to set up a live test server, although this comes with its own challenges and costs. In this blog post we will demonstrate a more lightweight solution using the `bufconn` package and a hand-built mock. Don't worry, this is easier than it seems!

<!--more-->

Before we get started, the full tutorial code is available [here](https://github.com/rotationalio/agenda).

## The API

We usually start by defining the API for our service, as it can inform many decisions related to implementation. For simplicity, we'll create an "agenda" service in our `.proto` file, which contains two RPC definitions and some protocol buffers. The `Schedule` RPC will allow the client to schedule items on the agenda and the `Daily` RPC will return a list of scheduled items to the client.

```protobuf
service Agenda {
    rpc Schedule(Item) returns (Item) {}
    rpc Daily(Day) returns (Docket) {}
}

message Item {
    string id = 1;
    string title = 2;
    string date = 3;
    string start = 4;
    string end = 5;
    string description = 6;
}

message Day {
    string date = 1;
    string start = 2;
    string end = 3;
}

message Docket {
    string date = 1;
    repeated Item items = 2;
}
```

## Mocking Communication

In order to test our gRPC service, we will need to inject a mocked connection. Fortunately, there is a package called `bufconn`[^1], which does most of the heavy lifting for us. `bufconn` gives us two things, a way to start an in-memory buffered listener and a way to connect to that listener using a `grpc.DialOption`. We have found it useful to abstract this functionality into a "utils" package.

```go
const bufsize = 1024 * 1024

type Listener struct {
	sock *bufconn.Listener
}

func New() *Listener {
	return &Listener{
		sock: bufconn.Listen(bufsize),
	}
}

func (l *Listener) Sock() net.Listener {
	return l.sock
}

func (l *Listener) Close() error {
	return l.sock.Close()
}

func (l *Listener) Connect(ctx context.Context, opts ...grpc.DialOption) (cc *grpc.ClientConn, err error) {
	opts = append([]grpc.DialOption{grpc.WithContextDialer(l.Dialer)}, opts...)
	if cc, err = grpc.DialContext(ctx, "bufnet", opts...); err != nil {
		return nil, err
	}
	return cc, nil
}

func (l *Listener) Dialer(context.Context, string) (net.Conn, error) {
	return l.sock.Dial()
}
```

## Creating the Server

Our server setup is fairly idiomatic aside from one important detail: we don't want our testing code to start a "real" server since we are mocking that with `bufconn`. Therefore, our `Serve` function is separated into `Serve` and `Run`. This will allow our tests to pass in a `net.Listener` object obtained from `bufconn` rather than a connection address. The exciting part about this is that it completely isolates the mock code from the production server code!

```go
type Server struct {
	api.UnimplementedAgendaServer
	srv   *grpc.Server
	echan chan error
}

func New() (*Server, error) {
	s := &Server{
		echan: make(chan error, 1),
	}

	// Create the gRPC Server
	s.srv = grpc.NewServer()
	api.RegisterAgendaServer(s.srv, s)
	return s, nil
}

// The test code will not call this function
func (s *Server) Serve(addr string) (err error) {
	// Catch OS signals for graceful shutdowns
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt)
	go func() {
		<-quit
		s.echan <- s.Shutdown()
	}()

	// Listen for TCP requests on the specified address and port
	var sock net.Listener
	if sock, err = net.Listen("tcp", addr); err != nil {
		return fmt.Errorf("could not listen on %q", addr)
	}

	// Run the server
	go s.Run(sock)
	log.Info().Str("listen", addr).Str("version", pkg.Version()).Msg("agenda server started")

	// Block and wait for an error either from shutdown or grpc.
	if err = <-s.echan; err != nil {
		return err
	}
	return nil
}

// The test code can pass in a bufconn listener here
func (s *Server) Run(sock net.Listener) {
	defer sock.Close()
	if err := s.srv.Serve(sock); err != nil {
		s.echan <- err
	}
}
```

## Creating the Client

For the client implementation, we take advantage of variadic arguments to implement a similar isolation strategy. When initializing the client, the caller can pass in any number of `grpc.DialOption` parameters (even zero). In production, we may want to pass in mTLS or other options here. For testing, we will pass in the dialer from `bufconn`.

```go
type Client struct {
	cc  *grpc.ClientConn
	rpc api.AgendaClient
}

func New(endpoint string, opts ...grpc.DialOption) (c *Client, err error) {
	c = &Client{}

	if len(opts) == 0 {
		// Production connection opts (TLS, etc.)
		opts = make([]grpc.DialOption, 0)
		opts = append(opts, grpc.WithTransportCredentials(insecure.NewCredentials()))
	}

	if c.cc, err = grpc.Dial(endpoint, opts...); err != nil {
		return nil, err
	}
	c.rpc = api.NewAgendaClient(c.cc)

	return c, nil
}

func (c *Client) Close() error {
	return c.cc.Close()
}
```

## The Server Mock

In previous blog posts, we have discussed the importance of isolation and configurability of mocks. We will now demonstrate these concepts by creating an independent mock for the `AgendaServer` in a different package that we can easily utilize from the tests. The key is to use the `bufconn` utilities that we created earlier to start the server by calling `Run` and create an accessor for the tests to access the client side of the `bufconn` connection.

```go
const (
	DailyRPC    = "agenda.v1.Agenda/Daily"
	ScheduleRPC = "agenda.v1.Agenda/Schedule"
)

// New creates a new mock AgendaServer. If bufnet is nil, one is created for the user.
func New(bufnet *utils.Listener) *AgendaServer {
	if bufnet == nil {
		bufnet = utils.New()
	}

	remote := &AgendaServer{
		bufnet: bufnet,
		srv:    grpc.NewServer(),
		Calls:  make(map[string]int),
	}

	api.RegisterAgendaServer(remote.srv, remote)
	go remote.srv.Run(remote.bufnet.Sock())
	return remote
}

type AgendaServer struct {
	api.UnimplementedAgendaServer
	bufnet     *utils.Listener
	srv        *grpc.Server
	Calls      map[string]int
	OnSchedule func(context.Context, *api.Item) (*api.Item, error)
	OnDaily    func(context.Context, *api.Day) (*api.Docket, error)
}

// Tests can call this to get access to the bufconn
func (s *AgendaServer) Channel() *utils.Listener {
	return s.bufnet
}

func (s *AgendaServer) Shutdown() {
	s.srv.GracefulStop()
	s.bufnet.Close()
}
```

Note that we have included a call counter on the `AgendaServer`. This allows us to verify from the tests what methods have been called via the gRPC server.

```go
func (s *AgendaServer) Daily(ctx context.Context, in *api.Day) (out *api.Docket, err error) {
	s.Calls[DailyRPC]++
	return s.OnDaily(ctx, in)
}

func (s *AgendaServer) Schedule(ctx context.Context, in *api.Item) (out *api.Item, err error) {
	s.Calls[ScheduleRPC]++
	return s.OnSchedule(ctx, in)
}
```

The mock also gives us the ability to configure how the gRPC handlers will behave. For example, we might want to test how our code deals with errors or specific responses from the handlers.

```go
// UseFixture loads a a JSON fixture from disk (usually in a testdata folder) to use as
// the protocol buffer response to the specified RPC, simplifying handler mocking.
func (s *AgendaServer) UseFixture(rpc, path string) (err error) {
	var data []byte
	if data, err = ioutil.ReadFile(path); err != nil {
		return fmt.Errorf("could not read fixture: %v", err)
	}

	jsonpb := &protojson.UnmarshalOptions{
		AllowPartial:   true,
		DiscardUnknown: true,
	}

	switch rpc {
	case ScheduleRPC:
		out := &api.Item{}
		if err = jsonpb.Unmarshal(data, out); err != nil {
			return fmt.Errorf("could not unmarshal json into %T: %v", out, err)
		}
		s.OnSchedule = func(context.Context, *api.Item) (*api.Item, error) {
			return out, nil
		}
	case DailyRPC:
		out := &api.Docket{}
		if err = jsonpb.Unmarshal(data, out); err != nil {
			return fmt.Errorf("could not unmarshal json into %T: %v", out, err)
		}
		s.OnDaily = func(context.Context, *api.Day) (*api.Docket, error) {
			return out, nil
		}
	default:
		return fmt.Errorf("unknown RPC %q", rpc)
	}

	return nil
}

// UseError allows you to specify a gRPC status error to return from the specified RPC.
func (s *AgendaServer) UseError(rpc string, code codes.Code, msg string) error {
	switch rpc {
	case ScheduleRPC:
		s.OnSchedule = func(context.Context, *api.Item) (*api.Item, error) {
			return nil, status.Error(code, msg)
		}
	case DailyRPC:
		s.OnDaily = func(context.Context, *api.Day) (*api.Docket, error) {
			return nil, status.Error(code, msg)
		}
	default:
		return fmt.Errorf("unknown RPC %q", rpc)
	}
	return nil
}
```

## Putting It All Together

With our mock package, writing gRPC tests becomes more of a matter of _what_ we want to test rather than _how_ to test it. The test below verifies that our mock works by simulting an error path and a "happy" path.

```go
func TestSchedule(t *testing.T) {
	// Setup AgendaServer mock
	srv := mock.New(nil)
	defer srv.Shutdown()

	// Create a client to test that is connected to the mock server.
	dialer := grpc.WithContextDialer(srv.Channel().Dialer)
	creds := grpc.WithTransportCredentials(insecure.NewCredentials())
	agenda, err := client.New("bufconn", dialer, creds)
	require.NoError(t, err, "could not connect to remote agenda via bufconn")

	// Test the case where the server returns an error
	srv.UseError(mock.ScheduleRPC, codes.DataLoss, "something bad happened")
	err = agenda.Schedule("hello", "world", time.Now(), time.Now().Add(5*time.Minute))
	require.Error(t, err, "expected an error returned from the server")
	require.Equal(t, 1, srv.Calls[mock.ScheduleRPC])

	// Test the case where server returns a response
	srv.UseFixture(mock.ScheduleRPC, "testdata/item.json")
	err = agenda.Schedule("hello", "world", time.Now(), time.Now().Add(5*time.Minute))
	require.NoError(t, err, "expected no error in happy path")
	require.Equal(t, 2, srv.Calls[mock.ScheduleRPC])
}
```

## Conclusion

Mocking gRPC services for the purposes of testing isn't always straightforward. However, with tools like `bufconn` and some clever code factoring, we can create an in-memory mock that is completely isolated from production code. Introducing some measure of configurability into the mocks can also help us focus on _what_ we're testing rather than _how_ we're testing it.

Check out the full tutorial code [here](https://github.com/rotationalio/agenda).

---
Photo by [JJ Ying](https://unsplash.com/@jjying?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/technology?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

---

#### References

[^1]: [bufconn](https://pkg.go.dev/google.golang.org/grpc/test/bufconn)
