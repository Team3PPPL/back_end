const express = require('express');
const total = express.Router();
const { getTotalPerId, getTotalAllIds } = require('../controller/totalHandler');

total.get('/:id', getTotalPerId);
total.get('/', getTotalAllIds);

module.exports = total;
