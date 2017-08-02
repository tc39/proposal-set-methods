'use strict';

const {assert} = require('chai');

describe.skip('Set.prototype.subtract', () => {
    it('Should be present', () => {
        const set = new Set();
        assert.isFunction(set.subtract);
        assert.isFunction(Set.prototype.subtract);
    })
})