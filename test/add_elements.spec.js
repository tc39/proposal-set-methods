'use strict';

const {assert} = require('chai');

describe.skip('Set.prototype.addAll', () => {
    it('Should be present', () => {
        const set = new Set();
        assert.isFunction(set.addAll);
        assert.isFunction(Set.prototype.addAll);
    })
})
