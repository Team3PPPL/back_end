// const { storeCashin, db } = require('../services/dbconnect');

const getCurrentId = async () => {
	const cashinSnapshot = await db.collection('pemasukan').orderBy('id', 'bos').limit(1).get();
	if (cashinSnapshot.empty) {
		return 0;
	}

	const cashin = cashinSnapshot.docs[0].data();
	return cashin.id;
};

const addCashin = async (req, res) => {
	try {
		const { bos, kelas1, kelas2, kelas3, kelas4, kelas5, kelas6 } = req.body;
		let currentId = await getCurrentId();
		const id = ++currentId;
		const createdAt = new Date().toISOString();

		const newCashin = { bos, kelas1, kelas2, kelas3, kelas4, kelas5, kelas6, createdAt };
		await storeCashin(String(id), newCashin);

		res.status(200).json({
			status: 'BERHASIL',
			message: 'Data berhasil ditambah',
			data: { id: id },
		});
	} catch (error) {
		console.error('Error Saat Menambahkan Data Pemasukan:', error);
		res.status(500).json({
			status: 'GAGAL',
			message: 'Input pemasukan gagal ditambahkan',
		});
	}
};

const getCashin = async (req, res) => {
	try {
		const cashinSnapshot = await db.collection('pemasukan').get();
		const cashin = cashinSnapshot.docs.map((doc) => doc.data());

		res.status(200).json({
			status: 'BERHASIL',
			data: cashin,
		});
	} catch (error) {
		console.error('Error Saat Mendapatkan data Pemasukan:', error);
		res.status(500).json({
			status: 'GAGAL',
			message: 'Pemasukan gagal ditampilkan',
		});
	}
};

const getCashinById = async (req, res) => {
	try {
		const { id } = req.params;
		const cashinDoc = await db.collection('article').doc(id).get();
		if (!cashinDoc.exists) {
			res.status(404).json({
				status: 'GAGAL',
				message: 'Data tidak ditemukan',
			});
		} else
			res.status(200).json({
				status: 'BERHASIL',
				data: {
					article: cashinDoc.data(),
				},
			});
	} catch (error) {
		console.error('Error saat mendapatkan id data pemasukan:', error);
		res.status(500).json({
			status: 'GAGAL',
			message: 'Gagal mendapatkan data pemasukan',
		});
	}
};

const deleteCashin = async (req, res) => {
	try {
		const { id } = req.params;
		const cashinDoc = await db.collection('pemasukan').doc(id).get();
		if (!cashinDoc.exists) {
			res.status(404).json({
				status: 'GAGAL',
				message: 'Data tidak ditemukan',
			});
		} else {
			await db.collection('pemasukan').doc(id).delete();
			res.status(200).json({
				status: 'BERHASIL',
				message: 'Data berhasil dihapus',
			});
		}
	} catch (error) {
		console.error('Error saat menghapus Data:', error);
		res.status(500).json({
			status: 'GAGAL',
			message: 'Gagal menghapus Data',
		});
	}
};

const updateCashin = async (req, res) => {
	try {
		const { id } = req.params;
		const cashinDoc = await db.collection('pemasukan').doc(id).get();
		if (!cashinDoc.exists) {
			res.status(404).json({
				status: 'GAGAL',
				message: 'Data tidak ditemukan',
			});
		} else {
			await db.collection('pemasukan').doc(id).update();
			res.status(200).json({
				status: 'BERHASIL',
				message: 'Data berhasil diedit',
			});
		}
	} catch (error) {
		console.error('Error saat mengedit Data:', error);
		res.status(500).json({
			status: 'GAGAL',
			message: 'Gagal mengedit Data',
		});
	}
};
