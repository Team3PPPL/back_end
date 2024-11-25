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
pengeluaran.get('/:decadeId/cashout/:jenisPengeluaran', getCashoutById);
pengeluaran.post('/input/decade', addDecade);
pengeluaran.post('/input/:decadeId/cashout', addCashout);
pengeluaran.delete('/delete/:decadeId/', deleteDecade);
pengeluaran.delete('/delete/:decadeId/cashout/:jenisPengeluaran', deleteCashout);
pengeluaran.put('/update/:decadeId/cashout/:jenisPengeluaran', updateCashout);
pengeluaran.get('/:decadeId/pdf', generateCashoutPDF);

module.exports = pengeluaran;
