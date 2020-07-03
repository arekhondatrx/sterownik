'use strict';

const MAX_COLOR_INDEX = 3;
const MAX_ADDITIONAL_TIME = 15; // config?
const signalerList = require('../signalerList');
const sender = require('../signalerAccessLayer');

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

class TrafficLights {

    update(signaler) {
        const additionalTime = Math.floor(Math.random() * (MAX_ADDITIONAL_TIME + 1));
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
        for(const signaler of signalerList.get()) {
            const currentColor = getColor.bind(signaler)(signaler.times);
            if(signaler.previousColor !== currentColor) {
                signaler.previousColor = currentColor;
                sender.sendData(currentColor, signaler.url)
                    .then(result => console.log(`Response: ${JSON.stringify(result)}`))
                    .catch(err => console.log(`${err}`));
                console.log(`Current state: ${currentColor} for signaler with id: ${signaler.id}`);
            }
        }
    }
}

module.exports = TrafficLights;
