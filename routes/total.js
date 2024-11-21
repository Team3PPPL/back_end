const express = require('express');
const total = express.Router();
const {
	getAllTotalPemasukan,
	getTotalPemasukanId,
	getAllTotalpengeluaran,
	getTotalPengeluaranId,
} = require('../controller/totalHandler');

total.get('/pemasukan/', getAllTotalPemasukan);
total.get('/pemasukan/:id', getTotalPemasukanId);

total.get('/pengeluaran/', getAllTotalpengeluaran);
total.get('/pengeluaran/:decadeId', getTotalPengeluaranId);
module.exports = total;
