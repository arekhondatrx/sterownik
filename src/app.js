'use strict';

const express = require('express');
const http = require('http');

const config = require('./configReader').getConfig();
const TrafficLights = require('./trafficLights');
const frontend = require('./websocket');
const SignalerDb = require('./db');

const traffic = new TrafficLights(new SignalerDb());
const app = express();

const server = http.createServer(app);
server.listen(config.server.port, () => console.log(`Start server on http://localhost:${config.server.port}`));
frontend.init(server, traffic);

setInterval(() => traffic.start(), config.server.interval);
