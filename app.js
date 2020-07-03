'use strict';

const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');

const init = require('./routes/init');

const TrafficLights = require('./TrafficLights');
const traffic = new TrafficLights(null);

const app = express();

const port = 2000; // do configu

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', init.getRouter(traffic));

app.listen(port, () => {
  console.log(`Start server on http://localhost:${port}`);
});

setInterval(() => traffic.start(), 100);
