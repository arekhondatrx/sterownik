'use strict';

const MAX_COLOR_INDEX = 3;
const signalerList = require('../signalerList');
const sender = require('../signalerAccessLayer');
const frontSender = require('../websocket');
const config = require('../configReader').getConfig();
const STATUS_OK = require('../utils/httpStauses').STATUS_OK
const { GREEN, ORANGE, RED } = require('./lights');

function getState() {
    if(this.color > MAX_COLOR_INDEX) {
        this.color = 0;
    }
    this.color++;

    return this.times[this.color - 1];
}

function getColor() {
    const currentTime = getTime();

    if(currentTime - this.startTime >= this.currentState.time) {
        this.currentState = getState.bind(this)();
        this.startTime = getTime();
    }

    return this.currentState.color;
}

function getTime() {
    return new Date().getTime() / 1000;
}

function handleResponse(res, signaler) {

    if(res.status != STATUS_OK) {
        signalerList.update(prepareDataForFront(signaler, true));
    }
    else {
        signalerList.update(prepareDataForFront(signaler, false));
    }

    frontSender.sendData(signalerList.get());
    console.log(`Response from signaler[${signaler.id}]: ${JSON.stringify(res)}`)
}

function handleError(err, signaler) {
    console.log(`${err}`);
    signalerList.update(prepareDataForFront(signaler, true));
    frontSender.sendData(signalerList.get());
}

function prepareDataForFront(signaler, blink) {
    return {
        id: signaler.id,
        url: signaler.url,
        state: blink ? 'ORANGE-BLINK' : signaler.currentColor
    };
}

class TrafficLights {

    update(signaler) {
        const additionalTime = Math.floor(Math.random() * (config.maxAdditionalTime + 1));
        signaler.times = [ORANGE(0), GREEN(additionalTime), ORANGE(0), RED(additionalTime)];
        signaler.color = Math.floor(Math.random() * (MAX_COLOR_INDEX + 1));
        signaler.previousColor = "";
        signaler.startTime = getTime();
        signaler.currentState = getState.bind(signaler)();

        signalerList.update(signaler);
    }

    start() {
        const signalers = signalerList.get();
        for(let index = 0; index < signalers.size(); index ++) {
            const signaler = signalers[index];
            signaler.currentColor = getColor.bind(signaler)(signaler.times);

            if(signaler.previousColor !== signaler.currentColor) {
                signaler.previousColor = signaler.currentColor;
                sender.sendData(signaler.currentColor, signaler.url)
                    .then(result => handleResponse(result, signaler))
                    .catch(err => handleError(err, signaler));

                console.log(`Current state: ${signaler.currentColor} for signaler with id: ${signaler.id}`);
            }

        }
    }

    getClients() {
        return signalerList.get();
    }
}

module.exports = TrafficLights;
