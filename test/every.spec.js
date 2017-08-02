'use strict';

const {assert} = require('chai');

describe.skip('Set.prototype.every', () => {
    it('Should be present', () => {
        const set = new Set();
        assert.isFunction(set.every);
        assert.isFunction(Set.prototype.every);
    })
})