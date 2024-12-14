const { db } = require('../services/dbconnect');
const fs = require('fs');
const path = require('path');

const getCurrentId = async () => {
	const cashoutSnapshot = await db.collection('pengeluaran').orderBy('id', 'desc').limit(1).get();
	if (cashoutSnapshot.empty) {
		return 0;
	}

	const cashout = cashoutSnapshot.docs[0].data();
	return cashout.id;
};

const addCashout = async (req, res) => {
	try {
		const { decadeId } = req.params;

		// Field yang valid untuk cashout
		const cashoutFields = [
			'Administrasi atau ATK',
			'Biaya Rapat',
			'Bos Buku',
			'BTT',
			'Futsal dan Sewa Lapangan',
			'Honor Guru MI',
			'Honor Keamanan',
			'Honor Kebersihan',
			'Honor Pendamping',
			'Internet',
			'Kaligrafi',
			'Komputer',
			'Konsumsi Guru',
			'Kontribusi Yayasan',
			'Langganan Sampah',
			'Listrik atau Telepon',
			'Operasional Bos + LPJ',
			'Paskibra',
			'Pencak Silat',
			'Perbankan',
			'PKG atau PKM',
			'Pramuka',
			"Qiro'at",
			'Sarana dan Prasarana',
			'Transport Dinas',
		];

		// Validasi field input
		const newCashout = {};
		for (const field in req.body) {
			if (!cashoutFields.includes(field)) {
				return res.status(400).json({
					status: 'GAGAL',
					message: `Field '${field}' tidak valid.`,
				});
			}
			newCashout[field] = req.body[field];
		}

		// Ambil data decade dari database
		const decadeRef = db.collection('pengeluaran').doc(String(decadeId));
		const decadeDoc = await decadeRef.get();

		if (!decadeDoc.exists) {
			return res.status(404).json({
				status: 'GAGAL',
				message: 'Decade tidak ditemukan.',
			});
		}

		const decadeData = decadeDoc.data();
		decadeData.cashouts = decadeData.cashouts || {};

		// Iterasi berdasarkan jenis pengeluaran sebagai kunci
		Object.keys(newCashout).forEach((jenisPengeluaran) => {
			const nilaiPengeluaran = newCashout[jenisPengeluaran];
			decadeData.cashouts[jenisPengeluaran] = {
				totalPengeluaran: nilaiPengeluaran,
				createdAt: new Date().toISOString(),
			};
		});

		// Simpan kembali data ke database
		await decadeRef.set(decadeData);

		// Format data untuk respons
		const cashoutsArray = Object.keys(decadeData.cashouts).map((key) => ({
			jenisPengeluaran: key,
			totalPengeluaran: decadeData.cashouts[key].totalPengeluaran,
			createdAt: decadeData.cashouts[key].createdAt,
		}));

		// Kirimkan respons
		res.status(200).json({
			status: 'BERHASIL',
			message: 'Data decade berhasil diambil',
			data: {
				id: decadeId,
				decade: decadeData.decade || null,
				createdAt: decadeData.createdAt || null,
				updatedAt: new Date().toISOString(),
				cashouts: cashoutsArray,
			},
		});
	} catch (error) {
		console.error('Error saat menambahkan data pengeluaran:', error);
		res.status(500).json({
			status: 'GAGAL',
			message: 'Input pengeluaran gagal ditambahkan.',
		});
	}
};

const addDecade = async (req, res) => {
	try {
		let currentId = await getCurrentId();
		const id = ++currentId;

		const { decade } = req.body;
		const createdAt = new Date().toISOString();
		const decadeDate = new Date(decade).toISOString();

		const newDecade = {
			id,
			decade: decadeDate,
			createdAt,
			updatedAt: createdAt,
			cashouts: {},
		};

		await db.collection('pengeluaran').doc(String(id)).set(newDecade);

		res.status(200).json({
			status: 'BERHASIL',
			message: 'Data decade berhasil ditambahkan',
			data: { id },
		});
	} catch (error) {
		console.error('Error saat menambahkan decade:', error);
		res.status(500).json({
			status: 'GAGAL',
			message: 'Decade gagal ditambahkan',
		});
	}
};

