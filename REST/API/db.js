const admin = require('firebase-admin')

function initializeFirestore() {
    admin.initializeApp({
        credential: admin.credential.cert(require('./serviceAccount.json'))
    })

    return admin.firestore()
}

const db = initializeFirestore()

module.exports = db