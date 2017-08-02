'use strict';

const {assert} = require('chai');

describe.skip('Set.prototype.intersect', () => {
    it('Should be present', () => {
        const set = new Set();
        assert.isFunction(set.intersect);
        assert.isFunction(Set.prototype.intersect);
    })
})