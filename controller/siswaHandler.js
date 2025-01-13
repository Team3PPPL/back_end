const { db } = require('../services/dbconnect');

const getCurrentId = async () => {
	const siswaSnapshot = await db.collection('siswa').orderBy('id', 'desc').limit(1).get();
	if (siswaSnapshot.empty) {
		return 0;
	}

	const siswa = siswaSnapshot.docs[0].data();
	return siswa.id;
};

const addSiswaCowok = async (req, res) => {
	try {
		const { siswacowok } = req.body;

		if (!siswacowok || isNaN(siswacowok)) {
			return res.status(400).json({
				status: 'GAGAL',
				message: 'Input tidak valid. siswacowok harus berupa angka.',
			});
		}

		let currentId = await getCurrentId();
		const id = ++currentId;

		const newSiswa = { id, siswacowok: parseInt(siswacowok) };

		await db.collection('siswa').doc(String(id)).set(newSiswa);

		res.status(200).json({
			status: 'BERHASIL',
			message: 'Data siswa cowok berhasil ditambah',
			data: { id },
		});
	} catch (error) {
		console.error('Error Saat Menambahkan Data Siswa Cowok:', error);
		res.status(500).json({
			status: 'GAGAL',
			message: 'Data siswa cowok gagal ditambahkan',
		});
	}
};

const addSiswaCewek = async (req, res) => {
	try {
		const { siswacewek } = req.body;

		// Validasi input
		if (!siswacewek || isNaN(siswacewek)) {
			return res.status(400).json({
				status: 'GAGAL',
				message: 'Input tidak valid. siswacewek harus berupa angka.',
			});
		}

		let currentId = await getCurrentId();
		const id = ++currentId;

		const newSiswa = { id, siswacewek: parseInt(siswacewek) };

		await db.collection('siswa').doc(String(id)).set(newSiswa);

		res.status(200).json({
			status: 'BERHASIL',
			message: 'Data siswa cewek berhasil ditambah',
			data: { id },
		});
	} catch (error) {
		console.error('Error Saat Menambahkan Data Siswa Cewek:', error);
		res.status(500).json({
			status: 'GAGAL',
			message: 'Data siswa cewek gagal ditambahkan',
		});
	}
};

const getallSiswa = async (req, res) => {
	try {
		// Ambil semua data dari koleksi siswa
		const siswaSnapshot = await db.collection('siswa').get();
		const siswaData = siswaSnapshot.docs.map((doc) => doc.data());

		// Hitung total siswa cowok dan cewek
		let totalSiswaCowok = 0;
		let totalSiswaCewek = 0;

		siswaData.forEach((siswa) => {
			if (siswa.siswacowok) {
				totalSiswaCowok += parseInt(siswa.siswacowok);
			}
			if (siswa.siswacewek) {
				totalSiswaCewek += parseInt(siswa.siswacewek);
			}
		});

		// Kirimkan response
		res.status(200).json({
			status: 'BERHASIL',
			message: 'Total data siswa berhasil diambil',
			data: {
				totalSiswaCowok,
				totalSiswaCewek,
				totalKeseluruhan: totalSiswaCowok + totalSiswaCewek,
			},
		});
	} catch (error) {
		console.error('Error Saat Mengambil Total Data Siswa:', error);
		res.status(500).json({
			status: 'GAGAL',
			message: 'Total data siswa gagal diambil',
		});
	}
};

module.exports = {
	addSiswaCowok,
	addSiswaCewek,
	getallSiswa,
};
