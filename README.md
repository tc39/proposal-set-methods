# New Set methods

See [formal spec WIP](https://tc39.github.io/proposal-set-methods/).

See [proposal extending Set and Map with Array-like methods](https://github.com/tc39/proposal-collection-methods).

# (Semi)relevant previous discussions

* [Map#map and Map#filter](https://github.com/tc39/ecma262/pull/13)
* [Map.prototype.map and Map.prototype.filter (spec) + Set](https://esdiscuss.org/notes/2014-11-19)
* [Map: filter/map and more](https://esdiscuss.org/topic/map-filter-map-and-more)
* [Original topic regarding this proposal](https://esdiscuss.org/topic/new-set-prototype-methods)
* [Newer topic regarding this proposal](https://esdiscuss.org/topic/new-set-methods-again)
 

# Motivations

* reduces need to depend on [Immutable.js `Set<T>`](https://facebook.github.io/immutable-js/docs/#/Set)
* reduces boilerplate code when dealing with common use cases of `Set`
* no new syntax
# Adoption

* No npm package duplicating this proposal was found
* Very similar API was found in popular [Collections.js](https://www.npmjs.com/package/collections) (205k downloads per month)
* This proposal is inspired by [Set<T> API from Immutable.js](https://facebook.github.io/immutable-js/docs/#/Set) (3M downloads per month)

## Comparision with Immutable.js

* No static `intersection`, `union` methods in this proposal
* `union`, `intersection`, `difference` takes single argument


## Comparison with other languages

### Java

Java `Set` interface is rather limited and doesn't include APIs found in this proposal.

Though, Java 8 introduces [stream API](http://docs.oracle.com/javase/8/docs/api/java/util/stream/package-summary.html) that allow to deal with arbitrary collections.

Stream API has methods from this proposal like `union` (as `concat`).

Stream API nor `Set` does not include `intersection`, `xor`.

### Other languages

* [C# `HashSet`](https://msdn.microsoft.com/en-us/library/bb359438.aspx)
* [F# - Collections.Set](https://msdn.microsoft.com/en-au/vstudio/ee340244(v=vs.89))
* [Haskell - Data.Set](http://hackage.haskell.org/package/containers-0.5.10.2/docs/Data-Set.html)
* [Python - set/frozenset](https://docs.python.org/3.6/library/stdtypes.html#set)
* [Hack - HH\Set](https://docs.hhvm.com/hack/reference/class/HH.Set/)
* [Ruby - Set](https://ruby-doc.org/stdlib-2.5.0/libdoc/set/rdoc/Set.html)

# `.union`, `.intersection` etc. desired signature

Signature of these functions isn't obvious. They can accept:

* single Set
  * best possible performance
  * would slowdown adoption
* multiple Sets
  * looks like rare use case
* Single iterable
  * Consistent with other languages (eg. [LINQ `.intersect` method](https://msdn.microsoft.com/en-us/library/bb460136(v=vs.100).aspx))
* Multiple iterables
  * Used by Immutable.js
  * Certain algorithms can be ineffective without converting arguments to `Set` instances (`intersection` without at least `log(n)` random access seems to be too slow for real world)


# Proposal

This proposal does not change syntax of language. 

New methods based on set theory are added to `Set.prototype`.

  * `Set.prototype.intersection(iterable)` - method creates new `Set` instance by set intersection operation.
  * `Set.prototype.union(iterable)` - method creates new `Set` instance by set union operation.
  * `Set.prototype.difference(iterable)` - method creates new `Set` without elements present in `iterable`.
  * `Set.prototype.symmetricDifference(iterable)` - returns `Set` of elements found only in either `this` or in `iterable`.
    
    
## Not included in this proposal but worth considering

* `Set.prototype.isSubsetOf(otherSet)`
* `Set.prototype.isSupersetOf(iterable)`
* Static `Set.union(...iterables)`, `Set.intersection(...iterables)`

## Naming

**Symmetric difference**

Proposed names: `xor`, **`symmetricDifference`**, `disjointUnion`

**Intersection**

Proposed names: `intersect`, **`intersection`**.

**Union**

Proposed names: **`union`**, `concat`.

**Difference**

Proposed names: **`difference`**, `minus`, `except`, `without`, `withoutAll`, `relativeComplement`.

