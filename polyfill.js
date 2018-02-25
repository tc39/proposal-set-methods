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


function except(iterable) {
    const set = this;
    assert(isObject(set), 'set is not an Object');
    const Ctr = SpeciesConstructor(set, originalSet);
    const newSet = new Ctr(set);
    const remover = newSet.delete;
    assert(isCallable(remover), 'remover is not callable');
    for (const value of iterable) {
        Reflect.apply(remover, newSet, [value]);
    }
    return newSet;
}


function union(iterable) {
    const set = this;
    assert(isObject(set), 'set is not an Object');
    const Ctr = SpeciesConstructor(set, originalSet);
    const newSet = new Ctr(set);
    const adder = newSet.add;
    assert(isCallable(adder), 'adder is not callable');
    for (const value of iterable) {
        Reflect.apply(adder, newSet, [value]);
    }
    return newSet;
}

function intersect(iterable) {
    throw new Error('To be implemented');
}

function xor(iterable) {
    throw new Error('To be implemented');
}

assert(typeof Set === 'function', 'Set does not exist');
const prototypeMethods = [
    ['intersect', intersect],
    ['except', except],
    ['union', union],
    ['xor', 'xor']
];

for (const [key, value] of prototypeMethods) {
    Object.defineProperty(Set.prototype, key, {
        configurable: true,
        value
    });
}

