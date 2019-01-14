# New Set methods

See [formal spec WIP](https://tc39.github.io/proposal-set-methods/).

See [proposal extending Set and Map with Array-like methods](https://github.com/tc39/proposal-collection-methods).

# Proposal

This proposal does not change syntax of language. 

New methods based on set theory are added to `Set.prototype`.

  * `Set.prototype.intersection(iterable)` - method creates new `Set` instance by set intersection operation.
  * `Set.prototype.union(iterable)` - method creates new `Set` instance by set union operation.
  * `Set.prototype.difference(iterable)` - method creates new `Set` without elements present in `iterable`.
  * `Set.prototype.symmetricDifference(iterable)` - returns `Set` of elements found only in either `this` or in `iterable`.
  * `Set.prototype.isSubsetOf(iterable)`
  * `Set.prototype.isDisjointFrom(iterable)`
  * `Set.prototype.isSupersetOf(iterable)`




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

See [other languages document](./other-languages.md) to get overview of `Set` methods in other languages.


    
## Not included in this proposal but worth considering

* Static `Set.union(...iterables)`, `Set.intersection(...iterables)`

## Polyfill

* [core-js/packages/core-js/features/set/](https://github.com/zloirock/core-js/tree/master/packages/core-js/features/set)
* [set-extensions](https://github.com/jankapunkt/js-set-extension)

## Naming

See [naming bikeshedding](./name-bikeshedding.md) document for details.

We decided to choose:

* **Symmetric difference** - **`symmetricDifference`**
* **Intersection** - **`intersection`**
* **Union** - **`union`**
* **Difference** - **`difference`**

