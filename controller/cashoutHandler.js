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

const incrementAndSetNewId = async () => {
	const lastId = await getCurrentId();
	const newId = lastId + 1;

	await db.collection('pengeluaran').doc('currentId').set({ id: newId });

	return newId;
};

const addCashout = async (req, res) => {
	try {
		let currentId = await getCurrentId();
		const createdAt = new Date().toISOString();

		let pengeluaranDate = null;
		if (req.body.tanggalPemasukan) {
			pengeluaranDate = new Date(req.body.tanggalPengeluaran).toISOString().split('T')[0];
		}

		const allowedFields = [
			'kontribusiYayasan',
			'honorGurumi',
			'honorKeamanan',
			'honorKebersihan',
			'honorPendamping',
			'eskomputer',
			'espramuka',
			'espaskibra',
			'eskaligrafi',
			'essilat',
			'esfutsal',
			'esqiroat',
			'oplistrik',
			'opinternet',
			'opadm',
			'opgedung',
			'oppkg',
			'optransport',
			'oprapat',
			'opkonsum',
			'opsampah',
			'perbankan',
			'bosGuru',
			'opBus',
			'btt',
			'tanggalPengeluaran',
		];

		const newEntry = { id: currentId };
		allowedFields.forEach((field) => {
			if (req.body[field] !== undefined) {
				if (field === 'tanggalPengeluaran' && pengeluaranDate) {
					newEntry[field] = pengeluaranDate;
				} else {
					newEntry[field] = req.body[field];
				}
			}
		});

		const docRef = db.collection('pengeluaran').doc(String(currentId));
		const docSnapshot = await docRef.get();

		let updatedCashout;

		if (docSnapshot.exists) {
			const existingData = docSnapshot.data();
			updatedCashout = {
				...existingData,
				...newEntry,
				updatedAt: createdAt,
			};
		} else {
			updatedCashout = {
				...newEntry,
				createdAt,
			};
		}

		await docRef.set(updatedCashout);

		res.status(200).json({
			status: 'BERHASIL',
			message: 'Data berhasil ditambahkan atau diperbarui',
			data: { id: currentId },
		});
	} catch (error) {
		console.error('Error saat menambahkan data pengeluaran:', error);
		res.status(500).json({
			status: 'GAGAL',
			message: 'Input pengeluaran gagal ditambahkan',
		});
	}
};

const generateCashoutPDF = async (req, res) => {
	try {
		const { id } = req.params;
		const cashoutDoc = await db.collection('pengeluaran').doc(id).get();
		if (!cashoutDoc.exists) {
			return res.status(404).json({
				status: 'GAGAL',
				message: 'Data tidak ditemukan',
			});
		}

		const cashoutData = cashoutDoc.data();

		const kontribusiYayasan = cashoutData.kontribusiYayasan || 0;
		const honorGurumi = cashoutData.honorGurumi || 0;
		const honorKeamanan = cashoutData.honorKeamanan || 0;
		const honorKebersihan = cashoutData.honorKebersihan || 0;
		const honorPendamping = cashoutData.honorPendamping || 0;
		const eskomputer = cashoutData.eskomputer || 0;
		const espramuka = cashoutData.espramuka || 0;
		const espaskibra = cashoutData.espaskibra || 0;
		const eskaligrafi = cashoutData.eskaligrafi || 0;
		const essilat = cashoutData.essilat || 0;
		const esfutsal = cashoutData.esfutsal || 0;
		const oplistrik = cashoutData.oplistrik || 0;
		const opinternet = cashoutData.opinternet || 0;
		const opadm = cashoutData.opadm || 0;
		const opgedung = cashoutData.opgedung || 0;
		const oppkg = cashoutData.oppkg || 0;
		const optransport = cashoutData.optransport || 0;
		const oprapat = cashoutData.oprapat || 0;
		const opkonsum = cashoutData.opkonsum || 0;
		const opsampah = cashoutData.opsampah || 0;
		const perbankan = cashoutData.perbankan || 0;
		const bosGuru = cashoutData.bosGuru || 0;
		const opBus = cashoutData.opBus || 0;
		const btt = cashoutData.btt || 0;

		const totalPengeluaran =
			kontribusiYayasan +
			honorGurumi +
			honorKeamanan +
			honorKebersihan +
			honorPendamping +
			eskomputer +
			espramuka +
			espaskibra +
			eskaligrafi +
			essilat +
			esfutsal +
			oplistrik +
			opinternet +
			opadm +
			opgedung +
			oppkg +
			optransport +
			oprapat +
			opkonsum +
			opsampah +
			perbankan +
			bosGuru +
			opBus +
			btt;

		const tableData = [
			{ deskripsi: 'Kontribusi Yayasan', nilai: formatValue(kontribusiYayasan) },
			{ deskripsi: 'Honor Gurumi', nilai: formatValue(honorGurumi) },
			{ deskripsi: 'Honor Keamanan', nilai: formatValue(honorKeamanan) },
			{ deskripsi: 'Honor Kebersihan', nilai: formatValue(honorKebersihan) },
			{ deskripsi: 'Honor Pendamping', nilai: formatValue(honorPendamping) },
			{ deskripsi: 'Eskomp', nilai: formatValue(eskomputer) },
			{ deskripsi: 'Espramuka', nilai: formatValue(espramuka) },
			{ deskripsi: 'Espaskibra', nilai: formatValue(espaskibra) },
			{ deskripsi: 'Eskaligrafi', nilai: formatValue(eskaligrafi) },
			{ deskripsi: 'Essilat', nilai: formatValue(essilat) },
			{ deskripsi: 'Esfutsal', nilai: formatValue(esfutsal) },
			{ deskripsi: 'Oplistrik', nilai: formatValue(oplistrik) },
			{ deskripsi: 'Opinternet', nilai: formatValue(opinternet) },
			{ deskripsi: 'Opadm', nilai: formatValue(opadm) },
			{ deskripsi: 'Opgedung', nilai: formatValue(opgedung) },
			{ deskripsi: 'Oppkg', nilai: formatValue(oppkg) },
			{ deskripsi: 'Optransport', nilai: formatValue(optransport) },
			{ deskripsi: 'Oprapat', nilai: formatValue(oprapat) },
			{ deskripsi: 'Opkonsum', nilai: formatValue(opkonsum) },
			{ deskripsi: 'Opsampah', nilai: formatValue(opsampah) },
			{ deskripsi: 'Perbankan', nilai: formatValue(perbankan) },
			{ deskripsi: 'BOS Guru', nilai: formatValue(bosGuru) },
			{ deskripsi: 'OpBus', nilai: formatValue(opBus) },
			{ deskripsi: 'BTT', nilai: formatValue(btt) },
			{ deskripsi: 'Total Pengeluaran', nilai: formatValue(totalPengeluaran) },
		];

		const htmlTemplate = fs.readFileSync(path.join(__dirname, '../public', 'laporan-pengeluaran.html'), 'utf-8');
		const htmlContent = htmlTemplate.replace('{{data}}', JSON.stringify(tableData));

		res.send(htmlContent);
	} catch (error) {
		console.error('Error saat membuat laporan HTML untuk Cashout:', error);
		res.status(500).json({
			status: 'GAGAL',
			message: 'Gagal membuat laporan HTML',
		});
	}
};

