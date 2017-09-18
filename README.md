# New Set methods

See [formal spec WIP](https://ginden.github.io/set-methods/).

# (Semi)relevant previous discussions

* [Map#map and Map#filter](https://github.com/tc39/ecma262/pull/13)
* [Map.prototype.map and Map.prototype.filter (spec) + Set](https://esdiscuss.org/notes/2014-11-19)
* [Map: filter/map and more](https://esdiscuss.org/topic/map-filter-map-and-more)
* [Original topic regarding this proposal](https://esdiscuss.org/topic/new-set-prototype-methods)
* [Newer topic regarding this proposal](https://esdiscuss.org/topic/new-set-methods-again)

# Why not `%IteratorPrototype%` methods

* Explicit usage of iterators is verbose - compare `new Set(set.entries().filter(fn))` to `set.filter(fn)`. 19 characters of boilerplate.
Even small code base can have hundreds occurrences of this pattern - and hundreds places to make a mistake.

## Alternative

* Add methods to `%SetIteratorPrototype%` or even more generic `%IteratorPrototype%` and make `Set` methods to use them.
    * Allows for better optimization for many cases (no intermediate collections)
    * **Can be delayed** - `Set` methods can be changed in future to internally use `%SetIteratorPrototype%` and it's unlikely to break the web
        * Code that subclass `Set` **and** redefines `@@iterator` to not use `%SetIteratorPrototype%`
    
Example

```javascript
Set.prototype.map = function map(fn) {
    return new Set(this.entries().map(fn)); // sanity checks and proper constructor usage removed for readability purposes
}
```
 

# Advantages of proposal

* it's consistent with already familiar and *widely used* `Array` API (reduced cognitive overhead)
* reduces need to depend on [Immutable.js `Set<T>`](https://facebook.github.io/immutable-js/docs/#/Set) (why do we have to depend on external library to have sane collections?)
* reduces boilerplate code when dealing with common use cases of `Set`
* ease transition to using `Set` when refactoring old code using arrays
* no new syntax

# `.union`, `.intersect`, `.xor`, `.relativeComplement` desired signature

Signature of these functions isn't obvious. They can accept
* single Set
* multiple Sets
* single iterable
* multiple iterables

## Single Set

* Best possible performance possible
* Inflexible

## Single iterable
* Most common use case (?)
* Already used in eg. [LINQ `.intersect` method](https://msdn.microsoft.com/en-us/library/bb460136(v=vs.100).aspx)

## Multiple iterables
* Similar to `Immutable.js`
* Can require conversion of it's arguments to Sets for performance reasons

# Proposal

This proposal does not change grammar of language. 

New methods are added to objects `Set` and `Set.prototype`.

## Set.isSet

Checks presence of internal property ``[[SetData]]``.

## Set.prototype.filter(predicate, thisArg)
`.filter` method creates new `Set` instance that doesn't contain elements that doesn't match predicate.

## Set.prototype.map(func, thisArg)
`.map` method creates new `Set` instance with the results of calling a provided function on every element in this set.

## Set.prototype.some(predicate, thisArg)
`.some` method is analogous to `Array.prototype.some`.

## Set.prototype.find(predicate, thisArg)
`.find` method is analogous to `Array.prototype.find`.

## Set.prototype.every(predicate, thisArg)
`.every` method is analogous to `Array.prototype.every`.

## Set.prototype.intersect(...iterables)
`.intersect` method creates new `Set` instance by mathematical set intersect operation.

## Set.prototype.union(...iterables)
`.union` method creates new `Set` instance by mathematical set union operation.

## Set.prototype.xor(...iterables)
Alternative name: `.symmetricDifference`; Returns elements found only in one of `[this, ...iterables]`

## Set.prototype.subtract(...iterables)
`.subtract` method constructs new `Set` without elements present in `iterables`.

## Set.prototype.addElements(...elements)
`.addElements` adds many elements to `Set` instance mutating it.

## Set.prototype.removeElements(...elements)
`.removeElements` removes many elements from `Set` instance, mutating it.