'use strict'

const config = require('../configReader').getConfig();

module.exports = {
    GREEN: (additionalTime) => { return { color: 'GREEN', time: config.lightsTime.green + additionalTime };},
    RED: (additionalTime) => { return { color: 'RED', time: config.lightsTime.red + additionalTime};},
    ORANGE: (additionalTime) => { return { color: 'ORANGE', time: config.lightsTime.orange + additionalTime };}
}