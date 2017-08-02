'use strict';

const {assert} = require('chai');

describe.skip('Set.isSet', () => {
    it('Should be present', () => {
        assert.isFunction(Set.isSet);
    });
});