const getAllDecades = async (req, res) => {
	try {
		const snapshot = await db.collection('pengeluaran').get();
		const decades = snapshot.docs.map((doc) => {
			const data = doc.data();
			// Ubah cashouts ke dalam bentuk array
			const cashoutsArray = Object.entries(data.cashouts || {}).map(([key, value]) => ({
				jenisPengeluaran: key,
				...value,
			}));
			return {
				id: doc.id,
				...data,
				cashouts: cashoutsArray,
			};
		});

		res.status(200).json({
			status: 'BERHASIL',
			message: 'Data decade berhasil diambil',
			data: decades,
		});
	} catch (error) {
		console.error('Error saat mengambil data decades:', error);
		res.status(500).json({
			status: 'GAGAL',
			message: 'Gagal mengambil data decades',
		});
	}
};

const getDecadeDetail = async (req, res) => {
	try {
		const { decadeId } = req.params;
		const decadeRef = db.collection('pengeluaran').doc(decadeId);
		const decadeDoc = await decadeRef.get();

		if (!decadeDoc.exists) {
			return res.status(404).json({
				status: 'GAGAL',
				message: 'Decade tidak ditemukan',
			});
		}

		const data = decadeDoc.data();
		// Ubah cashouts ke dalam bentuk array
		const cashoutsArray = Object.entries(data.cashouts || {}).map(([key, value]) => ({
			jenisPengeluaran: key,
			...value,
		}));

		const decadeData = {
			id: decadeDoc.id,
			...data,
			cashouts: cashoutsArray,
		};

		res.status(200).json({
			status: 'BERHASIL',
			message: 'Data decade berhasil diambil',
			data: decadeData,
		});
	} catch (error) {
		console.error('Error saat mengambil detail decade:', error);
		res.status(500).json({
			status: 'GAGAL',
			message: 'Gagal mengambil detail decade',
		});
	}
};

const getCashoutById = async (req, res) => {
	try {
		const { decadeId, jenisPengeluaran } = req.params;

		const decadeRef = db.collection('pengeluaran').doc(decadeId);
		const decadeDoc = await decadeRef.get();

		if (!decadeDoc.exists) {
			return res.status(404).json({
				status: 'GAGAL',
				message: 'Decade tidak ditemukan',
			});
		}

		const decadeData = decadeDoc.data();
		const cashouts = decadeData.cashouts || {};
		const cashout = cashouts[jenisPengeluaran];

		if (!cashout) {
			return res.status(404).json({
				status: 'GAGAL',
				message: 'Cashout tidak ditemukan',
			});
		}

		res.status(200).json({
			status: 'BERHASIL',
			message: 'Data cashout berhasil diambil',
			data: { jenisPengeluaran, ...cashout },
		});
	} catch (error) {
		console.error('Error saat mengambil detail cashout:', error);
		res.status(500).json({
			status: 'GAGAL',
			message: 'Gagal mengambil detail cashout',
		});
	}
};

const updateCashout = async (req, res) => {
	try {
		const { decadeId, jenisPengeluaran } = req.params;
		const updatedCashoutData = req.body;

		const decadeRef = db.collection('pengeluaran').doc(decadeId);
		const decadeDoc = await decadeRef.get();

		if (!decadeDoc.exists) {
			return res.status(404).json({
				status: 'GAGAL',
				message: 'Decade tidak ditemukan',
			});
		}

		const decadeData = decadeDoc.data();
		const cashouts = decadeData.cashouts || {};

		// Check if the specific jenisPengeluaran exists as a key
		if (!cashouts[jenisPengeluaran]) {
			return res.status(404).json({
				status: 'GAGAL',
				message: `Cashout dengan jenis "${jenisPengeluaran}" tidak ditemukan`,
			});
		}

		// Update hanya pada key jenisPengeluaran
		cashouts[jenisPengeluaran] = {
			...cashouts[jenisPengeluaran],
			...updatedCashoutData, // Menggabungkan data baru
			updatedAt: new Date().toISOString(),
		};

		await decadeRef.update({ cashouts });

		res.status(200).json({
			status: 'BERHASIL',
			message: 'Cashout berhasil diperbarui',
			data: { [jenisPengeluaran]: cashouts[jenisPengeluaran] },
		});
	} catch (error) {
		console.error('Error saat memperbarui cashout:', error);
		res.status(500).json({
			status: 'GAGAL',
			message: 'Cashout gagal diperbarui',
		});
	}
};

