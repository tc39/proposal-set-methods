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