const finishSummary = async (req, res) => {
	try {
		await incrementAndSetNewId();
		res.status(200).json({
			status: 'BERHASIL',
			message: 'Summary selesai dan ID baru dibuat',
		});
	} catch (error) {
		console.error('Error saat menyelesaikan summary:', error);
		res.status(500).json({
			status: 'GAGAL',
			message: 'Tidak bisa menyelesaikan summary',
		});
	}
};

const getCashout = async (req, res) => {
	try {
		const cashoutSnapshot = await db.collection('pengeluaran').get();
		const data = cashoutSnapshot.docs.filter((doc) => doc.id !== 'currentId').map((doc) => ({ id: doc.id, ...doc.data() }));

		res.status(200).json({
			status: 'BERHASIL',
			data: data,
		});
	} catch (error) {
		console.error('Error saat mengambil data pengeluaran:', error);
		res.status(500).json({
			status: 'GAGAL',
			message: 'Gagal mengambil data pengeluaran',
		});
	}
};

const getCashoutById = async (req, res) => {
	try {
		const { id } = req.params;
		const cashoutDoc = await db.collection('pengeluaran').doc(id).get();
		if (!cashoutDoc.exists) {
			res.status(404).json({
				status: 'GAGAL',
				message: 'Data tidak ditemukan',
			});
		} else
			res.status(200).json({
				status: 'BERHASIL',
				data: {
					pengeluaran: cashoutDoc.data(),
				},
			});
	} catch (error) {
		console.error('Error saat mendapatkan id data pengeluaran:', error);
		res.status(500).json({
			status: 'GAGAL',
			message: 'Gagal mendapatkan data pengeluaran',
		});
	}
};

const deleteCashout = async (req, res) => {
	try {
		const { id } = req.params;
		const cashoutDoc = await db.collection('pengeluaran').doc(id).get();
		if (!cashoutDoc.exists) {
			res.status(404).json({
				status: 'GAGAL',
				message: 'Data tidak ditemukan',
			});
		} else {
			await db.collection('pengeluaran').doc(id).delete();
			res.status(200).json({
				status: 'BERHASIL',
				message: 'Data berhasil dihapus',
			});
		}
	} catch (error) {
		console.error('Error saat menghapus data:', error);
		res.status(500).json({
			status: 'GAGAL',
			message: 'Gagal menghapus data',
		});
	}
};

const updateCashout = async (req, res) => {
	try {
		const { id } = req.params;
		const data = req.body;

		if (Object.keys(data).length === 0) {
			return res.status(400).json({
				status: 'GAGAL',
				message: 'Data yang akan diupdate tidak boleh kosong',
			});
		}

		const cashoutDoc = await db.collection('pengeluaran').doc(id).get();
		if (!cashoutDoc.exists) {
			return res.status(404).json({
				status: 'GAGAL',
				message: 'Data tidak ditemukan',
			});
		}

		// Lakukan update dengan data yang diberikan
		await db.collection('pengeluaran').doc(id).update(data);

		res.status(200).json({
			status: 'BERHASIL',
			message: 'Data berhasil diedit',
		});
	} catch (error) {
		console.error('Error saat mengedit data:', error);
		res.status(500).json({
			status: 'GAGAL',
			message: 'Gagal mengedit data',
		});
	}
};

module.exports = { addCashout, getCashout, getCashoutById, deleteCashout, updateCashout, finishSummary, generateCashoutPDF };
