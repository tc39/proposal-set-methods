'use strict';

const {assert} = require('chai');

describe('Set.prototype.union', () => {
    it('Should be present', () => {
        const set = new Set;
        assert.isFunction(set.union);
        assert.isFunction(Set.prototype.union);
    });

    it('Should throw when called without this', () => {
        const union = Set.prototype.union;
        assert.throws(()=>union([]));
    });

    it('Should add elements from single Set', () => {
        const set = new Set([1, 2]);
        const otherSet = new Set([1, 4, 5]);
        const actual = set.union(otherSet);
        const expected = new Set([1, 2, 4, 5]);
        assert.deepEqual(actual, expected);
        assert.instanceOf(actual, Set);
        assert.strictEqual(actual.constructor, Set);
    });

    it('Should add elements from single Array', () => {
        const set = new Set([1, 2]);
        const otherArray = [1, 4, 5];
        const actual = set.union(otherArray);
        const expected = new Set([1, 2, 4, 5]);
        assert.deepEqual(actual, expected);
        assert.instanceOf(actual, Set);
        assert.strictEqual(actual.constructor, Set);
    });

    it('Should add elements from multiple Sets', () => {
        const set = new Set([1, 2]);
        const set2 = new Set([1, 4, 5]);
        const set3 = new Set([4, 6, 7]);
        const actual = set.union(set2, set3);
        const expected = new Set([1, 2, 4, 5, 6, 7]);
        assert.deepEqual(actual, expected);
        assert.instanceOf(actual, Set);
        assert.strictEqual(actual.constructor, Set);
    });

    it('Should add elements from multiple iterables', () => {
        const set = new Set([1, 2]);
        const set2 = new Set([1, 4, 5]);
        const set3 = [4, 6, 7];
        const actual = set.union(set2, set3);
        const expected = new Set([1, 2, 4, 5, 6, 7]);
        assert.deepEqual(actual, expected);
        assert.instanceOf(actual, Set);
        assert.strictEqual(actual.constructor, Set);
    });

    describe.skip('Subclassing without overwriting @@species', () => {
        class ExtendedSet extends Set {}
        it('Should add elements from single Set', () => {
            const set = new ExtendedSet([1, 2]);
            const otherSet = new ExtendedSet([4, 5]);
            const resultSet = set.union(otherSet);
            const elements = [...resultSet];
            assert.deepEqual(elements, [1, 2, 4, 5]);
            assert.instanceOf(resultSet, Set);
            assert.strictEqual(resultSet.constructor, ExtendedSet);
        });

        it('Should add elements from single Array', () => {
            const set = new ExtendedSet([1, 2]);
            const otherArray = [4, 5];
            const resultSet = set.union(otherArray);
            const elements = [...resultSet];
            assert.deepEqual(elements, [1, 2, 4, 5]);
            assert.instanceOf(resultSet, ExtendedSet);
            assert.strictEqual(resultSet.constructor, ExtendedSet);
        });

        it('Should add elements from multiple Sets', () => {
            const set = new ExtendedSet([1, 2]);
            const set2 = new ExtendedSet([4, 5]);
            const set3 = new ExtendedSet([6, 7]);
            const resultSet = set.union(set2, set3);
            const elements = [...resultSet];
            assert.deepEqual(elements, [1, 2, 4, 5, 6, 7]);
            assert.instanceOf(resultSet, ExtendedSet);
            assert.strictEqual(resultSet.constructor, ExtendedSet);
        });

        it('Should add elements from multiple Sets', () => {
            const set = new ExtendedSet([1, 2]);
            const set2 = new ExtendedSet([4, 5]);
            const set3 = [6, 7];
            const resultSet = set.union(set2, set3);
            const elements = [...resultSet];
            assert.deepEqual(elements, [1, 2, 4, 5, 6, 7]);
            assert.instanceOf(resultSet, ExtendedSet);
            assert.strictEqual(resultSet.constructor, ExtendedSet);
        });
    });

    describe.skip('Subclassing with overwriting @@species', () => {

        class NewTypeOfSet extends Set {

        }
        class ExtendedSet extends Set {
            static get [Symbol.species]() {
                return NewTypeOfSet;
            }
        }
        it('Should add elements from single Set', () => {
            const set = new ExtendedSet([1, 2]);
            const otherSet = new ExtendedSet([4, 5]);
            const resultSet = set.union(otherSet);
            const elements = [...resultSet];
            assert.deepEqual(elements, [1, 2, 4, 5]);
            assert.instanceOf(resultSet, NewTypeOfSet);
            assert.strictEqual(resultSet.constructor, NewTypeOfSet);
        });

        it('Should add elements from single Array', () => {
            const set = new ExtendedSet([1, 2]);
            const otherArray = [4, 5];
            const resultSet = set.union(otherArray);
            const elements = [...resultSet];
            assert.deepEqual(elements, [1, 2, 4, 5]);
            assert.instanceOf(resultSet, NewTypeOfSet);
            assert.strictEqual(resultSet.constructor, NewTypeOfSet);
        });

        it('Should add elements from multiple Sets', () => {
            const set = new ExtendedSet([1, 2]);
            const set2 = new ExtendedSet([4, 5]);
            const set3 = new ExtendedSet([6, 7]);
            const resultSet = set.union(set2, set3);
            const elements = [...resultSet];
            assert.deepEqual(elements, [1, 2, 4, 5, 6, 7]);
            assert.instanceOf(resultSet, NewTypeOfSet);
            assert.strictEqual(resultSet.constructor, NewTypeOfSet);
        });

        it('Should add elements from multiple Sets', () => {
            const set = new ExtendedSet([1, 2]);
            const set2 = new ExtendedSet([4, 5]);
            const set3 = [6, 7];
            const resultSet = set.union(set2, set3);
            const elements = [...resultSet];
            assert.deepEqual(elements, [1, 2, 4, 5, 6, 7]);
            assert.instanceOf(resultSet, NewTypeOfSet);
            assert.strictEqual(resultSet.constructor, NewTypeOfSet);
        });
    });

});

