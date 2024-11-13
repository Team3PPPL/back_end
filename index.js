const express = require('express');
const path = require('path');
const app = express();
const cashin = require('./routes/pemasukan');
const cashout = require('./routes/pengeluaran');

const startoServer = async () => {
	const port = process.env.PORT || 3000;
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(express.static(path.join(__dirname, 'public')));

	try {
		app.get('/', (req, res) => {
			res.sendFile(path.join(__dirname, 'public', 'index.html'));
		});

		app.use('/', cashin);
		app.use('/', cashout);

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
