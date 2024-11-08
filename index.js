const express = require('express');
const app = express();

const startoServer = async () => {
	const port = 3000;
	app.get('/', (req, res) => {
		res.send('Hai ini API Server Dari Aplikasi SPP Android hehehe!');
	});

	app.listen(port, () => {
		console.log(`http://localhost:${port}`);
	});
};

startoServer().catch((err) => {
	console.error('Error yang tidak terduga saat Server mulai: ', err.message);
});