const deleteDecade = async (req, res) => {
	try {
		const { decadeId } = req.params;

		const decadeRef = db.collection('pengeluaran').doc(decadeId);
		const decadeDoc = await decadeRef.get();

		if (!decadeDoc.exists) {
			return res.status(404).json({
				status: 'GAGAL',
				message: 'Decade tidak ditemukan',
			});
		}

		// Menghapus data decade
		await decadeRef.delete();

		res.status(200).json({
			status: 'BERHASIL',
			message: 'Decade berhasil dihapus',
			data: { decadeId },
		});
	} catch (error) {
		console.error('Error saat menghapus decade:', error);
		res.status(500).json({
			status: 'GAGAL',
			message: 'Decade gagal dihapus',
		});
	}
};

const deleteCashout = async (req, res) => {
	try {
		const { decadeId, jenisPengeluaran } = req.params;

		const decadeRef = db.collection('pengeluaran').doc(decadeId);
		const decadeDoc = await decadeRef.get();

		if (!decadeDoc.exists) {
			return res.status(404).json({
				status: 'GAGAL',
				message: 'Decade tidak ditemukan',
			});
		}

		const decadeData = decadeDoc.data();
		const cashouts = decadeData.cashouts || {};

		if (!cashouts[jenisPengeluaran]) {
			return res.status(404).json({
				status: 'GAGAL',
				message: 'Cashout tidak ditemukan',
			});
		}

		delete cashouts[jenisPengeluaran];
		await decadeRef.update({ cashouts });

		res.status(200).json({
			status: 'BERHASIL',
			message: 'Cashout berhasil dihapus',
			data: { jenisPengeluaran },
		});
	} catch (error) {
		console.error('Error saat menghapus cashout:', error);
		res.status(500).json({
			status: 'GAGAL',
			message: 'Cashout gagal dihapus',
		});
	}
};

const generateCashoutPDF = async (req, res) => {
	try {
		const { decadeId } = req.params;

		// Mengambil data decade dari database
		const decadeRef = db.collection('pengeluaran').doc(decadeId);
		const decadeDoc = await decadeRef.get();

		if (!decadeDoc.exists) {
			return res.status(404).send('Data tidak ditemukan');
		}

		const decadeData = decadeDoc.data();
		const cashouts = decadeData.cashouts || {};

		// Format data cashouts menjadi array untuk template HTML
		const tableData = Object.keys(cashouts).map((key) => ({
			deskripsi: key,
			nilai: new Intl.NumberFormat('id-ID', {
				style: 'currency',
				currency: 'IDR',
			}).format(cashouts[key].totalPengeluaran),
		}));

		// Hitung total pengeluaran
		const totalPengeluaran = Object.values(cashouts).reduce((sum, item) => sum + item.totalPengeluaran, 0);

		// Format total pengeluaran
		const totalPengeluaranFormatted = new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
		}).format(totalPengeluaran);

		// Ambil dan format informasi tanggal pemasukan
		const informasiTanggal = decadeData.decade
			? (() => {
					const date = new Date(decadeData.decade);
					return isNaN(date) ? 'Tanggal tidak tersedia' : `${date.getFullYear()}/${date.getFullYear() + 1}`;
			  })()
			: 'Tanggal tidak tersedia';

		// Membaca template HTML
		const htmlTemplate = fs.readFileSync(path.join(__dirname, '../public', 'laporan-pengeluaran.html'), 'utf-8');

		// Inject data ke dalam template HTML
		const htmlContent = htmlTemplate
			.replace('{{data}}', JSON.stringify(tableData))
			.replace('{{totalPengeluaran}}', totalPengeluaranFormatted)
			.replace('{{informasiTanggal}}', informasiTanggal);

		// Mengirimkan output HTML
		res.set('Content-Type', 'text/html');
		res.send(htmlContent);
	} catch (error) {
		console.error('Error saat membuat laporan HTML:', error);
		res.status(500).send('Terjadi kesalahan saat membuat laporan.');
	}
};

module.exports = {
	addCashout,
	addDecade,
	getAllDecades,
	getDecadeDetail,
	getCashoutById,
	updateCashout,
	deleteCashout,
	deleteDecade,
	generateCashoutPDF,
};
