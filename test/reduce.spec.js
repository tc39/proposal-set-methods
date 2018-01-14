'use strict';

const {assert} = require('chai');

describe.skip('Set.prototype.reduce', () => {
    it('Should be present', () => {
        const set = new Set();
        assert.isFunction(set.reduce);
        assert.isFunction(Set.prototype.reduce);
    })
})