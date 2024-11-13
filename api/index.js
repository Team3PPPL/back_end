const express = require('express');
const path = require('path');
const app = express();
const cashin = require('../routes/pemasukan');
const cashout = require('../routes/pengeluaran');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/pemasukan', cashin);
app.use('/pengeluaran', cashout);

module.exports = app;
