'use strict';

const express = require('express');
const bodyParser = require('body-parser')

const init = require('./routes/init');
const config = require('./configReader').getConfig();
const TrafficLights = require('./TrafficLights');

const traffic = new TrafficLights();
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', init.getRouter(traffic));

app.listen(config.server.port, () => {
  console.log(`Start server on http://localhost:${config.server.port}`);
});

setInterval(() => traffic.start(), config.server.interval);
