const express = require('express');
const pemasukan = express.Router();
const { addCashin, getCashin, getByIdCashin, delCashin } = require('../controller/cashinHandler');

pemasukan.post('/pemasukan', addCashin);
pemasukan.get('/pemasukan', getCashin);
pemasukan.get('/pemasukan', getByIdCashin);
pemasukan.delete('/pemasukan', delCashin);

module.exports = pemasukan;
