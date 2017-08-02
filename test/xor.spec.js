'use strict';

const {assert} = require('chai');

describe.skip('Set.prototype.xor', () => {
    it('Should be present', () => {
        const set = new Set();
        assert.isFunction(set.xor);
        assert.isFunction(Set.prototype.xor);
    })
})