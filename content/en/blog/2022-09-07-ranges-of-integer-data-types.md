---
title: "Ranges of Integer Data Types"
slug: "ranges-of-integer-data-types"
date: "2022-09-07T09:40:12-05:00"
draft: false
author: Benjamin Bengfort
authors: 
  - Benjamin Bengfort
image: img/blog/num215.jpg
category: Golang, Programming
profile: img/team/benjamin-bengfort.png
description: "A quick reference for the sizes of standard integer types in Go"
---

The data type choices we make when building data systems or metrics is critically important: as our systems run for long periods of time it can be easy to overflow the integers that we use (Y2K bug anyone?). As a result, I find myself constantly checking the sizes of standard int types but I haven't found a good way to Google this. This blog post is a quick reference for the standard sizes and a discussion on why it matters.

<!--more-->

So without further ado, here are the ranges of the standard numeric types:

| Type      | Minimum                    | Maximum                    |
| --------- | -------------------------- | -------------------------- |
| `int8`    | -128                       | 127                        |
| `int16`   | -32,768                    | 32,767                     |
| `int32`   | -2,147,483,648             | 2,147,483,647              |
| `int64`   | -9,223,372,036,854,775,808 | 9,223,372,036,854,775,807  |
| `uint8`   | 0                          | 255                        |
| `uint16`  | 0                          | 65,535                     |
| `uint32`  | 0                          | 4,294,967,295              |
| `uint64`  | 0                          | 18,446,744,073,709,551,615 |
| `float32` | 1.401298464324817e-45      | 3.4028234663852886e+38     |
| `float64` | 5e-324                     | 1.7976931348623157e+308    |

The code to generate these values is as follows:

```golang
// Constants defined in the math package
const (
	MaxInt8   int8   = 1<<7 - 1
	MinInt8   int8   = -1 << 7
	MaxInt16  int16  = 1<<15 - 1
	MinInt16  int16  = -1 << 15
	MaxInt32  int32  = 1<<31 - 1
	MinInt32  int32  = -1 << 31
	MaxInt64  int64  = 1<<63 - 1
	MinInt64  int64  = -1 << 63
	MaxUint8  uint8  = 1<<8 - 1
	MaxUint16 uint16 = 1<<16 - 1
	MaxUint32 uint32 = 1<<32 - 1
	MaxUint64 uint64 = 1<<64 - 1
)

// Complement method (system specific)
const (
	MaxUint uint = ^uint(0)
	MinUint uint = 0
	MaxInt  int  = int(MaxUint >> 1)
	MinInt  int  = -MaxInt - 1
)
```

Of course if you're using this in Go code, I recommend simply using the [constants defined in the `math` package](https://pkg.go.dev/math#pkg-constants) which use the left shift `<<` bit operator to define the constants as shown above. If you use `uint` or `int` without declaring the size of the integer then the [system size is used](https://go.dev/tour/basics/11). To determine the platform dependent size you can use the complement method as shown in the second block. You can try the above code in the [Go playground](https://go.dev/play/p/jLQEoouXyBg).

There are also [many more methods to compute these values](https://stackoverflow.com/questions/6878590/the-maximum-value-for-an-int-type-in-go).

## Why Does This Matter?

Consider the following code:

```golang
const biggest = 1<<64-1

fmt.Printf("%d", biggest)
```

If you run this code, you'll get the following compiler error: "cannot use biggest (untyped int constant 18446744073709551615) as int value in argument to fmt.Printf (overflows)". This is because without any other information the compiler assumes that `biggest` is an int, which depending on whether or not you're on a 32 bit or 64 bit system is either an `int32` or an `int64`. In either case, the maximum value of a `uint64` is too big to hold in an `int64`. To fix this problem, you can declare the type as shown below, but what is an overflow?

```golang
var biggest uint64 = 1<<64 - 1

fmt.Printf("%d", biggest+1)
```

The result of the above code is a printed "0" because when we add 1 to the biggest uint64, the value overflows: the data type was not large enough to store the data. A `uint64` allocates 64 bits of memory to hold the value. The left shift operator, `<<` above has the effect of populating all 64 bits with 1s, e.g. the biggest possible `uint64` value. However, when we add 1 to this value, all the 1s are converted to 0s as we move to the 65th place value ... but there is no 65th bit so only the 0s remain.

It may be easier to understand an example in decimal: consider a number that is only allowed to have two digits. The largest possible decimal number is 99, when we add one, we convert the two digit places to 0 and add 1 to a third place to get 100, but because only two digits are allowed, the result is 00.

Overflows cause problems with programming systems all the time. In 2014, [Gangnam Style overflowed INT_MAX in YouTube's view counter](https://arstechnica.com/information-technology/2014/12/gangnam-style-overflows-int_max-forces-youtube-to-go-64-bit/) causing YouTube to have to upgrade its counter to 64-bit integers. In 2004, [Comair had to ground 1100 flights](https://arstechnica.com/uncategorized/2004/12/4490-2/) because it's scheduling software used a 16-bit pointer in its scheduling software but bad weather caused more than the hard limit of 32,768 changes per month. Integer overflows are also a common source of security exploits, In 2021, [a Saudi activist's phone was hacked](https://citizenlab.ca/2021/09/forcedentry-nso-group-imessage-zero-click-exploit-captured-in-the-wild/) with an 0-day that took advantage of an integer overflow in an image rendering library.

Unfortunately, the solution is not as simple as choose the largest data type and stick with it. Using an `int64` instead of an `int32` doubles the amount of memory and data storage required for processing, and in high volume systems this can be significant. If you won't have a number larger than the max value, then that is a waste of zeros. For data storage or network serialization, there are some tricks you can use such as [variable length encoding used in protocol buffers](https://developers.google.com/protocol-buffers/docs/encoding), but the value will always be expanded in memory.

At Rotational, we're working on an global event processing system. Events must be totally ordered and need ids that reflect that ordering, so could we use a `uint64` as the ID value? We simply reformulated the question as: "what would it take to generate over 18 quintillion events?" We focus on systems with publishers that generate events at a maximum of 30Hz (30 events per second). At this rate it would take one publisher 19,484,734,869.69 years to overflow the ID. However if we used an `uint32` it would take just 4.54 years to overflow the ID field.
