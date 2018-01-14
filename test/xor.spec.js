'use strict';

const {assert} = require('chai');

describe.skip('Set.prototype.symmetricDifference', () => {
    it('Should be present', () => {
        const set = new Set();
        assert.isFunction(set.symmetricDifference);
        assert.isFunction(Set.prototype.symmetricDifference);
    })
})