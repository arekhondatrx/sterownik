'use strict';

const yaml = require('js-yaml');
const fs = require('fs');
const p = require('path');

let config  = null;

function getConfig() {
    try {
        if(!config) {
            const path = p.resolve(__dirname, '../config.yml');
            config = yaml.safeLoad(fs.readFileSync(path, 'utf8'));
            console.log('Config load successfully!');
        }
        return config;
    } catch (e) {
        console.log(`Cannot load config: ${e}!`);
        return null;
    }
}

module.exports = {
    getConfig
};