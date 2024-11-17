const express = require('express');
const total = express.Router();
const {
	getTotalPemasukanPerId,
	getTotalPemasukanAllIds,
	getTotalPengeluaranAllIds,
	getTotalPengeluaranPerId,
} = require('../controller/totalHandler');

total.get('pemasukan/', getTotalPemasukanAllIds);
total.get('pemasukan/:id', getTotalPemasukanPerId);

total.get('pengeluaran/', getTotalPengeluaranPerId);
total.get('pengeluaran/:id', getTotalPengeluaranAllIds);

module.exports = total;
