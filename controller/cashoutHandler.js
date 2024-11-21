const { db } = require('../services/dbconnect');
const fs = require('fs');
const path = require('path');

const formatToRupiah = (amount) => {
	return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
};

const formatValue = (value) => {
	if (value === null || value === undefined || value === 0) {
		return '-';
	}
	return formatToRupiah(value);
};

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

		const cashoutFields = [
			'Kontribusi Yayasan',
			'Honor Guru MI',
			'Honor Keamanan',
			'Honor Kebersihan',
			'Honor Pendamping',
			'Komputer',
			'Pramuka',
			'Paskibra',
			'Kaligrafi',
			'Pencak Silat',
			'Futsal & Sewa Lapangan',
			"Qiro'at",
			'Listrik / Telepon',
			'Internet',
			'Administrasi / ATK',
			'Sarana dan Prasarana',
			'PKG / PKM',
			'Transport Dinas',
			'Biaya Rapat',
			'Konsumsi Guru',
			'Langganan Sampah',
			'Perbankan',
			'Bos Buku',
			'Operasional Bos + LPJ',
			'BTT',
			'Tanggal Pengeluaran',
		];

		const newCashout = {};

		for (const field in req.body) {
			if (!cashoutFields.includes(field)) {
				return res.status(404).json({
					status: 'GAGAL',
					message: `Data Tidak Sesuai: Field '${field}' tidak ditemukan dalam daftar field yang valid`,
				});
			}
			newCashout[field] = req.body[field];
		}
		newCashout['createdAt'] = new Date().toISOString();
		const cashoutId = new Date().getTime().toString();

		const decadeRef = db.collection('pengeluaran').doc(String(decadeId));
		const decadeDoc = await decadeRef.get();

		if (!decadeDoc.exists) {
			return res.status(404).json({
				status: 'GAGAL',
				message: 'Decade tidak ditemukan',
			});
		}

		const decadeData = decadeDoc.data();
		decadeData.cashouts = decadeData.cashouts || {};
		decadeData.cashouts[cashoutId] = newCashout;

		await decadeRef.set(decadeData);

		res.status(200).json({
			status: 'BERHASIL',
			message: 'Data berhasil ditambahkan',
			data: { decadeId, cashoutId },
		});
	} catch (error) {
		console.error('Error saat menambahkan data pengeluaran:', error);
		res.status(500).json({
			status: 'GAGAL',
			message: 'Input pengeluaran gagal ditambahkan',
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
		const decades = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

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

		const decadeData = {
			id: decadeDoc.id,
			...decadeDoc.data(),
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
		const { decadeId, cashoutId } = req.params;

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

		const cashout = cashouts[cashoutId];

		if (!cashout) {
			return res.status(404).json({
				status: 'GAGAL',
				message: 'Cashout tidak ditemukan',
			});
		}

		res.status(200).json({
			status: 'BERHASIL',
			message: 'Data cashout berhasil diambil',
			data: { cashoutId, ...cashout },
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
		const { decadeId, cashoutId } = req.params;
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
		const cashout = cashouts[cashoutId];

		if (!cashout) {
			return res.status(404).json({
				status: 'GAGAL',
				message: 'Cashout tidak ditemukan',
			});
		}

		cashouts[cashoutId] = {
			...cashouts[cashoutId],
			...updatedCashoutData,
			updatedAt: new Date().toISOString(),
		};

		await decadeRef.update({ cashouts });

		res.status(200).json({
			status: 'BERHASIL',
			message: 'Cashout berhasil diperbarui',
			data: { cashoutId, ...cashouts[cashoutId] },
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
		const { decadeId, cashoutId } = req.params;

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

		if (!cashouts[cashoutId]) {
			return res.status(404).json({
				status: 'GAGAL',
				message: 'Cashout tidak ditemukan',
			});
		}

		delete cashouts[cashoutId];
		await decadeRef.update({ cashouts });

		res.status(200).json({
			status: 'BERHASIL',
			message: 'Cashout berhasil dihapus',
			data: { cashoutId },
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
		const decadeDoc = await db.collection('pengeluaran').doc(decadeId).get();

		if (!decadeDoc.exists) return res.status(404).json({ status: 'GAGAL', message: 'Decade tidak ditemukan' });

		const { cashouts = {}, decade } = decadeDoc.data();

		if (Object.keys(cashouts).length === 0)
			return res.status(404).json({ status: 'GAGAL', message: 'Tidak ada cashout untuk decade ini' });

		// Format total pengeluaran dan data tabel
		const tableData = Object.entries(cashouts).flatMap(([_, cashout]) =>
			Object.entries(cashout)
				.filter(([key]) => !['createdAt', 'updatedAt'].includes(key))
				.map(([key, value]) => ({ deskripsi: key, nilai: formatValue(value || '-') }))
		);

		const totalPengeluaran = Object.entries(cashouts)
			.flatMap(([_, cashout]) =>
				Object.values(cashout)
					.filter((value) => !['createdAt', 'updatedAt'].includes(value))
					.map((value) => Number(value) || 0)
			)
			.reduce((total, nilai) => total + nilai, 0);

		// Format tahun untuk decade menjadi "YYYY/YYYY"
		const informasiTanggal = decade
			? new Date(decade).getFullYear() + '/' + (new Date(decade).getFullYear() + 1)
			: 'Tanggal tidak tersedia';

		// Tambahkan Total Pengeluaran ke dalam data tabel
		tableData.push({ deskripsi: `Total Pengeluaran (${informasiTanggal})`, nilai: formatValue(totalPengeluaran) });

		// Kirimkan HTML dengan data yang telah diproses
		const htmlTemplate = fs.readFileSync(path.join(__dirname, '../public', 'laporan-pengeluaran.html'), 'utf-8');
		const htmlContent = htmlTemplate.replace('{{data}}', JSON.stringify(tableData));
		res.setHeader('Content-Type', 'text/html').send(htmlContent);
	} catch (error) {
		console.error('Error saat membuat laporan:', error);
		res.status(500).json({ status: 'GAGAL', message: 'Gagal membuat laporan' });
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
