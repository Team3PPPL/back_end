const express = require('express');
const siswa = express.Router();
const { addSiswaCowok, addSiswaCewek, getSiswaCowok, getSiswiCewek, getallSiswa } = require('../controller/siswaHandler');

siswa.post('/add/cowok', addSiswaCowok);
siswa.post('/add/cewek', addSiswaCewek);
siswa.get('/total/siswa', getallSiswa);

module.exports = siswa;
