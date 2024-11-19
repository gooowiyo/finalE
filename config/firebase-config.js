// config/firebase-config.js
const admin = require('firebase-admin');
const serviceAccount = require('./bd.json');

let db;
try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
  db = admin.firestore();
} catch (error) {
  console.error('Error inicializando Firebase:', error);
}

module.exports = db;