# New Set methods

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
      * [Polyfill](#polyfill)
    * [Set.prototype.map(func, thisArg)](#setprototypemapfunc-thisarg)
      * [Polyfill](#polyfill-1)
      * [Discussion](#discussion)
    * [Set.prototype.some(predicate, thisArg)](#setprototypesomepredicate-thisarg)
      * [Polyfill](#polyfill-2)
    * [Set.prototype.find(predicate, thisArg)](#setprototypefindpredicate-thisarg)
      * [Polyfill](#polyfill-3)
    * [Set.prototype.every(predicate, thisArg)](#setprototypeeverypredicate-thisarg)
      * [Polyfill](#polyfill-4)
    * [Set.prototype.intersect](#setprototypeintersect)
      * [Polyfill (single Set)](#polyfill-single-set)
    * [Set.prototype.union](#setprototypeunion)
    * [Set.prototype.xor](#setprototypexor)
      * [Polyfill (single Set)](#polyfill-single-set-1)
    * [Set.prototype.relativeComplement](#setprototyperelativecomplement)
      * [Polyfill (single iterable)](#polyfill-single-iterable)
    * [Set.prototype.addElements](#setprototypeaddelements)
      * [Polyfill](#polyfill-5)
    * [Set.prototype.removeElements](#setprototyperemoveelements)
      * [Polyfill](#polyfill-6)

Created by [gh-md-toc](https://github.com/ekalinin/github-markdown-toc)



# (Semi)relevant previous discussions

* https://github.com/tc39/ecma262/pull/13
* https://esdiscuss.org/notes/2014-11-19
* https://esdiscuss.org/topic/map-filter-map-and-more

# Why not `%IteratorPrototype%` methods

* using iterators is verbose - compare `new Set(set.entries().filter(fn))` to `set.filter(fn)`. 19 characters of boilerplate. 
Even small code base can have hundreds occurrences of this pattern - and hundreds places to make a mistake.
* iterators seems to be rather ignored in articles/books regarding ES6

## Alternative

* Add methods to `%SetIteratorPrototype%` or even more generic `%IteratorPrototype%` and make `Set` methods to use them.
    * Allows for better optimization for many cases (no intermediate collections)
    * Can be delayed - `Set` methods can be changed in future to internally use `%SetIteratorPrototype%` and it wouldn't break web 
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
* reduces need to depend on better endowed [Immutable.js `Set<T>`](https://facebook.github.io/immutable-js/docs/#/Set) (why do we have to depend on external library to have sane collections?)
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
* Best possible performance in many cases
* Inflexible

## Multiple Sets
* Superior performance to iterables solution

## Single iterable
* Common use case
* Quite good performance
* Similar to [LINQ `.intersect` method](https://msdn.microsoft.com/en-us/library/bb460136(v=vs.100).aspx)

## Multiple iterables
* Interoperable with `Immutable.js`
* Worst performance
* Can require conversion of it's arguments to Sets.

Single `Set` seems to be most common use case and it's easiest to optimize (requires `O(MIN(a.size,b.size))` operations). Multiple `Sets` are fine too.
Using "multiple iterables" approach the best achievable complexity is `O(a1.size+a2.size+a3.size+...+an.size)`. 

For consistency with `Immutable.js` it's preferred to allow **multiple iterables**.

# Proposal

## Set.isSet

Not polyfillable. Checks presence of internal property ``[[SetData]]``.


## Set.prototype.filter(predicate, thisArg)
`.filter` method creates new `Set` instance that doesn't contain elements that doesn't match predicate.

### Polyfill

```javascript
Set.prototype.filter = function filter(predicate, thisArg=null) {
    assert(typeof predicate === 'function');
    assert(Set.isSet(this));
    const ret = new (Object.getPrototypeOf(this).constructor[Symbol.species]);
    for(const element of this) {
        if(Reflect.apply(predicate, thisArg, [element, element, this])) {
            ret.add(element)
        }
    }
    return ret;
}
```

## Set.prototype.map(func, thisArg)
`.map` method creates new `Set` instance with the results of calling a provided function on every element in this set.

### Polyfill

```javascript
Set.prototype.map = function map(mapFunction, thisArg=null) {
    assert(typeof predicate === 'function');
    assert(Set.isSet(this));
    const ret = new (Object.getPrototypeOf(this).constructor[Symbol.species]);
    for(const element of this) {
        ret.add(Reflect.apply(mapFunction, thisArg, [element, element, this]))
    }
    return ret;
}
```

### Discussion
* `source.size` doesn't have to equal `result.size`. This can be confusing to some developers.


## Set.prototype.some(predicate, thisArg)
`.some` method is analogous to `Array.prototype.some`.

### Polyfill
```javascript
Set.prototype.some = function some(predicate, thisArg=null) {
    assert(typeof predicate === 'function');
    assert(Set.isSet(this));
    for(const element of this) {
        if(Reflect.apply(predicate, thisArg, [element, element, this])) {
            return true;
        }
    }
    return false;
}
```

## Set.prototype.find(predicate, thisArg)
`.find` method is analogous to `Array.prototype.find`.

### Polyfill
```javascript
Set.prototype.find = function find(predicate, thisArg=null) {
    assert(typeof predicate === 'function');
    assert(Set.isSet(this));
    for(const element of this) {
        if(Reflect.apply(predicate, thisArg, [element, element, this])) {
            return element;
        }
    }
    return undefined;
}
```

## Set.prototype.every(predicate, thisArg)
`.every` method is analogous to `Array.prototype.every`.

### Polyfill
```javascript
Set.prototype.every = function every(predicate, thisArg=null) {
    assert(typeof predicate === 'function');
    assert(Set.isSet(this));
    let i = 0;
    for(const element of this) {
        if(!Reflect.apply(predicate, thisArg, [element, element, this])) {
            return false;
        }
    }
    return true;
}
```

## Set.prototype.intersect
`.intersect` method creates new `Set` instance by mathematical set intersect operation.
![Venn diagram for intersect](https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Venn0001.svg/384px-Venn0001.svg.png)


### Polyfill (single Set)

```javascript
Set.prototype.intersect = function intersect(otherSet) {
    assert(Set.isSet(this));
    assert(Set.isSet(otherSet));
    const subConstructor = Object.getPrototypeOf(this).constructor[Symbol.species]; // readability
    const ret = new subConstructor();
    for(const element of this) {
        if(otherSet.has(element)) {
            ret.add(element);
        }
    }
    return ret;
}
```

## Set.prototype.union
`.union` method creates new `Set` instance by mathematical set union operation.
![Venn diagram for union](https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Venn0111.svg/384px-Venn0111.svg.png)

## Set.prototype.xor
Alternative name: `.symmetricDifference`;
![Venn diagram for xor](https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Venn0110.svg/384px-Venn0110.svg.png)

### Polyfill (single Set)
```javascript
Set.prototype.xor =  function(otherSet) {
    assert(Set.isSet(this));
    assert(Set.isSet(otherSet));
    const subConstructor = Object.getPrototypeOf(this).constructor[Symbol.species]; // readability
    const ret = new subConstructor();
    for(const element of otherSet) {
        if(!this.has(element))
           ret.add(element);
    }
    for(const element of this) {
        if(!otherSet.has(element))
           ret.add(element);
    }
    return ret;
}
```


## Set.prototype.relativeComplement
`.relativeComplement` method constructs new `Set`, relative complement of argument to `this`.
![Venn diagram for relativeComplement](https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Venn0010.svg/384px-Venn0010.svg.png)

### Polyfill (single iterable)
```javascript
Set.prototype.relativeComplement = function relativeComplement(iterable) {
    assert(Set.isSet(this));
    const subConstructor = Object.getPrototypeOf(this).constructor[Symbol.species]; // readability
    const ret = new subConstructor(this);
    for(const element of iterable) {
        if(ret.has(element))
           ret.delete(element);
    }
    return ret;
}
```

## Set.prototype.addElements
`.addElements` add all of it's argument to current `Set`.

### Polyfill

```javascript
Set.prototype.addElements = function addElements(...args) {
    assert(Set.isSet(this));
    for(const element of args) {
        this.add(element);
    }
    return this;
}
```

## Set.prototype.removeElements
`.removeElements` is easy way to remove many elements from `Set`.

### Polyfill

```javascript
Set.prototype.removeElements = function removeElements(...args) {
    assert(Set.isSet(this));
    for(const element of args) {
        this.remove(element);
    }
    return this;
}
```

