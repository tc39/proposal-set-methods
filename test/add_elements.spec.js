'use strict';

const {assert} = require('chai');

describe.skip('Set.prototype.addElements', () => {
    it('Should be present', () => {
        const set = new Set();
        assert.isFunction(set.addElements);
        assert.isFunction(Set.prototype.addElements);
    })
})