const { comparePassword } = require('../auth');
const db  = require('../db')

const usersCollection = db.collection('users')

const findByEmail = async (email) => {

        // Find user by email
        const snapshot = await usersCollection
            .where('email', '==', email)
            .get();

        if (snapshot.empty) {
            return null
        }

        const userDoc = snapshot.docs[0];
        const user = {
            id: userDoc.id,
            ...userDoc.data()
        };

        return user
}

const verifyPassword = async (plainPassword, hashedPassword) => {
    return await comparePassword(plainPassword, hashedPassword)
}

const checkEmailExists = async (email) => {
    const snapshot = await usersCollection
        .where('email', '==', email)
        .get();

    return !snapshot.empty;
}

const create = async (userData) => {
    const docRef = await usersCollection.add(userData);
    return docRef.id;
}

module.exports = {
    findByEmail,
    verifyPassword,
    checkEmailExists,
    create
}