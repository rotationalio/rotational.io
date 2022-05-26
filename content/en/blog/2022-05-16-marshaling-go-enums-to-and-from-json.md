---
title: "Marshaling Go Enums to and from JSON"
slug: "marshaling-go-enums-to-and-from-json"
date: "2022-05-16T15:43:13-05:00"
draft: false
image_webp: images/blog/fireworks_star.webp
image: images/blog/fireworks_star.jpg
author: Benjamin Bengfort
description: "How to customize JSON serialization for your data types while avoiding pointer and receiver problems -- a story in three parts."
---

Customizing JSON serialization for your data types seems relatively straightforward on the surface, but it's easy to get turned around in receiver, value, pointer, and indirection confusion. Many of the patterns and rules-of-thumb you use in your normal Go code can lead you astray. In this post, we'll illustrate exactly how and why to handle these edge cases.
<!--more-->

But before we get any further, if you're using this as a reference to determine how to implement JSON serialization for an enum type, here is the code snippet you're looking for:

```go
type Suit uint8

// MarshalJSON must be a *value receiver* to ensure that a Suit on a parent object
// does not have to be a pointer in order to have it correctly marshaled.
func (s Suit) MarshalJSON() ([]byte, error) {
    // It is assumed Suit implements fmt.Stringer.
    return json.Marshal(s.String())
}

// UnmarshalJSON must be a *pointer receiver* to ensure that the indirect from the
// parsed value can be set on the unmarshaling object. This means that the
// ParseSuit function must return a *value* and not a pointer.
func (s *Suit) UnmarshalJSON(data []byte) (err error) {
    var suits string
    if err := json.Unmarshal(data, &suits); err != nil {
        return err
    }
    if *s, err = ParseSuit(suits); err != nil {
        return err
    }
    return nil
}
```

