'use strict';

const {assert} = require('chai');

describe.skip('Set.prototype.some', () => {
    it('Should be present', () => {
        const set = new Set();
        assert.isFunction(set.some);
        assert.isFunction(Set.prototype.some);
    })
})