const { db } = require('../services/dbconnect');
const fs = require('fs');
const path = require('path');

const formatToRupiah = (amount) => {
	return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
};

const getCurrentId = async () => {
	const cashinSnapshot = await db.collection('pemasukan').orderBy('id', 'desc').limit(1).get();
	if (cashinSnapshot.empty) {
		return 0;
	}

	const cashin = cashinSnapshot.docs[0].data();
	return cashin.id;
};

const addCashin = async (req, res) => {
	try {
		const { bos, kelas1, kelas2, kelas3, kelas4, kelas5, kelas6, tanggalPemasukan } = req.body;
		const pemasukanDate = new Date(tanggalPemasukan).toISOString().split('T')[0];
		let currentId = await getCurrentId();

		const id = ++currentId;
		const createdAt = new Date().toISOString().split('T')[0];
		const newCashin = {
			id,
			bos,
			kelas1,
			kelas2,
			kelas3,
			kelas4,
			kelas5,
			kelas6,
			tanggalPemasukan: pemasukanDate,
			createdAt,
		};

		await db.collection('pemasukan').doc(String(id)).set(newCashin);

		res.status(200).json({
			status: 'BERHASIL',
			message: 'Data berhasil ditambah',
			data: { id },
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
		const cashin = cashinSnapshot.docs.map((doc) => {
			const data = doc.data();
			return {
				...data,
				bos: formatToRupiah(data.bos || 0),
				kelas1: formatToRupiah(data.kelas1 || 0),
				kelas2: formatToRupiah(data.kelas2 || 0),
				kelas3: formatToRupiah(data.kelas3 || 0),
				kelas4: formatToRupiah(data.kelas4 || 0),
				kelas5: formatToRupiah(data.kelas5 || 0),
				kelas6: formatToRupiah(data.kelas6 || 0),
			};
		});

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
		const cashinDoc = await db.collection('pemasukan').doc(id).get();
		if (!cashinDoc.exists) {
			res.status(404).json({
				status: 'GAGAL',
				message: 'Data tidak ditemukan',
			});
		} else {
			const cashinData = cashinDoc.data();
			const formattedData = {
				...cashinData,
				bos: formatToRupiah(cashinData.bos || 0),
				kelas1: formatToRupiah(cashinData.kelas1 || 0),
				kelas2: formatToRupiah(cashinData.kelas2 || 0),
				kelas3: formatToRupiah(cashinData.kelas3 || 0),
				kelas4: formatToRupiah(cashinData.kelas4 || 0),
				kelas5: formatToRupiah(cashinData.kelas5 || 0),
				kelas6: formatToRupiah(cashinData.kelas6 || 0),
			};

			res.status(200).json({
				status: 'BERHASIL',
				data: formattedData,
			});
		}
	} catch (error) {
		console.error('Error saat mendapatkan id data pemasukan:', error);
		res.status(500).json({
			status: 'GAGAL',
			message: 'Gagal mendapatkan data pemasukan',
		});
	}
};

const generateCashinPDF = async (req, res) => {
	try {
		const { id } = req.params;
		const cashinDoc = await db.collection('pemasukan').doc(id).get();
		if (!cashinDoc.exists) {
			return res.status(404).json({
				status: 'GAGAL',
				message: 'Data tidak ditemukan',
			});
		}

		const cashinData = cashinDoc.data();
		const bos = cashinData.bos || 0;
		const kelas1 = cashinData.kelas1 || 0;
		const kelas2 = cashinData.kelas2 || 0;
		const kelas3 = cashinData.kelas3 || 0;
		const kelas4 = cashinData.kelas4 || 0;
		const kelas5 = cashinData.kelas5 || 0;
		const kelas6 = cashinData.kelas6 || 0;

		// Hitung total pemasukan
		const totalPemasukan = bos + kelas1 + kelas2 + kelas3 + kelas4 + kelas5 + kelas6;

		const tableData = [
			{ deskripsi: 'BOS', nilai: formatToRupiah(bos) },
			{ deskripsi: 'Kelas 1', nilai: formatToRupiah(kelas1) },
			{ deskripsi: 'Kelas 2', nilai: formatToRupiah(kelas2) },
			{ deskripsi: 'Kelas 3', nilai: formatToRupiah(kelas3) },
			{ deskripsi: 'Kelas 4', nilai: formatToRupiah(kelas4) },
			{ deskripsi: 'Kelas 5', nilai: formatToRupiah(kelas5) },
			{ deskripsi: 'Kelas 6', nilai: formatToRupiah(kelas6) },
			{ deskripsi: 'Tanggal Pemasukan', nilai: cashinData.tanggalPemasukan },
			{ deskripsi: 'Total Pemasukan', nilai: formatToRupiah(totalPemasukan) },
		];

		const htmlTemplate = fs.readFileSync(path.join(__dirname, '../public', 'laporan-pemasukan.html'), 'utf-8');
		const htmlContent = htmlTemplate.replace('{{data}}', JSON.stringify(tableData));

		res.send(htmlContent);
	} catch (error) {
		console.error('Error saat membuat HTML:', error);
		res.status(500).json({
			status: 'GAGAL',
			message: 'Gagal membuat laporan HTML',
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
		const data = req.body;

		if (Object.keys(data).length === 0) {
			return res.status(400).json({
				status: 'GAGAL',
				message: 'Data yang akan diupdate tidak boleh kosong',
			});
		}

		const cashinDoc = await db.collection('pemasukan').doc(id).get();
		if (!cashinDoc.exists) {
			res.status(404).json({
				status: 'GAGAL',
				message: 'Data tidak ditemukan',
			});
		} else {
			await db.collection('pemasukan').doc(id).update(data);
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

module.exports = { addCashin, getCashin, getCashinById, deleteCashin, updateCashin, generateCashinPDF };
