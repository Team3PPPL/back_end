const express = require('express');
const path = require('path');
const app = express();
const cashin = require('./routes/pemasukan');
const cashout = require('./routes/pengeluaran');
const total = require('./routes/total');

const startoServer = async () => {
	const port = process.env.PORT || 3000;
	app.use(express.json());

	try {
		app.use(express.static(path.join(__dirname, 'public')));
		app.get('/', (req, res) => {
			res.sendFile(path.join(__dirname, 'public', 'index.html'));
		});

		app.use('/total', total);
		app.use('/pemasukan', cashin);
		app.use('/pengeluaran', cashout);

		app.listen(port, () => {
			console.log(`http://localhost:${port}`);
		});
	} catch (error) {
		console.error('Stack trace:', error.stack);
	}
};

startoServer().catch((err) => {
	console.error('Error yang tidak terduga saat Server mulai: ', err.message);
});
