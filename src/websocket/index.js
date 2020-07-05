'use strict';

const WebSocket = require('websocket').server;

let wsServer = null;
let clients = [];

async function init(http, traffic) {
    wsServer = new WebSocket({ httpServer: http });

    wsServer.on('open', (event) => {
        console.log(event);
    });

    wsServer.on('request', (request) => {
        console.log('Connection from origin ' + request.origin + '.');

        const connection = request.accept(null, request.origin);
        console.log('Connection accepted.');

        connection.on('message', (msg) => {
            const body = JSON.parse(msg.utf8Data);

            if(Number.isInteger(parseInt(body.id))) {
                traffic.update(body);
            }
            else {
                connection.send({data: JSON.stringify(traffic.getClients())});
            }

            console.log(`Added client with id: ${body.id}`);

            clients.push({id: body.id, connection})
        });

        connection.on('close', () => {
           clients = clients.filter(c => c.connection !== connection);
           console.log('Connection closed.');
        });

    });
}

function sendData(data, id) {

    const client = clients.filter(c => c.id === id)[0];
    const connection = client ? client.connection : null;

    if(connection){
        console.log('Sending data to client.');
        client.connection.send(JSON.stringify(data));
        return true;
    }

    console.log(`Not connected to client.`);
    return false;
}

module.exports = {
    init,
    sendData
};
