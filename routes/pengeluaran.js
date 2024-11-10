const express = require('express');
const pengeluaran = express.Router();
const { addCashout, getCashout, getCashoutById, deleteCashout, updateCashout } = require('../controller/cashoutHandler');

pengeluaran.post('/pengeluaran', addCashout);
pengeluaran.get('/pengeluaran', getCashout);
pengeluaran.get('/pengeluaran', getCashoutById);
pengeluaran.delete('/pengeluaran', deleteCashout);
pengeluaran.put('/pemasukan/:id', updateCashout);

module.exports = pengeluaran;
