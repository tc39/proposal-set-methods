function getSpeciesConstructor(obj) {
    return Object.getPrototypeOf(this).constructor[Symbol.species];
}

function isSet(obj) {
    return !!(
        obj &&
        'has' in obj &&
        'add' in obj &&
        'forEach' in obj &&
        ('remove' in obj) &&
        (Reflect.has(obj, 'size')) &&
        (typeof obj.has === 'function') &&
        (typeof obj.add === 'function') &&
        (typeof obj.remove === 'function') &&
        (typeof obj.size === 'number') &&
        (Number.isInteger(obj.size))
    );
}

function relativeComplement(iterable) {
    assert(Set.isSet(this));
    const subConstructor = Object.getPrototypeOf(this).constructor[Symbol.species]; // readability
    const ret = new subConstructor(this);
    for(const element of iterable) {
        if(ret.has(element))
            ret.delete(element);
    }
    return ret;
}

function assert(val) {
    if (!val) throw new Error();
}

function filter(predicate, thisArg = null) {
    assert(typeof predicate === 'function');
    assert(isSet(this));
    const ret = new (getSpeciesConstructor(this));
    for (const element of this) {
        if (Reflect.apply(predicate, thisArg, [element, element, this])) {
            ret.add(element)
        }
    }
    return ret;
}

function map(mapFunction, thisArg = null) {
    assert(typeof predicate === 'function');
    assert(isSet(this));
    const ret = new (getSpeciesConstructor(this));
    for (const element of this) {
        ret.add(Reflect.apply(mapFunction, thisArg, [element, element, this]))
    }
    return ret;
}

function some(predicate, thisArg=null) {
    assert(typeof predicate === 'function');
    assert(isSet(this));
    for(const element of this) {
        if(Reflect.apply(predicate, thisArg, [element, element, this])) {
            return true;
        }
    }
    return false;
}

function find(predicate, thisArg=null) {
    assert(typeof predicate === 'function');
    assert(isSet(this));
    for(const element of this) {
        if(Reflect.apply(predicate, thisArg, [element, element, this])) {
            return element;
        }
    }
    return undefined;
}

function every(predicate, thisArg=null) {
    assert(typeof predicate === 'function');
    assert(isSet(this));
    for(const element of this) {
        if(!Reflect.apply(predicate, thisArg, [element, element, this])) {
            return false;
        }
    }
    return true;
}

function intersect(otherSet) {
    assert(isSet(this));
    assert(isSet(otherSet));
    const subConstructor = getSpeciesConstructor(this);
    const ret = new subConstructor();
    for(const element of this) {
        if(otherSet.has(element)) {
            ret.add(element);
        }
    }
    return ret;
}

function xor(otherSet) {
    assert(isSet(this));
    assert(isSet(otherSet));
    const subConstructor = getSpeciesConstructor(this); // readability
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

function addElements(...args) {
    assert(isSet(this));
    for(const element of args) {
        this.add(element);
    }
    return this;
}

function removeElements(...args) {
    assert(isSet(this));
    for(const element of args) {
        this.remove(element);
    }
    return this;
}

export default function polyfill(Set) {
    assert(typeof Set === 'function');
    const prototypeMethods = [
        ['map', map],
        ['filter', filter],
        ['some', some],
        ['xor', xor],
        ['intersect', intersect],
        ['every', every],
        ['find', find],
        ['relativeComplement', relativeComplement],
        ['addElements', addElements],
        ['removeElements', removeElements]
    ];
    const staticMethods = [
        ['isSet', isSet]
    ];
    for (const [key, value] of prototypeMethods) {
        Object.defineProperty(Set.prototype, key, {
            value
        });
    }
    for (const [key, value] of staticMethods) {
        Object.defineProperty(Set, key, {
            value
        });
    }
    return Set;
}