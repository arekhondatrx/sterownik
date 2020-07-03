'use strict';

const request = require('request');

function sendData(state, serverUrl) {
    const url = `${serverUrl}/state/${state}`;
    return new Promise((resolve, reject) => {
        request.get({ url }, (error, response, body) => {
            if (error) {
                reject(error)
            } else {
                resolve({status: response.statusCode, body});
            }
        });
    });
}

module.exports = {
    sendData
};