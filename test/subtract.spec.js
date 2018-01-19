'use strict';

const {assert} = require('chai');

describe('Set.prototype.difference', () => {
    it('Should be present', () => {
        const set = new Set();
        assert.isFunction(set.difference);
        assert.isFunction(Set.prototype.difference);
    });

    it('Should difference elements from single Set', () => {
        const set = new Set([1, 2]);
        const otherSet = new Set([1, 3]);
        const actual = set.difference(otherSet);
        const expected = new Set([2]);
        assert.deepEqual(...actual, ...expected);
        assert.instanceOf(actual, Set);
        assert.strictEqual(actual.constructor, Set);
    });

    it('Should difference elements from single Array', () => {
        const set = new Set([1, 2]);
        const otherArray = [1, 3];
        const actual = set.difference(otherArray);
        const expected = new Set([2]);
        assert.deepEqual(actual, expected);
        assert.instanceOf(actual, Set);
        assert.strictEqual(actual.constructor, Set);
    });

    it('Should difference elements from multiple Sets', () => {
        const set = new Set([1, 2, 3]);
        const set2 = new Set([1, 4]);
        const set3 = new Set([2, 5]);
        const actual = set.difference(set2, set3);
        const expected = new Set([3]);
        assert.deepEqual(actual, expected);
        assert.instanceOf(actual, Set);
        assert.strictEqual(actual.constructor, Set);
    });

    it('Should difference elements from multiple iterables', () => {
        const set = new Set([1, 2, 3]);
        const set2 = new Set([1, 4]);
        const set3 = [2, 5];
        const actual = set.difference(set2, set3);
        const expected = new Set([3]);
        assert.deepEqual(actual, expected);
        assert.instanceOf(actual, Set);
        assert.strictEqual(actual.constructor, Set);
    });
})
