'use strict'

const assert = require('assert');
const proxyquire = require('proxyquire');

function getTarget(configStub) {
    return proxyquire('../../src/trafficLights/lights', {
        '../configReader': configStub
    });
}

describe('lights test', () => {

    it('should add signaler to list', () => {
        // GIVEN
        const c = { lightsTime: { green: 3, orange: 1, red: 2 }};
        const config = { getConfig: () => c };

        // WHEN
        const target = getTarget(config);

        // THEN
        assert.deepStrictEqual(target.GREEN(0).time, c.lightsTime.green);
        assert.deepStrictEqual(target.ORANGE(0).time, c.lightsTime.orange);
        assert.deepStrictEqual(target.RED(0).time, c.lightsTime.red);
    });

});