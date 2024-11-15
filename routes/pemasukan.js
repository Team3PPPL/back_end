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

pemasukan.post('/', addCashin);
pemasukan.get('/', getCashin);
pemasukan.get('/:id', getCashinById);
pemasukan.delete('/:id', deleteCashin);
pemasukan.put('/:id', updateCashin);
pemasukan.get('/:id/pdf', generateCashinPDF);

module.exports = pemasukan;
