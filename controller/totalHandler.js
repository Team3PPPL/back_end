const { db } = require('../services/dbconnect');

const formatToRupiah = (amount) => {
	return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
};

const getTotalPerId = async (req, res) => {
	try {
		const { id } = req.params;
		const cashinDoc = await db.collection('pemasukan').doc(id).get();
		if (!cashinDoc.exists) {
			return res.status(404).json({
				status: 'GAGAL',
				message: 'Data tidak ditemukan',
			});
		}

		const { bos = 0, kelas1 = 0, kelas2 = 0, kelas3 = 0, kelas4 = 0, kelas5 = 0, kelas6 = 0 } = cashinDoc.data();
		const totalPerId = bos + kelas1 + kelas2 + kelas3 + kelas4 + kelas5 + kelas6;
		const formattedTotalPerId = formatToRupiah(totalPerId);

		res.status(200).json({
			status: 'BERHASIL',
			totalPerId: formattedTotalPerId,
		});
	} catch (error) {
		console.error('Error saat menghitung total per ID:', error);
		res.status(500).json({
			status: 'GAGAL',
			message: 'Gagal menghitung total per ID',
		});
	}
};

const getTotalAllIds = async (req, res) => {
	try {
		const cashinSnapshot = await db.collection('pemasukan').get();
		let totalAllIds = 0;

		cashinSnapshot.forEach((doc) => {
			const { bos = 0, kelas1 = 0, kelas2 = 0, kelas3 = 0, kelas4 = 0, kelas5 = 0, kelas6 = 0 } = doc.data();
			totalAllIds += bos + kelas1 + kelas2 + kelas3 + kelas4 + kelas5 + kelas6;
		});

		const formattedTotalAllIds = formatToRupiah(totalAllIds);

		res.status(200).json({
			status: 'BERHASIL',
			totalAllIds: formattedTotalAllIds,
		});
	} catch (error) {
		console.error('Error saat menghitung total semua ID:', error);
		res.status(500).json({
			status: 'GAGAL',
			message: 'Gagal menghitung total semua ID',
		});
	}
};

module.exports = { getTotalAllIds, getTotalPerId };
