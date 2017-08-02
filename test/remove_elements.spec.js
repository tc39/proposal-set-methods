'use strict';

const {assert} = require('chai');

describe.skip('Set.prototype.removeElements', () => {
    it('Should be present', () => {
        const set = new Set();
        assert.isFunction(set.removeElements);
        assert.isFunction(Set.prototype.removeElements);
    })
})