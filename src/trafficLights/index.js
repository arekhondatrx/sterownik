'use strict';

const MAX_COLOR_INDEX = 3;
const signalerList = require('../signalerList');
const wsSender = require('../websocket');
const config = require('../configReader').getConfig();
const { GREEN, ORANGE, RED, colors } = require('./lights');

function getState() {
    if(this.color > MAX_COLOR_INDEX) {
        this.color = 0;
    }
    this.color++;

    return this.times[this.color - 1];
}

function getColor(percentageOfGreen) {
    const currentTime = getTime();
    let zeroedTime = 1;

    if(this.blink) {
        return colors.ORANGE;
    }

    if(!this.blink && percentageOfGreen <= config.minAmountOfGreen) {
        console.log(`Percentage of green lights is under 20%, force green`);
        zeroedTime = 0;
    }

    if(currentTime - this.startTime >= this.currentState.time * zeroedTime) {
        this.currentState = getState.bind(this)();
        this.startTime = getTime();
    }

    return this.currentState.color;
}

function getTime() {
    return new Date().getTime() / 1000;
}

function prepareDataForFront(signaler, blink) {
    return {
        id: signaler.id,
        url: signaler.url,
        state: {
            blink,
            color: signaler.currentColor
        }
    };
}

class TrafficLights {

    constructor(db) {
        this.db = db
        this.greenStates = 0;
        this.greenPercentage = 0;
        this.oldPercentage = 0;
    }

    update(signaler) {
        const additionalTime = Math.floor(Math.random() * (config.maxAdditionalTime + 1));
        signaler.times = [ORANGE(0), GREEN(additionalTime), ORANGE(0), RED(additionalTime)];
        signaler.color = Math.floor(Math.random() * (MAX_COLOR_INDEX + 1));
        signaler.previousColor = "";
        signaler.startTime = getTime();
        signaler.currentState = getState.bind(signaler)();
        signaler.currentColor = getColor.bind(signaler)(this.greenPercentage);
        signaler.blink = false;

        signalerList.update(signaler);
    }

    start() {
        this.greenStates = 0;
        const signalers = signalerList.get();
        const signalersSize = signalers.size();

        for(let index = 0; index < signalersSize; index ++) {
            const signaler = signalers[index];
            signaler.currentColor = getColor.bind(signaler)(this.oldPercentage);

            if(signaler.currentColor === colors.GREEN) {
                this.greenStates++;
            }

            if(signaler.previousColor !== signaler.currentColor) {
                signaler.previousColor = signaler.currentColor;
                const result = wsSender.sendData(signaler.currentColor, signaler.id);
                signaler.blink = !result;
                signalerList.update(prepareDataForFront(signaler, !result));
                wsSender.sendData({ percentage: this.greenPercentage, data: signalerList.get() }, 'front');;

                this.db.insert(signaler.id, signaler.currentColor);

                console.log(`Current state: ${signaler.currentColor} for signaler with id: ${signaler.id}`);
            }
        }

        this.greenPercentage = signalersSize === 0 ? 0 : Math.floor((this.greenStates / signalersSize) * 100);
        this.oldPercentage = this.greenPercentage;
        wsSender.sendData({ percentage: this.greenPercentage, data: signalerList.get() }, 'front');

    }

    getClients() {
        return signalerList.get();
    }
}

module.exports = TrafficLights;
