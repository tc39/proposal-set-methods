'use strict';

const {assert} = require('chai');

describe.skip('Set.prototype.isSupersetOf', () => {
    it('Should be present', () => {
        const set = new Set();
        assert.isFunction(set.isSuperset);
        assert.isFunction(Set.prototype.isSuperset);
    })
})