const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
const serviceAccount = JSON.parse(serviceAccountJson);

initializeApp({
	credential: cert(serviceAccount),
});

const db = getFirestore();

module.exports = { db };
