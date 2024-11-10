const { storeCashout, db } = require('../services/dbconnect');

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
		const {
			kontribusiYayasan,
			honorGurumi,
			honorKeamanan,
			honorKebersihan,
			honorPendamping,
			eskomputer,
			espramuka,
			espaskibra,
			eskaligrafi,
			essilat,
			esfutsal,
			esqiroat,
			oplistrik,
			opinternet,
			opadm,
			opgedung,
			oppkg,
			optransport,
			oprapat,
			opkonsum,
			opsampah,
			perbankan,
			bosGuru,
			opBus,
			btt,
		} = req.body;
		let currentId = await getCurrentId();
		const id = ++currentId;
		const createdAt = new Date().toISOString();

		const newCashout = {
			kontribusiYayasan,
			honorGurumi,
			honorKeamanan,
			honorKebersihan,
			honorPendamping,
			eskomputer,
			espramuka,
			espaskibra,
			eskaligrafi,
			essilat,
			esfutsal,
			esqiroat,
			oplistrik,
			opinternet,
			opadm,
			opgedung,
			oppkg,
			optransport,
			oprapat,
			opkonsum,
			opsampah,
			perbankan,
			bosGuru,
			opBus,
			btt,
			createdAt,
		};
		await db.collection('pengeluaran').doc(String(id)).set(newCashout);

		res.status(200).json({
			status: 'BERHASIL',
			message: 'Data berhasil Ditambah',
			data: { id: id },
		});
	} catch (error) {
		console.error('Error saat menambahkan data pengeluaran:', error);
		res.status(500).json({
			status: 'GAGAL',
			message: 'Input pengeluaran gagal ditambahkan',
		});
	}
};

const getCashout = async (req, res) => {
	try {
		const cashoutSnapshot = await db.collection('pengeluaran').get();
		const cashout = cashoutSnapshot.docs.map((doc) => doc.data());

		res.status(200).json({
			status: 'BERHASIL',
			data: cashout,
		});
	} catch (error) {
		console.error('Error Saat Mendapatkan data pengeluaran:', error);
		res.status(500).json({
			status: 'GAGAL',
			message: 'pengeluaran gagal ditampilkan',
		});
	}
};

const getCashoutById = async (req, res) => {
	try {
		const { id } = req.params;
		const cashoutDoc = await db.collection('article').doc(id).get();
		if (!cashoutDoc.exists) {
			res.status(404).json({
				status: 'GAGAL',
				message: 'Data tidak ditemukan',
			});
		} else
			res.status(200).json({
				status: 'BERHASIL',
				data: {
					article: cashoutDoc.data(),
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
			res.status(404).json({
				status: 'GAGAL',
				message: 'Data tidak ditemukan',
			});
		} else {
			await db.collection('pengeluaran').doc(id).update();
			res.status(200).json({
				status: 'BERHASIL',
				message: 'Data berhasil diedit',
			});
		}
	} catch (error) {
		console.error('Error saat mengedit Data:', error);
		res.status(500).json({
			status: 'GAGAL',
			message: 'Gagal mengedit data',
		});
	}
};

module.exports = { addCashout, getCashout, getCashoutById, deleteCashout, updateCashout };
