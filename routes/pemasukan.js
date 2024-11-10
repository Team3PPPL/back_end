const express = require('express');
const pemasukan = express.Router();
const { addCashin, getCashin, getCashinById, deleteCashin, updateCashin } = require('../controller/cashinHandler');

pemasukan.post('/pemasukan', addCashin);
pemasukan.get('/pemasukan', getCashin);
pemasukan.get('/pemasukan/:id', getCashinById);
pemasukan.delete('/pemasukan/:id', deleteCashin);
pemasukan.put('/pemasukan/:id', updateCashin);

module.exports = pemasukan;
