# Details

## Subclassing

The most important decisions for this proposal are around how to handle subclassing.

### `Symbol.species`

The committee has [largely come to regret `Symbol.species`](https://github.com/tc39/proposal-rm-builtin-subclassing#type-iii-customizable-subclass-instance-creation-in-built-in-methods). While it may or may not prove web-compatible to remove support for it in existing built-ins, the methods added by this proposal will not use it, instead always creating an instance of the base `Set` type. Subclasses wishing to override this behavior would need to override these methods.

### Constructing a `Set` directly

When user code invokes [the `Set` constructor](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-set-iterable), it looks up and repeatedly invokes the `.add` method on `this`. This was intended to be an affordance for subclassing. Since these methods never create subclasses, this is not done in these methods: replacing `Set.prototype.add` will not affect the results returned by these methods.

### Handling `this`

After a great deal of discussion, the committee [ultimately decided](https://github.com/tc39/notes/blob/6f7e075341e435f22777b07a3ee5141442d2d8a7/meetings/2022-03/mar-31.md#extending-built-ins) that these methods should access the `[[SetData]]` internal slot of the receiver (`this`) directly, rather than by calling public methods like `this.has()` or `this[Symbol.iterator]()`. This means subclasses will need to either ensure that the internal slot is consistent with their public API or override all of these methods.

## Handling the argument

The committee decided that arguments should be accessed by their [public API](https://github.com/tc39/notes/blob/6f7e075341e435f22777b07a3ee5141442d2d8a7/meetings/2022-03/mar-31.md#extending-built-ins), rather than internal slots, so that it is possible to pass a thing which looks like a Set (e.g. a Proxy for a Set) as an argument to an actual Set.

In the September 2022 meeting it was decided that this specifically meant accessing the `.has`, `.keys`, and `.size` methods of the argument. As of this writing notes are not yet available, but slides for that discussion are available [here](https://docs.google.com/presentation/d/1HCqPMsWiTtsn92gA3b1luVpnVHWVVR0iKaAE0marxkA).

### Rejecting `NaN` sizes

This proposal uses `ToIntegerOrInfinity` to coerce the `.size` property to get the size of the argument. However, unlike most uses of that operation, it explicitly guardes against `NaN` and things which coerce to `NaN` (including `undefined`), instead of treating `NaN` as being `0`. This matches [a similar decision made in proposal-iterator-helpers](https://github.com/tc39/proposal-iterator-helpers/issues/169): it means that passing a thing without a `.size` property will be an error, instead of treating it as having size 0.

### Use of `.keys` instead of `[Symbol.iterator]`

This proposal does not use `[Symbol.iterator]` because of a quirk in the optimal algorithm for intersection, discussed in [these slides](https://docs.google.com/presentation/d/1HCqPMsWiTtsn92gA3b1luVpnVHWVVR0iKaAE0marxkA/edit#slide=id.g106f4536d9_0_109).

The problem arises because the `[Symbol.iterator]` method on `Map` returns map entries, whereas the `has` method on `Map` tests for key membership, so the two are not consistent. If we did use `[Symbol.iterator]`, it would mean that passing a `Map` would behave as if passing the Set given by the `Map`'s keys _only when the `Map` was larger than the receiver_, and otherwise would give an empty intersection. The position of the committee was that this sometimes-works behavior for a built-in type was unacceptably bad. Using `keys` does not have this problem.

It is still possible for a user-implemented class to run into this behavior. The committee decided that was an acceptable cost.

### Always getting `.size`, `.keys`, and `.has`

Some methods only ever require iterating the argument or testing membership in it, rather than sometimes needing one and sometimes the other. For example, `.union` only requires iterating the argument.

But all methods in this proposal always get all three of the above-named properties. This is to ensure that there is a single consistent interface they expect.

Also, just using `.keys` would mean that passing an array to `.union` would give the union with the _indices_ of the array, which was held to be confusing. Requiring `.size` to be defined means that arrays are rejected instead of that more confusing behavior.

## Time complexity

Intersecting a small set with a large set should always take time proportional to the smaller set, regardless of whether the receiver or the argument is smaller.

That is to say, in `.intersection`, when `this` is smaller than the argument it is more efficient to iterate `this` and check if each member is an element of the argument; conversely, when `this` is larger than the argument it is more efficient to iterate the argument and check if each member is an element of `this`. This means the observable behavior of `.intersection` depends on the relative sizes of the two collections. That's necessary to achieve the desired time complexity.

`.difference` has a similar branch; in that case, while the time complexity taking into account the time taken to copy the receiver cannot be less than than proportional to the size of the receiver, the number of user-observable function calls can still be minimized by branching on which of the two sets is larger, just as for `.intersection`.

## Rejecting iterables

In principle, we could fall back to iterating the argument and converting it to a `Set` when the argument does not implement all of `.size`, `.keys`, and `.has`. But that has subtle  performance implications. Specifically, when the receiver is significantly smaller than the argument, `.intersection` requires time proportionate to the size of the receiver, not the argument. Iterating the argument to produce a `Set` would therefore be potentially much slower than passing a similarly-sized `Set`. So we decided that users should have to do that potentially-expensive iteration themselves, i.e., to do `.intersection(new Set(iterable))` instead of just `.intersection(iterable)`.

## Caching methods up-front

All methods are fetched eagerly and stored, rather than being looked up per iteration of the loop. This greatly simplifies optimization and is consistent with [what we do elsewhere](https://github.com/tc39/ecma262/issues/1505#issuecomment-481778163).

## Single argument

All of these methods take only a single argument. Some of them, like `union`, could in theory take multiple values. This proposal currently takes the position that this use case is rare enough to not be worth worrying about; invoking the method repeatedly is held to be sufficient.

## Order

For each of the `Set`-producing methods, in the resulting `Set`s all elements which were in the receiver appear first, in the order in which they appeared in the receiver, followed by elements which were only in the argument, in the order in which they appeared in the argument.

That this is possible for `intersection` in time proportional only to the size of the result (and not the receiver) is not obvious, but in <a href="https://matrixlogs.bakkot.com/TC39_Delegates/2022-07-11#L0-L54">this discussion</a> it was determined that it ought to be.
