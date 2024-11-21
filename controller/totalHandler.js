const { db } = require('../services/dbconnect');

const getAllTotalPemasukan = async (req, res) => {
	try {
		// Mengambil semua dokumen di koleksi 'pemasukan'
		const snapshot = await db.collection('pemasukan').get();

		let totalPemasukan = 0;

		// Iterasi setiap dokumen
		snapshot.docs.forEach((doc) => {
			const data = doc.data();
			// Tambahkan nilai untuk setiap properti yang relevan
			const keys = ['bos', 'kelas1', 'kelas2', 'kelas3', 'kelas4', 'kelas5', 'kelas6'];
			keys.forEach((key) => {
				if (data[key]) {
					totalPemasukan += data[key];
				}
			});
		});

		res.status(200).json({ status: 'BERHASIL', totalPemasukan });
	} catch (error) {
		console.error('Error menghitung total pemasukan:', error);
		res.status(500).json({ status: 'GAGAL', message: 'Gagal menghitung total pemasukan' });
	}
};

const getTotalPemasukanId = async (req, res) => {
	try {
		const { id } = req.params;

		// Mengambil dokumen berdasarkan ID
		const doc = await db.collection('pemasukan').doc(id).get();

		if (!doc.exists) {
			return res.status(404).json({ status: 'GAGAL', message: 'Data tidak ditemukan' });
		}

		const data = doc.data();
		let totalPemasukan = 0;

		// Iterasi untuk setiap properti yang relevan
		const keys = ['bos', 'kelas1', 'kelas2', 'kelas3', 'kelas4', 'kelas5', 'kelas6'];
		keys.forEach((key) => {
			if (data[key]) {
				totalPemasukan += data[key];
			}
		});

		res.status(200).json({ status: 'BERHASIL', totalPemasukan });
	} catch (error) {
		console.error('Error menghitung total pemasukan ID:', error);
		res.status(500).json({ status: 'GAGAL', message: 'Gagal menghitung total pemasukan ID' });
	}
};

const getAllTotalpengeluaran = async (req, res) => {
	try {
		// Mengambil semua dokumen di koleksi 'pengeluaran'
		const snapshot = await db.collection('pengeluaran').get();

		let totalPengeluaran = 0;

		// Iterasi setiap dokumen
		snapshot.docs.forEach((doc) => {
			const cashouts = doc.data().cashouts || {};
			// Iterasi setiap kategori cashout
			for (const category in cashouts) {
				const items = cashouts[category];
				// Iterasi setiap nilai dalam kategori
				for (const key in items) {
					if (typeof items[key] === 'number') {
						totalPengeluaran += items[key];
					}
				}
			}
		});

		res.status(200).json({ status: 'BERHASIL', totalPengeluaran });
	} catch (error) {
		console.error('Error menghitung total pengeluaran:', error);
		res.status(500).json({ status: 'GAGAL', message: 'Gagal menghitung total pengeluaran' });
	}
};

const getTotalPengeluaranId = async (req, res) => {
	try {
		const { decadeId } = req.params;

		// Mengambil dokumen berdasarkan ID
		const doc = await db.collection('pengeluaran').doc(decadeId).get();

		if (!doc.exists) {
			return res.status(404).json({ status: 'GAGAL', message: 'Data tidak ditemukan' });
		}

		const cashouts = doc.data().cashouts || {};
		let totalPengeluaran = 0;

		// Iterasi setiap kategori cashout
		for (const category in cashouts) {
			const items = cashouts[category];
			// Iterasi setiap nilai dalam kategori
			for (const key in items) {
				if (typeof items[key] === 'number') {
					totalPengeluaran += items[key];
				}
			}
		}

		res.status(200).json({ status: 'BERHASIL', totalPengeluaran });
	} catch (error) {
		console.error('Error menghitung total pengeluaran ID:', error);
		res.status(500).json({ status: 'GAGAL', message: 'Gagal menghitung total pengeluaran ID' });
	}
};

module.exports = {
	getAllTotalPemasukan,
	getTotalPemasukanId,
	getAllTotalpengeluaran,
	getTotalPengeluaranId,
};
