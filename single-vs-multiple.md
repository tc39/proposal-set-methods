# `.union`, `.intersection` etc. desired signature

These functions could in theory accept:

* single Set
  * best possible performance
  * requires user to convert iterables to Sets before passing
* multiple Sets
  * looks like rare use case
* Single iterable
  * Consistent with other languages (eg. [LINQ `.intersect` method](https://msdn.microsoft.com/en-us/library/bb460136(v=vs.100).aspx))
* Multiple iterables
  * Used by Immutable.js
  * Certain algorithms can be ineffective without converting arguments to `Set` instances (`intersection` without at least `log(n)` random access seems to be too slow for real world)

Currently this proposal takes the "single Set" option. See [details.md](./details.md) for details of this and other decisions.
