'use strict';

const assert = require('assert');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const configStub = 'configStub';

function getTarget(safeLoadStub) {
    return proxyquire('../../src/configReader', {
        'js-yaml': {
            safeLoad: safeLoadStub ? safeLoadStub : sinon.stub().returns(configStub)
        },
        'fs': {
            readFileSync: sinon.stub().returns('file')
        },
        'path': {
            resolve: sinon.stub().returns('path')
        }
    });
}

describe('config reader test', () => {

    it('should return config', () => {
        // GIVEN
        const target = getTarget();

        // WHEN
        const result = target.getConfig();

        // THEN
        assert.deepStrictEqual(result, configStub);
    });

    it('should return null when unexpected error occur', () => {
        // GIVEN
        const target = getTarget(sinon.stub().throws());

        // WHEN
        const result = target.getConfig();

        // THEN
        assert.deepStrictEqual(result, null);
    });
});