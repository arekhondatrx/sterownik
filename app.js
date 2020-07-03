'use strict';

const express = require('express');
const path = require('path');

const init = require('./routes/init');

const app = express();

const port = 2000; // do configu

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', init);

app.listen(port, () => {
  console.log(`Start server on http://localhost:${port}`);
});

module.exports = app;
