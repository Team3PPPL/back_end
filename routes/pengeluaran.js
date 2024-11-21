const express = require('express');
const pengeluaran = express.Router();
const {
	addCashout,
	addDecade,
	deleteCashout,
	updateCashout,
	getAllDecades,
	getDecadeDetail,
	getCashoutById,
	deleteDecade,
	generateCashoutPDF,
} = require('../controller/cashoutHandler');

pengeluaran.get('/', getAllDecades);
pengeluaran.get('/:decadeId', getDecadeDetail);
pengeluaran.get('/:decadeId/cashout/:cashoutId', getCashoutById);
pengeluaran.post('/input/decade', addDecade);
pengeluaran.post('/input/:decadeId/cashout', addCashout);
pengeluaran.delete('/delete/:decadeId/', deleteDecade);
pengeluaran.delete('/delete/:decadeId/cashout/:cashoutId', deleteCashout);
pengeluaran.put('/update/:decadeId/cashout/:cashoutId', updateCashout);
pengeluaran.get('/:decadeId/cashout/pdf', generateCashoutPDF);

module.exports = pengeluaran;
