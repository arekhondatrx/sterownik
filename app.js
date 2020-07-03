'use strict';

const express = require('express');
const path = require('path');

const init = require('./routes/init');

const TrafficLights = require('./TrafficLights');
const traffic = new TrafficLights(null);
traffic.update({id: 1});
traffic.update({id: 2});

const app = express();

const port = 2000; // do configu

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', init);

app.listen(port, () => {
  console.log(`Start server on http://localhost:${port}`);
});

setInterval(() => traffic.start(), 100);
