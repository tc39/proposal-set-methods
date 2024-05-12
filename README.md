# Set Methods for JavaScript

This is a proposal to add methods like union and intersection to JavaScript's built-in `Set` class.

It is currently at stage 3.

## Proposal

This would add the following methods:

  * `Set.prototype.intersection(other)`
  * `Set.prototype.union(other)`
  * `Set.prototype.difference(other)`
  * `Set.prototype.symmetricDifference(other)`
  * `Set.prototype.isSubsetOf(other)`
  * `Set.prototype.isSupersetOf(other)`
  * `Set.prototype.isDisjointFrom(other)`

These methods would all require their arguments to be a Set, or at least something which looks like a Set in terms of having a numeric `size` property as well as `keys` and `has` methods.

See [details.md](./details.md) for details of current decisions made in this proposal.

Rendered spec text is available [here](https://tc39.es/proposal-set-methods/).

## Implementations

This proposal is ready for engines to implement and ship. See [this issue](https://github.com/tc39/proposal-set-methods/issues/78) for current status.

## TC39 meeting notes

* [May 2018](https://github.com/tc39/notes/blob/8711614630f631cb51dfb803caa087bedfc051a3/meetings/2018-05/may-22.md#set-methods)
* [January 2019](https://github.com/tc39/notes/blob/8711614630f631cb51dfb803caa087bedfc051a3/meetings/2019-01/jan-29.md#update-on-set-methods)
* [March 2022](https://github.com/tc39/notes/blob/6f7e075341e435f22777b07a3ee5141442d2d8a7/meetings/2022-03/mar-31.md#extending-built-ins) - discussion of how to extend built-ins in general
* [July 2022](https://github.com/tc39/notes/blob/6f7e075341e435f22777b07a3ee5141442d2d8a7/meetings/2022-07/jul-20.md#set-methods-how-to-access-properties-of-the-argument)
* [September 2022](https://github.com/tc39/notes/blob/65a82252aa14c273082e7687c6712bb561bc087a/meetings/2022-09/sep-14.md#set-methods-part-iii)
* [November 2022](https://github.com/tc39/notes/blob/36635060482b1b27bcaff3c950dd9f7b31492dab/meetings/2022-11/nov-30.md#set-methods)

## (Semi)relevant previous discussions

* [proposal-rm-builtin-subclassing](https://github.com/tc39/proposal-rm-builtin-subclassing)
* [Map#map and Map#filter](https://github.com/tc39/ecma262/pull/13)
* [Map.prototype.map and Map.prototype.filter (spec) + Set](https://esdiscuss.org/notes/2014-11-19)
* [Map: filter/map and more](https://esdiscuss.org/topic/map-filter-map-and-more)
* [Original topic regarding this proposal](https://esdiscuss.org/topic/new-set-prototype-methods)
* [Newer topic regarding this proposal](https://esdiscuss.org/topic/new-set-methods-again)


## Comparison with other languages

See [other languages document](./other-languages.md) to get overview of `Set` methods in other languages.

## Naming

See [naming bikeshedding](./name-bikeshedding.md) document for details.

We decided to choose:

* **Symmetric difference** - **`symmetricDifference`**
* **Intersection** - **`intersection`**
* **Union** - **`union`**
* **Difference** - **`difference`**

## Polyfills

 - [core-js](https://github.com/zloirock/core-js#new-set-methods)
 - [es-shims](https://github.com/es-shims):
   - [difference](https://npmjs.com/set.prototype.difference)
   - [intersection](https://npmjs.com/set.prototype.intersection)
   - [symmetricDifference](https://npmjs.com/set.prototype.symmetricdifference)
   - [union](https://npmjs.com/set.prototype.union)
   - [isDisjointFrom](https://npmjs.com/set.prototype.isdisjointfrom)
   - [isSubsetOf](https://npmjs.com/set.prototype.issubsetof)
   - [isSupersetOf](https://npmjs.com/set.prototype.issupersetof)
