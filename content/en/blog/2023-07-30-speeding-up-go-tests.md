---
title: "Speeding Up Go Tests"
slug: "speeding-up-go-tests"
date: "2023-07-30T09:39:09-05:00"
draft: false
image: img/blog/footrace.jpg
photo_credit: "Photo by Braden Collum on Unsplash"
author: Benjamin Bengfort
profile: img/team/benjamin-bengfort.png
tags: "Golang"
description: "By using parallel and short modes with Go tests, we can improve our local test speed and save longer running tests for CI."
---

It can be frustrating as a developer to wait for a large test suite to run, particularly when you have to run the suite multiple times in development. In this post, we'll explore parallel and short modes with Go tests in an effort to improve local test speed and save longer running tests for CI.

<!--more-->

Testing is critically important to the software we write, but as our packages and applications grow bigger, the amount of time it takes tests to run increases simply because we're adding more tests. While Go does a good job of caching tests so that not all tests are run every time, there are ways we can speed up testing both locally and in CI -- after all, when you're programming, every second counts!

In this post we'll look at:

1. Parallelizing tests
2. Using `-short` to skip long running tests
3. Only running specific tests
4. Cacheing tests
5. Using `TestMain` to reduce setup and teardown work

## Parallel Tests

The most effective way to increase test speed (but perhaps not the simplest) is to run tests in parallel (e.g. at the same time), particularly if your computer has multiple cores on it. By default, the tests in a single package are executed sequentially, e.g. one after the other. In order for tests to be run in in parallel, you have to tell Go that the test is safe for parallel execution as follows:

```go
func TestMethod(t *testing.T) {
    t.Parallel()
    // rest of test ...
}
```

Make sure that this is called first in the test function before any test code is written. The only thing that should come before `t.Parallel` are any `t.Skip` assertions.

Only tests that are marked as parallel will be run in parallel, so this isn't terribly useful if you only have one parallel test. However, if you know that a test can be run completely independently from the rest of the system, it doesn't hurt to mark it as parallel so that when you continue to develop and add other tests as parallel in the same package, you'll naturally gain the speed boost.

The number of tests marked parallel that are run simultaneously is set to the value of `GOMAXPROCS`, which, unless specified by the environment variable, defaults to the value of `runtime.NumCPU`. It can also be set to a specific value using the `-parallel` flag.

Go test also runs package tests in parallel; e.g. in a package with many subpackages, using `go test ./...` will run each package discovered below the current working directory in parallel. Using the `-p` flag specifies the number of builds and tests to run in parallel. You can constrain each package to be tested one at a time using `-p 1` but you can also increase this number, e.g. `go test -p 4 ./...` will run four packages at a time.

## Handling Long Tests in Short Mode

Sometimes an individual test that is extensive (e.g. performs many iterations or tests many random values) may take a long time to run. These kinds of tests are important to or confidence that the code is robust to many edge cases, but may not be helpful during routine development when we're just trying to determine if the code we're changing has any side effects or regressions.

A good way to handle this is to define tests using the `-short` flag in go tests:

```
$ go test -short ./...
```

In your tests, you can detect if the `-short` flag has been set as follows:

```go
func TestFuzzy(t *testing.T) {
    numIterations := 10000
    if testing.Short() {
        numIterations = 10
    }

    for i := 0; i < numIterations; i++ {
        // Test code on random values
    }
}
```

Now your team can have confidence that the tests are protecting their development but not have to deal with the trade-off of extensive testing vs. timely tests. In CI you can run tests without the `-short` flag and have the extensive tests run on every PR.

Alternatively, if you have a test that simply takes a long time, you can just skip it if you're in `-short` mode. In order to evaluate what tests are taking the longest, I recommend outputing your test in JSON using the `-json` flag:

```
$ go test -json ./... > output.jsonlines
```

With a simple Python script, you can quickly identify what tests are taking a long time:

