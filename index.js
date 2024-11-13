const express = require('express');
const path = require('path');
const app = express();
const cashin = require('./routes/pemasukan');
const cashout = require('./routes/pengeluaran');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/', cashin);
app.use('/', cashout);

app.use((err, req, res, next) => {
	console.error('Stack trace:', err.stack);
	res.status(500).send('Something broke!');
});

module.exports = app;
