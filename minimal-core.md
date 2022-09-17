# Minimal core vs. per method override

This document was historically created to discuss the question of how the new methods would access data from `this`, which has implications for subclassing as discussed in [this presentation](https://docs.google.com/presentation/d/1BeqsmXGPm_GEAApnpIfVZd3KTOykS4tQVQ7FvYTDtHg/edit#slide=id.g4e7e69452c_0_386).

After a great deal of discussion, the committee ultimately settled on the "per method override" option.

### Minimal core

You should be able to override a core set of methods, then all new methods added in this proposal will automatically work.

### Per method override

A subclass which changes the core behavior of the class may need to override all methods.

## Worth reading

[Avoid "delete" and "add"](https://github.com/tc39/proposal-set-methods/issues/50)

[TC39 notes](https://github.com/tc39/notes/blob/master/meetings/2019-01/jan-29.md#update-on-set-methods)

[rekey proposal](https://github.com/tc39/proposal-richer-keys/tree/master/collection-rekey)

## Main points:

These are quotes from notes and issues in this repository. If I have misquoted any fragment, please let me know.

### Arguments in favor of minimal core

>  the Set constructor [already creates a contract around having `.add`](https://tc39.github.io/ecma262/#sec-set-iterable), though it's hard to observe.

~ @bakkot

> I don't think "customize the algorithm's behavior" is the right way to think of this. The point of `Symbol.iterator` is to allow consumers to iterate over the contents a container. Algorithms which want to iterate over the contents of a container should therefore use `Symbol.iterator`. Internal slots are precisely that - internal. Subclasses shouldn't have to worry about them as long as they maintain a consistent public API. (I very much do not agree that a well-behaved subclass must always call its super methods.)

~ @bakkot

>  it is not the case that "per-method override" gives you everything you want. If I pass an instance of `class LoggingSet extends Set { has(x) { console.log(x); return super.has(x); } }` - approximately the simplest nontrivial subclass imaginable - to `(new Set([0, 1])).isSubsetOf(instance)` as you would like it to be defined, it will not trigger my instrumentation and I cannot make it trigger my instrumentation. Even though any other consumer of my instance obviously would.

~ @bakkot

> Requiring subclasses to overwrite all methods ever added does not work; experience from Ruby demonstrates this.

~ @wycats

> Agree with both Kevin and Yehuda, and rekey must be orthogonal to the discussion because there are already examples of conceivable Set subclasses that cannot be implemented with Set plus rekey.

~ @gibson042

> My hope is that with a Set subclass, I can get the new functionality for free.

~ @michaelficarra


### Arguments in favor of per-method override


> I'd love to do this --remove all lookups, operate on an internal list and create a Set finally from this. Three main reasons I didn't do this is:
> (a) Consistency: we'd be moving away from the pattern used by the Set constructor (which looks up the `add` method). I wasn't sure if the committee would be happy with this.
> (b) Subclassing becomes less useful if internal operations are going to bypass overridden methods
> (c) The runtime cost that @bakkot described (... although this isn't going to happen for almost all common cases)

~ @gsathya

> I continue to be struck by the over-complexity that we are injecting into the spec, in the name of genericism, subclassability, and the desire to touch the public API as many times as possible in order to give other classes (or other thisArgs) a chance to insert their own behaviors. As someone who did the same thing with promises in ES2015, and lived to regret it greatly, it's heartbreaking to see those same patterns propagated further. I'd hoped we'd do things differently going forward.
> (...)
> The guiding principles, which I think are fairly generally applicable, are:

> * Convert from user-hookable objects (`Set` or iterable) to spec-internal data structures ASAP, "at the boundary".
> * Operate entirely on the spec-internal data structures for the actual algorithm you're performing.
> * Convert back to user-hookable objects right before returning to the caller, no sooner
> * Extract and emplace data out of/into `Set`s by using their internal slots as the source of truth
>  * Hard-code your object creation to not be hookable
> * I'm unsure on this particular principle, as it just seems kind of nicer to use `new this.constructor()`. But hard-coding is way nicer than the gross species dance, and subclassing in general has not panned out well. The dream that "all the inherited methods will automatically do the right thing" that drives using `new (this.constructor && this.constructor[Symbol.species] || Set)()` has failed pretty badly, so I'd rather abandon it than keep it up.

~ @domenic

> I think "cripples subclassing" is overstating it a bit. It's important to separate subclassing and the desire to touch public APIs.
> Subclassing still works fine in general. The only thing that might be slightly surprising is that you get back `Set` instances instead of `Subclass` instances. But we could back off a bit and re-include `new this.constructor()` (or, if you must, `new (this.constructor && this.constructor[Symbol.species] || Set)()`).
> It's the pattern of going through as many public APIs as possible, in order to allow arguments or thisArgs to customize the algorithm's behavior, that the approach specifically avoids. Instead it treats the [[SetData]] as the source of truth---but any well-behaved subclass (i.e. one that calls super constructor and super methods) will work fine with that constraint.

~ @domenic

> When operating on a Set, `[[SetData]]` is a better source of truth in my opinion than the monkey-patchable public API. Subclasses which don't keep an accurate `[[SetData]]` are not, in my opinion, "perfectly reasonable".

~ @domenic

> Yes, that is the minimal-core principle. As I stated, I think that has led to a terrifying increase in complexity in the ES6-era classes, with excessive customizability and monkey-patch interception points permeating the operation of every method and constructor. I hope we do not propagate that cost forward, and instead create a simpler subclassing contract for `Set` than we did for `Promise`, `RegExp`, etc.

~ @domenic

> I did part of the work on the implementation of ES6 RegExp and Array subclassing in V8, and I deeply regret it. To avoid performance regressions while adding these observable points, we ended up adding "performance cliffs": The algorithm was something like, check whether anyone is observing it, if not take the fast path, otherwise take a new, slow path. Since my work there (which I'm not proud of at all), my colleagues in the V8 team have gone back and sped up many of those slow paths, but the performance difference remains, and an incredible amount of engineering effort went into this project.

> Meanwhile, years later, it's still not clear what kind of software engineering benefit those changes brought to programmers. I don't get the impression that lots of people are deliberately subclassing `RegExp` and overriding `exec` for memoization. And if they do, they will find their RegExp operations run more slowly.

~ @littledan



## Prior art

### Java

#### `AbstractSet`

> any class which extends [AbstractSet](https://docs.oracle.com/javase/10/docs/api/java/util/AbstractSet.html) and provides add, remove, size, and iterator methods (and whose iterators provide remove) will get the right behavior for a host of other methods, including containsAll (effectively isSupersetOf), retainAll (effectively a mutating intersection), etc.

> The same is true for the concrete implementations: if you subclass HashSet and override contains, for example, the containsAll method which your subclass will inherit will behave correctly.


#### Stream API

[Java 8 Stream API](https://docs.oracle.com/javase/8/docs/api/java/util/stream/package-summary.html).

[Interface Stream<T>](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html)

Even though `Stream` implements most of methods in this proposal, it's more similar to [iterator helpers proposal](https://github.com/tc39/proposal-iterator-helpers), as it's generic and not tied to `Set`.

### C# HashSet

[`HashSet`](https://docs.microsoft.com/en-us/dotnet/api/system.collections.generic.hashset-1) inherits set methods from [`IEnumerable<T>`](https://docs.microsoft.com/en-us/dotnet/api/system.collections.generic.ienumerable-1).

Therefore, it uses approach more similar to "minimal core", because no `HashSet` internals are touched directly.

### F# Set

[Docs](https://msdn.microsoft.com/en-au/vstudio/ee340244(v=vs.89))


[Source code](https://github.com/fsharp/fsharp/blob/cb6cb5c410f537c81cf26825657ef3bb29a7e952/src/fsharp/FSharp.Core/set.fs)

F# are sealed (similar to Java's `final`). Instance methods delegates to static `Set` or internal `SetTree` module.

Internal `SetTree` methods are implemented like:

```fsharp
let subset comparer a b  = forall (fun x -> mem comparer x b) a

let psubset comparer a b  = forall (fun x -> mem comparer x b) a && exists (fun x -> not (mem comparer x a)) b

let rec filterAux comparer f s acc =
    match s with
    | SetNode(k,l,r,_) ->
        let acc = if f k then add comparer k acc else acc
        filterAux comparer f l (filterAux comparer f r acc)
    | SetOne(k) -> if f k then add comparer k acc else acc
    | SetEmpty -> acc

let filter comparer f s = filterAux comparer f s SetEmpty

```



### Ruby Set

[Docs](https://ruby-doc.org/stdlib-2.6.1/libdoc/set/rdoc/Set.html) (include source code for each method).

Methods in Ruby 2.6 are implemented using "minimal core" approach.

Example:

```ruby
# File set.rb, line 259
def superset?(set)
  case
  when set.instance_of?(self.class) && @hash.respond_to?(:>=)
    @hash >= set.instance_variable_get(:@hash)
  when set.is_a?(Set)
    size >= set.size && set.all? { |o| include?(o) }
  else
    raise ArgumentError, "value must be a set"
  end
end
```

Therefore `superset` method call `this.all` (`.every` equivalent) and `this.is_a`.

### Python set

* [Python - set/frozenset](https://docs.python.org/3.6/library/stdtypes.html#set)

[Example `set_symetric_difference`](https://github.com/python/cpython/blob/bb86bf4c4eaa30b1f5192dab9f389ce0bb61114d/Objects/setobject.c#L1710)

Python `set` methods use "per-method override" approach.

### Hack's HH\Set

[Source code](https://github.com/facebook/hhvm/blob/ef523aef97e38c3a3d4341f4f8c3dcb6468d978d/hphp/runtime/ext/collections/ext_collections-set.php#L47)

`HH\Set` implements only `difference` method. It delegates to `removeAll` method, but `HH\Set` class is *final*.

## Summary

|  Language | Used method             |  Notes                                                                 |
|-----------|-------------------------|------------------------------------------------------------------------|
|  Java     | Minimal core            |                                                                        |
| C#        | Similar to minimal core | Methods are inherited from IEnumerable and don't touch class internals |
| F#        | Final class             | Internally minimal core is used                                        |
| Ruby      | Minimal core            |                                                                        |
|  Python   | per-method override     |                                                                        |
| Hack      | Final class             | Internally minimal core is used                                        |

