const admin = require('firebase-admin');

/**
 * Initialize Firebase Admin SDK and return Firestore database instance
 * Uses the singleton pattern - Firebase is initialized only once
 * @returns {admin.firestore.Firestore} Firestore database instance
 */
function initializeFirestore() {
    // Initialize Firebase Admin with service account credentials
    admin.initializeApp({
        credential: admin.credential.cert(require('./serviceAccount.json'))
    });

    // Return Firestore database instance
    return admin.firestore();
}

// Initialize and export the database instance
const db = initializeFirestore();

module.exports = db;