const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET, JSON_EXPIRES_IN, JWT_EXPIRES_IN} = require('./config')


async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}

async function comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword)
}

function generateToken(user) {
    const userData = {
        userId: user.id,
        email: user.email
    }

    return jwt.sign(userData, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN})
}

function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET)
    } catch (error) {
        return null
    }
}

module.exports = {
    hashPassword, 
    comparePassword, 
    generateToken, 
    verifyToken
}