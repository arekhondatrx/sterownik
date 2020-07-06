'use strict';

const assert = require('assert');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

function getTarget(runStub) {
    return proxyquire('../../src/db', {
        'sqlite3': {
            verbose: () => {
                return {
                Database: class {
                    prepare() {
                        return {
                            run: runStub
                        }
                    };
                    run() {};
                }
            }
            }
        }
    });
}

describe('db test', () => {

    it('should properly init db', async() => {
        // GIVEN
        const runStub = sinon.stub();
        const target = getTarget(runStub);
        const result = new target();

        // WHEN
        await result.insert();

        // THEN
        assert.ok(runStub.calledOnce);
    });
});