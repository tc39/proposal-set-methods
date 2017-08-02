'use strict';

const {assert} = require('chai');

describe.skip('Set.prototype.find', () => {
    it('Should be present', () => {
        const set = new Set();
        assert.isFunction(set.find);
        assert.isFunction(Set.prototype.find);
    })
})