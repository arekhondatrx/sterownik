'use strict'

const config = require('../configReader').getConfig();

const colors = {
    GREEN: 'GREEN',
    RED: 'RED',
    ORANGE: 'ORANGE'
}

module.exports = {
    GREEN: (additionalTime) => { return { color: colors.GREEN, time: config.lightsTime.green + additionalTime };},
    RED: (additionalTime) => { return { color: colors.RED, time: config.lightsTime.red + additionalTime};},
    ORANGE: (additionalTime) => { return { color: colors.ORANGE, time: config.lightsTime.orange + additionalTime };},
    colors
}