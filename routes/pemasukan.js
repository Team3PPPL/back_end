const express = require('express');
const pemasukan = express.Router();
const {
	addCashin,
	getCashin,
	getCashinById,
	deleteCashin,
	updateCashin,
	generateCashinPDF,
} = require('../controller/cashinHandler');

pemasukan.post('/input', addCashin);
pemasukan.get('/', getCashin);
pemasukan.get('/:id', getCashinById);
pemasukan.delete('/delete/:id', deleteCashin);
pemasukan.put('/update/:id', updateCashin);
pemasukan.get('/:id/pdf', generateCashinPDF);

module.exports = pemasukan;
