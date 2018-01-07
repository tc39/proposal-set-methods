'use strict';

const {assert} = require('chai');

describe('Set.prototype.removeElements', () => {
    it('Should be present', () => {
        const set = new Set();
        assert.isFunction(set.removeElements);
        assert.isFunction(Set.prototype.removeElements);
    });

    it('Should remove elements from Set', () => {
        const set = new Set([1, 2, 3]);
        const actual = set.removeElements(1, 2);
        const expected = new Set([3]);
        assert.deepEqual(actual, expected);
    });

    it('Should not remove elements if they dont exist', () => {
        const set = new Set([1, 2, 3]);
        const actual = set.removeElements(4, 5);
        const expected = new Set([1, 2, 3]);
        assert.deepEqual(actual, expected);
    });
})
