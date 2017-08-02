# New Set methods

See [formal spec WIP](https://ginden.github.io/set-methods/).

Table of Contents
=================

  * [New Set methods](#new-set-methods)
  * [Table of Contents](#table-of-contents)
  * [(Semi)relevant previous discussions](#semirelevant-previous-discussions)
  * [Why not %IteratorPrototype% methods](#why-not-iteratorprototype-methods)
    * [Alternative](#alternative)
  * [Advantages of proposal](#advantages-of-proposal)
  * [.union, .intersect, .xor, .relativeComplement desired signature](#union-intersect-xor-relativecomplement-desired-signature)
    * [Single Set](#single-set)
    * [Multiple Sets](#multiple-sets)
    * [Single iterable](#single-iterable)
    * [Multiple iterables](#multiple-iterables)
  * [Proposal](#proposal)
    * [Set.isSet](#setisset)
    * [Set.prototype.filter(predicate, thisArg)](#setprototypefilterpredicate-thisarg)
    * [Set.prototype.map(func, thisArg)](#setprototypemapfunc-thisarg)
      * [Discussion](#discussion)
    * [Set.prototype.some(predicate, thisArg)](#setprototypesomepredicate-thisarg)
    * [Set.prototype.find(predicate, thisArg)](#setprototypefindpredicate-thisarg)
    * [Set.prototype.every(predicate, thisArg)](#setprototypeeverypredicate-thisarg)
    * [Set.prototype.intersect](#setprototypeintersect)
    * [Set.prototype.union](#setprototypeunion)
    * [Set.prototype.xor](#setprototypexor)
    * [Set.prototype.relativeComplement](#setprototyperelativecomplement)
    * [Set.prototype.addElements](#setprototypeaddelements)
    * [Set.prototype.removeElements](#setprototyperemoveelements)

Created by [gh-md-toc](https://github.com/ekalinin/github-markdown-toc)

# (Semi)relevant previous discussions

* [Map#map and Map#filter](https://github.com/tc39/ecma262/pull/13)
* [Map.prototype.map and Map.prototype.filter (spec) + Set](https://esdiscuss.org/notes/2014-11-19)
* [Map: filter/map and more](https://esdiscuss.org/topic/map-filter-map-and-more)
* [Original topic regarding this proposal](https://esdiscuss.org/topic/new-set-prototype-methods)

# Why not `%IteratorPrototype%` methods

* Explicit usage of iterators is verbose - compare `new Set(set.entries().filter(fn))` to `set.filter(fn)`. 19 characters of boilerplate.
Even small code base can have hundreds occurrences of this pattern - and hundreds places to make a mistake.

## Alternative

* Add methods to `%SetIteratorPrototype%` or even more generic `%IteratorPrototype%` and make `Set` methods to use them.
    * Allows for better optimization for many cases (no intermediate collections)
    * **Can be delayed** - `Set` methods can be changed in future to internally use `%SetIteratorPrototype%` and it wouldn't break web
    (except for code that subclass `Set` **and** redefines `.entries` method to not use `%SetIteratorPrototype%`)
   * Preferred method, but standardization can be painful - especially because transpilers doesn't support `%IteratorPrototype%`,
    so passing "old" transpiled iterator to "new" code can break violently.
    
    
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

# `.union`, `.intersect`, `.xor`, `.relativeComplement` desired signature

Signature of these functions isn't obvious. They can accept
* single Set
* multiple Sets
* single iterable
* multiple iterables

## Single Set
* Most common use case (?)
* Best possible performance in many cases in certain cases
* Inflexible

## Multiple Sets
* Superior performance to iterables solution

## Single iterable
* Common use case
* Similar to [LINQ `.intersect` method](https://msdn.microsoft.com/en-us/library/bb460136(v=vs.100).aspx)

## Multiple iterables
* Interoperable with `Immutable.js`
* Can require conversion of it's arguments to Sets.

Single `Set` should be easiest to optimize (requires `O(MIN(a.size,b.size))` operations).

Using "multiple iterables" approach the best achievable complexity is `O(a1.size+a2.size+a3.size+...+an.size)`. 

Single iterable approach is simplistic and solves most common use cases.

For consistency with `Immutable.js` it's preferred to choose **multiple iterables**.

# Proposal

## Set.isSet


Not polyfillable. Checks presence of internal property ``[[SetData]]``. [Source code for hacky way](https://github.com/Ginden/set-methods/blob/master/polyfill.js#L11).

## Set.prototype.filter(predicate, thisArg)
`.filter` method creates new `Set` instance that doesn't contain elements that doesn't match predicate.
* [Code](https://github.com/Ginden/set-methods/blob/master/polyfill.js#L34)

## Set.prototype.map(func, thisArg)
`.map` method creates new `Set` instance with the results of calling a provided function on every element in this set.
* [Code](https://github.com/Ginden/set-methods/blob/master/polyfill.js#L46)

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

## Set.prototype.xor
Alternative name: `.symmetricDifference`;

## Set.prototype.minus(...iterables)
`.minus` method constructs new `Set` without elements present in iterables.

## Set.prototype.addElements(...elements)
`.addElements` add all of it's arguments to current `Set`.

## Set.prototype.removeElements(...elements)
`.removeElements` is easy way to remove many elements from `Set`.

## Set.isSupersetOf(iterable)
Checks if `this` is superset of `iterable`