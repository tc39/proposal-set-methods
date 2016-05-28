# New Set methods


## Set.isSet

Not polyfillable. Checks presence of internal property ``[[SetData]]``


## Set.prototype.filter(predicate, thisArg)
`.filter` method creates new `Set` instance that doesn't contain elements that doesn't match predicate.

### Polyfill

```
Set.prototype.filter = function filter(predicate, thisArg=null) {
    assert(typeof predicate === 'function');
    assert(Set.isSet(this));
    const ret = new (Object.getPrototypeOf(this).constructor[Symbol.species]);
    for(const element of this) {
        if(Reflect.apply(predicate, thisArg, [element, element, this])) {
            ret.add(element)
        }
    }

}
```

## Set.prototype.map(func, thisArg)
`.map` method creates new `Set` instance with the results of calling a provided function on every element in this set.

### Polyfill

```
Set.prototype.map = function map(mapFunction, thisArg=null) {
    assert(typeof predicate === 'function');
    assert(Set.isSet(this));
    const ret = new (Object.getPrototypeOf(this).constructor[Symbol.species]);
    for(const element of this) {
        ret.add(Reflect.apply(mapFunction, thisArg, [element, element, this]))
    }

}
```

### Discussion
* `source.size` doesn't have to equal `result.size`. This can be confusing to some developers.


## Set.prototype.some(predicate, thisArg)
`.some` method is analogous to `Array.prototype.some`.

### Polyfill
```
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
```
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
```
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
### Discussion
* `.intersect` signature is matter of convention. It can accept:
** single `Set`
** multiple `Sets`
** single iterable
** multiple iterables
Single `Set` seems to be most common use case and it's easiest to optimize (requires `O(MIN(a.size,b.size))` operations).


### Polyfill (not optimized; single Set)

```
Set.prototype.intersect =  function(otherSet) {
    assert(Set.isSet(this));
    assert(Set.isSet(otherSet));
    const subConstructor = Object.getPrototypeOf(this).constructor[Symbol.species]; // readability
    const ret = new subConstructor();
    for(const element of this) {
        if(otherSet.has(element)) {
            ret.add(element);
        }
    }
}
```

## Set.prototype.union
`.union` method creates new `Set` instance by mathematical set union operation.
![Venn diagram for union](https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Venn0111.svg/384px-Venn0111.svg.png)
### Discussion
* `.union` signature is matter of convention. It can accept:
** single `Set`
** multiple `Sets`
** single iterable
** multiple iterables
It's preferable to make `.union` method consistent with `.intersect` method.

