const express = require('express');
const pengeluaran = express.Router();
const { addCashout, getCashout, getByIdCashout, delCashout } = require('../controller/cashoutHandler');

pengeluaran.post('/pengeluaran', addCashout);
pengeluaran.get('/pengeluaran', getCashout);
pengeluaran.get('/pengeluaran', getByIdCashout);
pengeluaran.delete('/pengeluaran', delCashout);

module.exports = pengeluaran;
