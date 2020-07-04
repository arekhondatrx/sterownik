'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

const init = require('./routes/init');
const config = require('./configReader').getConfig();
const TrafficLights = require('./TrafficLights');
const frontend = require('./websocket');

const traffic = new TrafficLights();
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', init.getRouter(traffic));

const server = http.createServer(app);
server.listen(config.server.port, () => console.log(`Start server on http://localhost:${config.server.port}`));
frontend.init(server, traffic.getClients());

setInterval(() => traffic.start(), config.server.interval);