```python
#!/usr/bin/env python

import json

if __name__ == "__main__":
    tests = []

    with open('output.jsonlines', 'r') as f:
        for line in f:
            data = json.loads(line)
            if data['Action'] != 'pass':
                continue

            if 'Test' not in data:
                continue

            if data['Elapsed'] < 0.1:
                continue

            tests.append(data)

    tests.sort(key=lambda d: d['Elapsed'], reverse=True)
    for t in tests:
        print(f"{t['Elapsed']:0.3f}s\t{t['Package']} {t['Test']}")
```

This script prints out the tests that take longer that 0.1 seconds from longest running test to shortest running test. You can then skip those long running tests in `-short` mode:

```go
func TestLongRunning(t *testing.T) {
    if testing.Short() {
        t.Skip("skipping long running test in short mode")
    }
    // actual test
}
```

While we're here, note that you can also detect the `-v` or `-verbose` flag in tests using `testing.Verbose()`. This is a good way to detect when to provide extra debugging information to your colleagues or future self. I like to use `testing.Verbose()` to set log levels dynamically for the test.

## Specify Tests to Run

When you're developing, you don't have to run `go test ./...` to test every single package, every single time. Instead, it is better to specify the tests that you want to run more specifically. For example, you could test just the packages you're working on, not every single package:

```
$ go test -p 2 ./pkg/utils ./pkg/server
```

These two packages will be built and tested in parallel. You can also specify exactly which test to run using the `-run` flag:

```
$ go test -run ^TestMethod$ ./...
```

This command will only run tests that exactly match the function name `TestMethod`. The use of the `^` and `$` indicate that `-run` takes a regular expression as an argument. The `^` indicates the beginning of the test name and the `$` the end of the test name. If you wanted to match all tests that start with `TestAsync` you would use `go test -run ^TestAsync` (e.g. no `$` at the end) and this will match `TestAsyncMethod` and `TestAsyncFunction`. Alternatively you could use `go test -run Async` which would also match `ExampleAsync` in your test code.

## Cacheing Tests

This is primarily a tip for CI: Go caches tests, results, and dependencies locally. So when you run `go test ./...` twice without changing the code in between, you should see `[cached]` displayed on the tests/packages that weren't run and the tests should have gone a lot faster. If you do make changes to the code, Go will only run the tests whose builds are affected by the changes.

Note: to prevent cacheing locally use the `-count=n` flag, e.g. `go test -count=1 ./...` which will force Go to ignore the cache. You can also use `go test -count=10 ./...` to run the tests 10 times in parallel; this is useful for debugging intermittent tests (e.g. tests that don't always fail everytime the test is run).

Adding caches in CI depends a lot on the CI tool you're using. For GitHub actions you could try:

```yaml
- uses: actions/setup-go@v3
  with:
    cache: true
    cache-dependency-path: go.sum
```

or

```yaml
- uses: actions/cache@v3
  with:
    path: |
      ~/.cache/go-build
      ~/go/pkg/mod
    key: go-test-${{ github.sha }}
    restore-keys: |
      go-test-
```

But your results may vary depending on what the tests are doing and what the cacheing is capturing between CI runs, particularly across different PRs. It's still worth experimenting with!

## TestMain

Finally, my last suggestion is to use `TestMain` to control setup and tear down behavior for tests. By doing extensive work (particularly work that requires I/O) before your tests run instead of on each individual test, you can save yourself a lot of work.

If you define a function called `TestMain` in your test package, your tests will not be run by default, instead you have to run them manually -- but that gives you extra control of how and when your tests are run.

```go
func TestMain(m *testing.M) {
    // Setup test fixtures and other heavy-weight test dependencies
    setup()

    // Execute all of the tests
    ec := m.Run()

    // Teardown and clean up fixtures or other items
    teardown()

    // Exit and return the exit code to indicate the tests results
    os.Exit(ec)
}
```

If you don't specify the exit code using `os.Exit` then `go test` will exit with `0` even if the tests fail. Most CI tools look for the exit code to determine if the tests have passed or not, so this step is critical and shouldn't be left out!