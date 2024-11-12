const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_PPPL3_BACKEND);

initializeApp({
	credential: cert(serviceAccount),
});

const db = getFirestore();

module.exports = { db };
