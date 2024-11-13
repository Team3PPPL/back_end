const express = require('express');
const pengeluaran = express.Router();
const { addCashout, getCashout, getCashoutById, deleteCashout, updateCashout } = require('../controller/cashoutHandler');

pengeluaran.post('/', addCashout);
pengeluaran.get('/', getCashout);
pengeluaran.get('/:id', getCashoutById);
pengeluaran.delete('/:id', deleteCashout);
pengeluaran.put('/:id', updateCashout);

module.exports = pengeluaran;
