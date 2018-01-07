'use strict';

var originalSet = Set;

function assert(val, msg) {
    if (!val) {
        throw new TypeError(msg);
    }
}

function isObject(x) {
    return (typeof x === 'function' || typeof x === 'object');
}

function SpeciesConstructor(O, defaultConstructor) {
    assert(isObject(O), 'O is not Object');

    var C = O.constructor;

    if (typeof C === 'undefined') {
        return defaultConstructor;
    }

    if (!isObject(C)) {
        throw new TypeError('O.constructor is not an Object');
    }

    var S = C[Symbol.species];

    if (S == null) {
        return defaultConstructor;
    }

    if (typeof S === 'function' && !!S.prototype) {
        return S;
    }

    throw new TypeError('no constructor found');
}

function isCallable(x) {
    try {
        Function.prototype.toString.call(x);
        return true;
    } catch(e) {
        return false;
    }
}

function isSet(obj) {
    const methodNames = ['has', 'add', 'forEach', 'delete', 'keys', 'values', 'entries'];
    return !!(
        obj &&
        methodNames.every(key=>key in obj && typeof obj[key] === 'function') &&
        'size' in obj &&
        typeof obj.size === 'number' &&
        Number.isInteger(obj.size)
    );
}

function subtract(...items) {
    const len = items.length;
    const set = this;
    assert(isObject(set), 'set is not an Object');

    let k = 0;
    const Ctr = SpeciesConstructor(set, originalSet);
    const newSet = new Ctr(set);
    const remover = newSet.delete;
    assert(isCallable(remover), 'remover is not callable');

    while (k < len) {
        const iterable = items[k];
        for (const value of iterable) {
            Reflect.apply(remover, newSet, [value]);
        }
        k++;
    }

    return newSet;
}

function filter(predicate, thisArg = null) {
    assert(typeof predicate === 'function');
    assert(isSet(this));
    const ret = new (getSpeciesConstructor(this));
    for (const element of this) {
        if (Reflect.apply(predicate, thisArg, [element, element, this])) {
            ret.add(element);
        }
    }
    return ret;
}

function map(mapFunction, thisArg = null) {
    assert(typeof mapFunction === 'function');
    assert(isSet(this));
    const ret = new (getSpeciesConstructor(this));
    for (const element of this) {
        ret.add(Reflect.apply(mapFunction, thisArg, [element, element, this]))
    }
    return ret;
}

function some(predicate, thisArg = null) {
    assert(typeof predicate === 'function');
    assert(isSet(this));
    for (const element of this) {
        if (Reflect.apply(predicate, thisArg, [element, element, this])) {
            return true;
        }
    }
    return false;
}

function find(predicate, thisArg = null) {
    assert(typeof predicate === 'function');
    assert(isSet(this));
    for (const element of this) {
        if (Reflect.apply(predicate, thisArg, [element, element, this])) {
            return element;
        }
    }
    return undefined;
}

function every(predicate, thisArg = null) {
    assert(typeof predicate === 'function');
    assert(isSet(this));
    for (const element of this) {
        if (!Reflect.apply(predicate, thisArg, [element, element, this])) {
            return false;
        }
    }
    return true;
}

function union(...items) {
    const len = items.length;
    const set = this;
    assert(isObject(set), 'set is not an Object');

    let k = 0;
    const Ctr = SpeciesConstructor(set, originalSet);
    const newSet = new Ctr(set);
    const adder = newSet.add;
    assert(isCallable(adder), 'adder is not callable');


    while (k < len) {
        const iterable = items[k];
        for (const value of iterable) {
            Reflect.apply(adder, newSet, [value]);
        }
        k++;
    }

    return newSet;
}

function intersect(...iterables) {
    assert(isSet(this));
    assert(iterables.length > 0);
    const subConstructor = getSpeciesConstructor(this);
    const ret = new subConstructor();
    const setIterables = [this, ...iterables].map(iterable => new subConstructor(iterable));
    for (const _set of setIterables) {
        for (const element of _set) {
            if (setIterables.every(_set=>_set.has(element))) {
                ret.add(element);
            }
        }
    }
    return ret;
}

function addElements(...args) {
    assert(isSet(this));
    for (const element of args) {
        this.add(element);
    }
    return this;
}

function removeElements(...items) {
    const len = items.length;
    const set = this;
    assert(isObject(set), 'set is not an Object');

    let k = 0;
    const remover = set.delete;
    assert(isCallable(remover), 'remover is not a function');

    while (k < len) {
        const value = items[k];
        Reflect.apply(remover, set, [value]);
        k++;
    }
    return this;
}

assert(typeof Set === 'function', 'Set does not exist');
const prototypeMethods = [
    ['map', map],
    ['filter', filter],
    ['some', some],
    ['intersect', intersect],
    ['every', every],
    ['find', find],
    ['subtract', subtract],
    ['addElements', addElements],
    ['removeElements', removeElements],
    ['union', union]
];
const staticMethods = [
    ['isSet', isSet]
];
for (const [key, value] of prototypeMethods) {
    Object.defineProperty(Set.prototype, key, {
        configurable: true,
        value
    });
}
for (const [key, value] of staticMethods) {
    Object.defineProperty(Set, key, {
        configurable: true,
        value
    });
}
