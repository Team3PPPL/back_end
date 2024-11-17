const express = require('express');
const pengeluaran = express.Router();
const {
	addCashout,
	getCashout,
	getCashoutById,
	deleteCashout,
	updateCashout,
	finishSummary,
	generateCashoutPDF,
} = require('../controller/cashoutHandler');

pengeluaran.get('/', getCashout);
pengeluaran.get('/:id', getCashoutById);
pengeluaran.post('/input', addCashout);
pengeluaran.delete('/delete/:id', deleteCashout);
pengeluaran.put('/update/:id', updateCashout);
pengeluaran.post('/finishSummary', finishSummary);
pengeluaran.get('/:id/pdf', generateCashoutPDF);

module.exports = pengeluaran;
