---
title: 'Getting Started with RxJS: Basics and Subscriptions'
date: '2023-07-06'
tags: ['rxjs', 'javascript', 'reactive programming', 'observables', 'subscriptions']
draft: False
summary: Learn the basics of rxjs and subscriptions.
---

# Getting Started with RxJS: Basics and Subscriptions

RxJS is a library for composing asynchronous and event-based programs by using observable sequences. If you're working on JavaScript projects that handle complex asynchronous operations, this library might just be the perfect tool for your toolbox. Today, we'll delve into the basics of RxJS and understand how subscriptions work.

## What is RxJS?

RxJS (Reactive Extensions for JavaScript) is a library for reactive programming that makes it easier to compose asynchronous or callback-based code. It introduces a new primitive into JavaScript, the `Observable`, to make these operations more manageable.

## Observables

In RxJS, Observables are lazy Push collections of multiple values. They fill a critical gap by being the ideal way to handle a series of values produced asynchronously or synchronously.

Here's a simple Observable creation:

```javascript
import { Observable } from 'rxjs'

const observable = new Observable((subscriber) => {
  subscriber.next('Hello')
  subscriber.next('World')
  subscriber.complete()
})
```

In this example, the `Observable` constructor takes one argument: a callback that is executed when a consumer subscribes to it. This callback function is given an `Observer` (the subscriber), to which new values can be `next`ed, an error method can be called, or the completion of the values can be signaled.

## Subscriptions

Subscriptions in RxJS are what link an `Observable` with the code to react to the values delivered by the `Observable`.

```javascript
const subscription = observable.subscribe({
  next: (value) => console.log(value),
  error: (err) => console.error('Something went wrong: ' + err),
  complete: () => console.log('Done'),
})
```

This will log:

```
Hello
World
Done
```

A `Subscription` effectively just has a `unsubscribe()` function to release resources or cancel Observable executions.

```javascript
subscription.unsubscribe()
```

## Operators

Operators are pure functions that enable a functional programming style of dealing with collections with operations like `map`, `filter`, `concat`, `reduce`, etc.

Here's an example with the `map` operator:

```javascript
import { of } from 'rxjs'
import { map } from 'rxjs/operators'

const nums = of(1, 2, 3, 4, 5)

const squareValues = nums.pipe(map((val) => val * val))
squareValues.subscribe((val) => console.log(val))
```

This will log:

```
1
4
9
16
25
```

## Error Handling

In a perfect world, we wouldn't need to handle errors. But that's not the case. RxJS provides mechanisms to handle errors effectively. When an error occurs, the `Observable` stops execution and sends the error down the stream.

```javascript
import { throwError } from 'rxjs'

const source = throwError('This is an error!')

source.subscribe({
  next: (value) => console.log(value), // this will not be called
  error: (err) => console.error('Something went wrong: ' + err),
  complete: () => console.log('Done'), // this will not be called
})
```

This will log:

```
Something went wrong: This is an error!
```

## Conclusion

This introduction should give you a decent understanding of what RxJS is, and how to use Observables and Subscriptions. However, RxJS is a large library with lots to explore.
