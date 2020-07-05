'use strict'

const assert = require('assert');
const List = require('arraylist');

const signalerList = require('../../src/signalerList');

describe('signaler list test', () => {

    it('should add signaler to list', () => {
        // GIVEN
        signalerList.get().clear();
        const signalers = [{id: 2, state: 'red' }, {id: 5, state: 'orange' }];
        const expectedList = new List();
        expectedList.add(signalers[0]);
        expectedList.add(signalers[1]);

        // WHEN
        signalerList.update(signalers[0]);
        signalerList.update(signalers[1]);

        // THEN
        assert.deepStrictEqual(signalerList.get().size(), expectedList.size());
        assert.deepStrictEqual(signalerList.get(), expectedList);
    });

    it('should update signaler on list', () => {
        // GIVEN
        signalerList.get().clear();
        const signalers = [{id: 2, state: 'red' }, {id: 2, state: 'orange' }];
        const expectedList = new List();
        expectedList.add(signalers[1]);

        // WHEN
        signalerList.update(signalers[0]);
        signalerList.update(signalers[1]);

        // THEN
        assert.deepStrictEqual(signalerList.get().size(), expectedList.size());
        assert.deepStrictEqual(signalerList.get(), expectedList);
    });
});