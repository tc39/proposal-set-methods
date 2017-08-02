'use strict';

const {assert} = require('chai');

describe.skip('Set.prototype.map', () => {
    it('Should be present', () => {
        const set = new Set();
        assert.isFunction(set.map);
        assert.isFunction(Set.prototype.map);
    })
})