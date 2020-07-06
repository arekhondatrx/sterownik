'use strict'

const assert = require('assert');
const sinon = require('sinon');
const proxyquire = require('proxyquire').callThru();

function getTarget(stubs) {
    return proxyquire('../../src/trafficLights', {
        '../websocket': { sendData: stubs.ws },
        '../configReader': stubs.config,
        './lights': proxyquire('../../src/trafficLights/lights', {
            '../configReader': stubs.config
        })
    });
}

describe('traffic light test', () => {

    it('should call ws and db expected times when previousColor and currentColor are identical', () => {
        // GIVEN
        const config = {
            getConfig: sinon.stub().returns({ maxAdditionalTime: 1, lightsTime: sinon.stub() })
        };
        const stubs = { ws: sinon.stub(), config };
        const dbStub = {
            insert: sinon.stub()
        };
        const signaler = { id: 1, color: 'RED' };
        const target = getTarget(stubs);

        // WHEN
        const tl = new target(dbStub);
        tl.getClients().clear();
        tl.update(signaler)
        tl.start();

        // THEN
        assert.ok(stubs.ws.calledThrice);
        assert.ok(dbStub.insert.calledOnce);
    });

});