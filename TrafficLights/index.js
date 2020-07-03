'use strict';

const MAX_COLOR_INDEX = 3;
const signalerList = require('../signalerList');
const sender = require('../signalerAccessLayer');
const config = require('../configReader').getConfig();

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

function handleResponse(res, index, id) {

    if(res.status != 200) {
        removeSignaler(index, id);
        return;
    }
    console.log(`Response from signaler[${id}]: ${JSON.stringify(res)}`)
}

function handleError(err, index, id) {
    console.log(`${err}`);
    removeSignaler(index, id);
}

function removeSignaler(index, id) {
    signalerList.get().remove(index);
    console.log(`Signaler with id: ${id}, not responding. Removed from signaler list!`);
}

class TrafficLights {

    update(signaler) {
        const additionalTime = Math.floor(Math.random() * (config.maxAdditionalTime + 1));
        signaler.times = [
            { color: 'ORANGE', time: 1 },
            { color: 'GREEN', time: 4 + additionalTime},
            { color: 'ORANGE', time: 1 },
            { color: 'RED', time: 3 + additionalTime}];

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
            const currentColor = getColor.bind(signaler)(signaler.times);

            if(signaler.previousColor !== currentColor) {
                signaler.previousColor = currentColor;
                sender.sendData(currentColor, signaler.url)
                    .then(result => handleResponse(result, index, signaler.id))
                    .catch(err => handleError(err, index, signaler.id));

                console.log(`Current state: ${currentColor} for signaler with id: ${signaler.id}`);
            }
        }
    }
}

module.exports = TrafficLights;