The complete, interactive, and runable code can be found [on the Go playground](https://go.dev/play/p/oMh1TDiwi_H).

## Customizing JSON Serialization in Go

The German-American side of my family loves playing [Euchre](https://bicyclecards.com/how-to-play/euchre/), so I thought it might be an interesting idea to create an online multiplayer card game to stay connected during the pandemic. To describe decks and hands, I had to define cards, and in order to define cards, I had to implement a `Suit` type to describe the four possible card suits: hearts, diamonds, clubs, and spades. An [Enum (short for enumerated type)](https://en.wikipedia.org/wiki/Enumerated_type) is an excellent choice to define suits, and in fact -- the Wikipedia article about enumerated types uses card suits as an example!

Here is a classic definition of an enum in Go using [`iota`](https://www.gopherguides.com/articles/how-to-use-iota-in-golang) to declare constant uint8 for our suits.

```go
const (
	Hearts Suit = iota + 1
	Diamonds
	Clubs
	Spades
)

type Suit uint8

var (
	Suit_name = map[uint8]string{
		1: "♥",
		2: "♦",
		3: "♣",
		4: "♠",
	}
	Suit_value = map[string]uint8{
		"♥":        1,
		"hearts":   1,
		"♦":        2,
		"diamonds": 2,
		"♣":        3,
		"clubs":    3,
		"♠":        4,
		"spades":   4,
	}
)

// String allows Suit to implement fmt.Stringer
func (s Suit) String() string {
	return Suit_name[uint8(s)]
}

// Convert a string to a Suit, returns an error if the string is unknown.
// NOTE: for JSON marshaling this must return a Suit value not a pointer, which is
// common when using integer enumerations (or any primitive type alias).
func ParseSuit(s string) (Suit, error) {
	s = strings.TrimSpace(strings.ToLower(s))
	value, ok := Suit_value[s]
	if !ok {
		return Suit(0), fmt.Errorf("%q is not a valid card suit", s)
	}
	return Suit(value), nil
}
```

The `Suit` enum uses 1 byte (a `uint8`) to define our constants in a small but still convenient package (technically all we need is 2 bits to represent our 4 values; a uint8 can represent up to 255 values but is far easier to work with). This is more compact than a string, but is not terribly human-friendly (e.g. you don't want to have to remember that `Hearts == 1`) so we implement the [`fmt.Stringer`](https://pkg.go.dev/fmt#Stringer) interface so that we can print the suit as ♥, ♦, ♣, or ♠ and a `ParseSuit` function so we can easily convert a string to a `Suit`. We then get the best of both worlds: a compact enum that can be typechecked by the compiler and a string representation that we can read and understand.

All is well and we can implement our `Card` type:

```go
type Card struct {
	Value uint8 `json:"value"`
	Suit  Suit  `json:"suit"`
}
```

But when we attempt to marshal our card as JSON:

```go
card := &Card{Value: 7, Suit: Spades}
data, _ := json.Marshal(card)
fmt.Println(string(data))
```

We get the following result:

```json
{"value":7,"suit":4}
```

We just did a bunch of work to be able to represent our `Suit` as a string, but the `encoding/json` package ignores it -- this is because we need to customize how JSON is created from our type. To do so, we must implement the [`json.Marshaler`](https://pkg.go.dev/encoding/json#Marshaler) interface:

```go
func (s Suit) MarshalJSON() ([]byte, error) {
	return json.Marshal(s.String())
}
```

The `MarshalJSON` function converts the `Suit` into a string, then JSON-marshals the string so that the output is valid JSON: `[]byte("\"♠\"")` (quotation marks included). The most important thing to remember is that the method has a _value_ receiver not a _pointer_ receiver -- more on this later. Implementing this method for our `Suit` object now marshals the following JSON data:

```json
{"value":7,"suit":"♠"}
```

Of course, if we try to Unmarshal this data, we will get an error "json: cannot unmarshal string into Go value of type main.Suit" because `"♠"` cannot be converted to a `uint8` and then to our `Suit` type. To deal with our custom marshaled JSON data, we'll also have to implement the [`json.Unmarshaler`](https://pkg.go.dev/encoding/json#Unmarshaler) interface:

```go
func (s *Suit) UnmarshalJSON(data []byte) (err error) {
	var suits string
	if err := json.Unmarshal(data, &suits); err != nil {
		return err
	}
	if *s, err = ParseSuit(suits); err != nil {
		return err
	}
	return nil
}
```

This function is slightly more complicated, so we'll go through it step by step. First, we declare a string variable `suits` and unmarshal the data into the string -- this is possible because we expect the data to be the JSON string `"♠"` (quotation marks included). Once we've unmarshaled this intermediate type, we can then use the `ParseSuit` function to convert it into a `Suit` object -- but then what do we do with it? The short answer is that we have to use [pointer indirection](https://go.dev/tour/methods/6) to assign the method receiver variable the value returned from `ParseSuit`. The long answer follows.

## Pointers, Values, and Reflection in JSON Serialization

The `*` operator in this context is the [indirection operator (or dereference operator)](https://en.wikipedia.org/wiki/Dereference_operator). It is an operator that works on `pointer` variables to get access to the value of the variable stored in the memory address (e.g. it is an indirect way to access the value). It is the opposite of the `&` operator, which is the "address-of" operator that returns the pointer to the given value. Besides what these operators do, it is also important to understand [method receivers](https://go.dev/tour/methods/4) in Golang, which can be either pointer or value receivers depending on the type defined in the method signature.

The `UnmarshalJSON` function is a method, meaning it is a function that has an object receiver. Because `UnmarshalJSON` only returns an error -- it is up to us to unmarshal the data into the receiver (e.g. modify the receiver value as the unmarshaled object). This means we have a choice, we can implement the `UnmarshalJSON` method with either a value receiver:

```
func (s Suit) UnmarshalJSON(data []byte) error
```

or a pointer receiver:

```
func (s *Suit) UnmarshalJSON(data []byte) error
```

Although these method signatures are different by one character, the receiver type has a large impact on how the code behaves. If you attempt to use the pointer indirection with a value receiver:

```go
func (s Suit) UnmarshalJSON(data []byte) (err error) {
	// ...
	if *s, err = ParseSuit(suits); err != nil {
		return err
	}
	return nil
}
```

The compiler will complain with the following error: "invalid operation: cannot indirect s (variable of type Suit)". However, if you don't indirect:

```go
func (s Suit) UnmarshalJSON(data []byte) (err error) {
	// ...
	if s, err = ParseSuit(suits); err != nil {
		return err
	}
	return nil
}
```

Then a copy of the value is passed into the `UnmarshalJSON` method and the original variable is not modified. This means that the `Suit` on the card you're trying to unmarshal will remain zero-valued:

```go
card := &Card{}
json.Unmarshal([]byte(`{"value": 12, "suit": "♥"}`))
card.Suit == Suit(0)
```

The `UnmarshalJSON` was called successfully but the `card.Suit` variable was never touched by the value receiver. This means that **the _only_ way to handle `UnmarshalJSON` is with a pointer receiver and indirection of the unmarshaled value** (or direct modification of the values in the pointer).

The [rule of thumb](https://go.dev/tour/methods/8) for implementing value or pointer receivers is as follows:

> In general, all methods on a given type should have either value or pointer receivers, but not a mixture of both.

However, we implemented our `MarshalJSON` function as a value receiver ... what gives?

This is where [reflection](https://en.wikipedia.org/wiki/Reflective_programming) enters the picture. The `encoding/json` package makes heavy use of the [`reflect`](https://pkg.go.dev/reflect) package to examine arbitrary types, determine if those types implement the interfaces we defined in the previous section, get access to struct tags, and more.

Remember that we defined our `Card` type as follows:

```go
type Card struct {
    Value uint8
    Suit Suit
}
```

The property `Suit` on the `Card` is of type `Suit` -- a value and not a pointer (`*Suit`). If we implemented our `MarshalJSON` method with a pointer receiver, you would notice something odd happen:

```go
func (s *Suit) MarshalJSON() ([]byte, error) {
	panic("this should not work")
}
```

```go
data, _ := json.Marshal(Spades)
fmt.Println(string(data))
```

The output is `3` and the panic is never triggered. In order to trigger the panic you would have to do the following:

```go
spades := Spades
data, _ := json.Marshal(&spades)
fmt.Println(string(data))
```

In the first case we're passing a value to the `json.Marshal` method and in the second case we're passing a pointer. (We have to assign the constant `Spades` to a variable `spades` because we cannot use `&` on a constant -- this allows us to pass the address-of the pointer to the `json.Marshal` method.)

In order to use reflection to determine if a variable implements the `json.Marshaler` interface, it has to determine if the `MarshalJSON` is in the [method set](http://golang.org/ref/spec#Method_sets) of the variable. When using the pointer receiver, it is in the method set of `*Suit` but not `Suit` and when using the value receiver, it is in the method set of `Suit` not `*Suit`.

Enums are usually treated as values since they are simple integers, e.g. it is preferable to use `Suit` rather than `*Suit` for the same reason it is preferable to use `int` rather than `*int`. Although the pointer receiver of `MarshalJSON` for the enum would work in 98% of cases, the 2% of cases it doesn't work would cause frustrating bugs that would be hard to diagnose, therefore I believe **in the case of enum JSON serialization, mixing pointer and value method receivers is an exception to the normal rule of thumb**.

## Sidebar: Marshaling Cards

To wrap up, I'd like to discuss a couple of notes on the `Card` struct. First why did we add `UnmarshalJSON` and `MarshalJSON` to the enum `Suit` instead of to `Card`? Here I'll introduce another rule of thumb: **implement the JSON Marshaler and Unmarshaler methods on the smallest possible type that needs custom serialization**. JSON data is usually very nested data with lots of different types and subtypes. To make your custom types more flexible (e.g. using `Suit` in objects besides `Card`), you'll want each type to handle it's own marshaling and unmarshaling rather than requiring the parent type to do it.

Second, if you tried marshaling the `Card` in the case above where `Suit` had a pointer receiver to `MarshalJSON`, you may have noticed that the code worked. I mentioned that in 2% of the cases the pointer receiver would not work, one of those cases is if you add a `MarshalJSON` method to `Card` and you attempt to create an intermediate value for the representation:

```go
func (c *Card) MarshalJSON() ([]byte, error) {
	middle := make(map[string]interface{})
	middle["value"] = c.Value
	middle["suit"] = c.Suit
	return json.Marshal(middle)
}
```

As discussed in the previous section, `c.Suit` is assigned to the type `interface{}`, so when the JSON reflection inspects its method set, it cannot find the pointer receiver of `MarshalJSON`. Without this method, the `c.Suit` type is `Suit`, so the JSON reflection can directly assert if the type implements `Marshaler`.

Finally - what about custom unmarshaling of a `struct`, are there any gotchas there? Consider if we want to do custom validation of our card during unmarshal and return an error if the card is not valid (not the best design pattern, but used to illustrate a point):

```go
func (c *Card) UnmarshalJSON(data []byte) error {
    if err = json.Unmarshal(data, c); err != nil {
        return err
    }
    if c.Value < 1 || c.Value > 13 {
        return errors.New("not a valid card value")
    }
    return nil
}
```

This code will return a stack overflow because of the infinite recursive call to `UnmarshalJSON` - e.g. calling `json.Unmarshal(data, card)` will call `c.UnmarshalJSON(data)`, which will call `json.Unmarshal(data, c)` which will call `c.UnmarshalJSON(data)` and so on until the maximum recursion depth is reached and a stack overflow occurs. To solve this problem, an [_anonymous struct_](https://talks.golang.org/2012/10things.slide#2) is required:

```go
func (c *Card) UnmarshalJSON(data []byte) error {
    cs := struct{
        Value uint8 `json:"value"`
        Suit  Suit  `json:"suit"`
    }{}

    if err = json.Unmarshal(data, &cs); err != nil {
        return err
    }

    if cs.Value < 1 || cs.Value > 13 {
        return errors.New("not a valid card value")
    }

    c.Value = cs.Value
    c.Suit = cs.Suit
    return nil
}
```

Duplicating struct definitions will often make maintenance harder, but this is sometimes necessary, particularly in the case of generated code that does not allow you to implement your own `json` struct tags (e.g. protocol buffers).

## Conclusion

When you define your own types in Go and you want control over how those types are serialized and deserialized into JSON - the `Marshaler` and `Unmarshaler` interfaces give you a lot of flexibility. However, knowing and understanding pointers, values, indirection, and receivers is essential to correctly implementing these interfaces -- and common wisdom can sometimes lead to tripping hazards. In particular, when dealing with enumerations or other primitive type aliases, the rule of thumb to use all pointer or all value receivers does not hold, and instead mixed receiver types are your best bet.