'use strict';

const WebSocket = require('websocket').server;

let wsServer = null;
let connection = null;

async function init(http) {
    wsServer = new WebSocket({ httpServer: http });

    wsServer.on('open', (event) => {
        console.log(event);
    });

    wsServer.on('request', (request) => {
        console.log('Connection from origin ' + request.origin + '.');

        connection = request.accept(null, request.origin);
        console.log('Connection accepted.');
    });

    wsServer.on('close', ()=> {
        console.log('Connection closed.');
    });
}

function sendData(data) {
    if(connection){
        console.log('Sending data to frontend client.');
        connection.send(JSON.stringify(data));
    }
    else {
        console.log('Not connected to frontend client.');
    }
}

module.exports = {
    init,
    sendData
};
