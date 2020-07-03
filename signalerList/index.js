'use strict';

const List = require('arraylist');
const clients = new List();

function update(input) {
    let clientAlreadyExist = false;

    for(let i = 0; i < clients.size(); i++) {

        const client = clients.get(i);
        if(input.id === client.id) {
            clientAlreadyExist = true;
            console.log('Client already exist!')
            break;
        }
    }

    if(!clientAlreadyExist) {
        clients.add(input);
    }

}

function get() {
    return clients;
}

module.exports = {
    update,
    get
};