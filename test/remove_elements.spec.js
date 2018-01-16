'use strict';

const {assert} = require('chai');

describe('Set.prototype.deleteAll', () => {
    it('Should be present', () => {
        const set = new Set();
        assert.isFunction(set.deleteAll);
        assert.isFunction(Set.prototype.deleteAll);
    });

    it('Should remove elements from Set', () => {
        const set = new Set([1, 2, 3]);
        const actual = set.deleteAll(1, 2);
        const expected = new Set([3]);
        assert.deepEqual(actual, expected);
    });

    it('Should not remove elements if they dont exist', () => {
        const set = new Set([1, 2, 3]);
        const actual = set.deleteAll(4, 5);
        const expected = new Set([1, 2, 3]);
        assert.deepEqual(actual, expected);
    });
})
