## `Set` types in other languages

### Other languages

* [C# `HashSet`](https://msdn.microsoft.com/en-us/library/bb359438.aspx)
* [F# - Collections.Set](https://msdn.microsoft.com/en-au/vstudio/ee340244(v=vs.89))
* [Haskell - Data.Set](http://hackage.haskell.org/package/containers-0.5.10.2/docs/Data-Set.html)
* [Python - set/frozenset](https://docs.python.org/3.6/library/stdtypes.html#set)
* [Hack - HH\Set](https://docs.hhvm.com/hack/reference/class/HH.Set/)
* [Ruby - Set](https://ruby-doc.org/stdlib-2.5.0/libdoc/set/rdoc/Set.html)

### Java

Java `Set` interface is rather limited and doesn't include APIs found in this proposal.

Though, Java 8 introduces [stream API](http://docs.oracle.com/javase/8/docs/api/java/util/stream/package-summary.html) that allow to deal with arbitrary collections.

Stream API has methods from this proposal like `union` (as `concat`).

Stream API nor `Set` does not include `intersection`, `xor`.
