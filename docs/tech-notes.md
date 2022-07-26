---
layout: page
title: "Tech Notes"
date: 2022-07-11
version: 0.2.0
categories: tech
---

# Languages

## Go

### Overview

I tend to reach to Go when the problem at hand requires its low memory footprint and speed. This is not
very often. These notes are to help me reload some of its fundamental concepts to mind.

### App Structure

Default to the [following](https://github.com/nkabbara/goapp) structure. Otherwise, follow org's guidelines.

### Semantics

Heuristic in building stuff in Go from a data driven lens:

1. Understand & define your data
2. Define your types
3. Pick a semantic. Value or pointer.
4. Write functions to work on the data, then methods if need be.

Don't go the usual OO way of modeling real world object with data and behavior. Go is data oriented.

**Some guidelines to pick a semantic as your work your app:**

Use value semantics for built-in types (int, float, string, etc...).
Exceptions: when defining structs that point to external systems that have nil values like a db schema for example.

Use value semantics for reference types (array, slice, map, etc...).
Exceptions: except for decoding or marshalling. When your method has decode or marshall in the name that's a clue.

Make a decision for your struct types and go with it. Remember, you may refactor your api later if you feel like you've picked the wrong semantic. The important thing is to stick with one design and don't mix it up. Don't get stuck on picking a semantic. Consistency is what we're after.

A question to ask to help decide on semantics: when we change the data, is it still the same data, but mutated? Or is it a completely new instance of the thing? When you go with pointer semantics, you're saying the data is shared.

Use pointer semantics in your `forr` loops if you're dealing with pointer semantics.

Never make copies of the value the pointer is pointing to. Using a pointer is a signal that something is going to change it.

### Types

Data drives the design in Go. You think about the data first, then design types around them, then add method to manipulate them. No clear understanding of your data, no code. A clear example of this is how you define custom types in Go. Before you create functions, you first create the data. Then create functions around them. Compare this to Ruby classes & JS prototypes.

Go does conversions, not casting. This relates to how you modify variables. Say you want to increase the size of an array, Go will create a new bigger array and copy values over. It won't increase the size of the current array. You need to be aware of this because it affects performance.

To convert between built-in types and custom types, you must do so explicitly (see spec for algo). Go won't implicitly convert between the two. But if you're assigning a literal type to a compatible named type, conversion will happen.

```
type struct Foo {
  foo int
}

type struct Bar {
  foo int
}

myFoo := Foo{1}
myBar := Bar(myFoo) //convert explicitly
```

Structs don't have to be named types, which is very useful for ephemeral data, like say a payload of an http request. Build it with an anonymous struct to pass it around.

```
foo := struct {
  a int
  b string
}{2, "foo"}
```

Go has a concept of promotion. When you do something like 3+3.5 on a constant, it type is promoted from int to float. Also, constants are 256bits! Beware when you assign them to your variables.

Checkout `iota`, a mechanism to increment values defined in a constant block.

```
const (
    C0 = iota
    C1 = iota
    C2 = iota
)

fmt.Println(C0, C1, C2) // "0 1 2"
```

Go only provides, array, map and slice as a data structure. Default to slice unless there's a good reason not to.

#### Slices

Slice is a reference type, like interfaces, channels, maps, and functions. It's a data structure with a pointer pointing to a backing array and its zero value is nil. It kinda looks like [pointer, capacity, length]. When you pass slices (and any reference type around), you're making copies of this structure and not of the underlying backing array.

An empty slice is different than a zero value slice. The former is `[nil, 0, 0]` and the latter is `[SomeType, x, y]` where x is not 0.

You increase the size of a slice with append.

```
mySlice := []string{"hello", "world"}
fmt.Printf("%d\n", len(mySlice)) //2

mySlice = append(mySlice, ".")
fmt.Printf("%d\n", len(mySlice)) //3
```

This of slice as window into a backing array. `mySlice[2:4]` is a view of the backing array starting from 3rd element to the 4th element. 4 is the 5th element, but the end index is exclusive.

If you don't know the size of your slice, you should not use a slice.

Remember, that when you modify a slice, that everything that has copies to it changes since it has the same backing array. If you want an immutable copy,
use `copy` or re-slice with a third index. When you see an `append` always, ask, what else is using that backing array?

```
mySlice := []string{"hello", "world"}
fmt.Printf("%p\n", mySlice)

wowSlice := mySlice[0:len(mySlice):2] //A new backing array is created.
fmt.Printf("%p\n", &wowSlice)

// slice[ i : j : k ]
// Length:   j - i
// Capacity: k - i
```

Ranging over slices can be though of as value semantics vs. pointer semantics. When you range with v-semantics,
ie, `for i, v := range mySlc` the loop is making a copy of the slice structure ([type, cap, len]). So modifying
the slice inside the loop is fine (this is for both semantics). It'll modify the backing array, but Go will loop using the len property. So
we won't overflow. Modifying `v` is file since it's a copy of the value from the slice.

```
mySlc := []int{1, 2, 3, 4, 5}
fmt.Printf("mySlc len: %d\n", len(mySlc))

for i, v := range mySlc {
  fmt.Printf("Iteration # %d for %d\n", i, v)
  mySlc = append(mySlc, 0)
  v = v + 1 //This doesn't modify backing array.
}

fmt.Printf("mySlc len: %d\n", len(mySlc))

// mySlc len: 5
// Iteration # 0 for 1
// Iteration # 1 for 2
// Iteration # 2 for 3
// Iteration # 3 for 4
// Iteration # 4 for 5
// mySlc len: 10
// mySlc: [1 2 3 4 5 0 0 0 0 0]
```

Ranging using p-semantics will of course modify the underlying array value. Beware of this if array is shared.

#### Maps

Maps are created literally or with make.

```
//Literal
mySlc := map[string]int{
  "one": 1,
  "two": 2,
}
fmt.Printf("mySlc len: %v\n", mySlc)

var myMap map[string]int
//Make
myMap = make(map[string]int)
myMap["one"] = 1
myMap["two"] = 2

fmt.Printf("myMap: %v", myMap)
```

Maps are random. You can't depend on order of initialization or data assignment. You may use the sort
package to sort the keys in the map, then access them by the sorted keys. An example of place where I miss Ruby.

#### Passing Data

The default in Go is pass by value. When you call a function with arguments, copies of the values of the arguments are made and assigned in the function's body. Compare to ruby pass by reference-value. Each frame on the stack will have it's own copy.

If you pass by reference, you're now crossing function boundaries. One function can modify the data in another function (fames sharing data). This is fine, but be aware that when you do so, you're trusting the sub-frame to not mess with our invariants.

Tradeoffs: value semantics are costly because we're making copies of the data, but the data is safe. Pointer symantics is efficient because we're sharing the data, but it could get corrupt if we're not clear about our design.

A pointer type doesn't represent the type. It represents the address of that type.

#### Zero Value

When you initialize a variable with the `var` keyword, it gets initialized to its zero value. Different types have different zero values. For ints, it's 0, strings "", pointers, it's null. A struct that has different types, will init each of its fields to their zero value. Be aware of this during conditionals.

### Interfaces

Use types for people places and things. Interfaces for behavior.

**How to read an interface implementation:** The concrete type X now implements the Y interface using value or pointer semantics.

An interface value points to a 2 byte structure. First byte defines the type of the data and the latter either a copy or pointer to data based on semantics.

When you pass a value to a function with a pointer semantic interface, Go will freak out because it's expecting a pointer. The reason is
enforcing sharing mode. You're not supposed to mess with values if you're pointer semantic (sharing data). The opposite is not true though.
You may pass an address to a value type interface.

### Embedding

```
type Foo struct {
	FirstName string
}

type Bar struct {
  //Inner type foo is promoted tot he outer type Bar
  //This works with interfaces too.
	Foo
	LastName string
}

func main() {
	b := Bar{Foo: Foo{FirstName: "Nash"}, LastName: "Kabbara"}
  // We can access inner types fields directly
	fmt.Println(b.FirstName) //NAsh
}

```

If the outer type has the same behavior as inner type, outer type's will be used.

If multipe inner types implement the same behavior, it's ok as long as you don't call the inner type
behavior from the outher type. You'll need to use long form. `Foo.Bar.LastName`

### Functions

Functions that have a receiver are called method.

Coming from Ruby, I have a tendency to add behavior to data immediately. A better way might be to use functions first and only
add behavior to data when the data calls for it.

Methods on a value receiver work on a copy of the data. Whereas on a pointer receiver work on a shared variable. Don't make
a receiver a pointer or value based on whether it's going to be shared or not. Instead, make based on how you decided to design your
api. Did you go for value or pointer semantics with your API?

### Asides

A struct type with x bytes of data will take up more than x bytes due to compiler/os alignment. There will be padded bytes. Just FYI in case you're going crazy with data optimization. Arranging your struct fields in descending order will create less padding (don't prematurely op for this. Just FYI).

A word is the number of bits of the cpu's architecture. A word on a 32bit cpu is 4 bytes.

Three types of data in a go program: data segment (for global vars & consts & read only values), stack (contains frames for each function), heap (I think this is for data sharing among stacks, but not sure how go looks at it yet.)

When you range over a string, you're ranging over runes.

```
	myStr := "fourµ"
	for _, v := range myStr {
		fmt.Printf("%d ", utf8.RuneLen(v))
	}
  //1 1 1 1 2
```

Constants only exist to compile time. They never find themselves on a stack or on the heap. ie `const foo = 333`

# Misc

Loop on cli (bash):

```
for i in `seq 10`; do echo "myserver_$i"; done
```
