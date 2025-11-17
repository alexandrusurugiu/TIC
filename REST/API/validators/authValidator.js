const { body } = require('express-validator')

const authValidation = [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail()
        .custom((value) => {
            if (!value.endsWith('@ase.ro')){
                throw new Error('Only BUES students are allowed to register')
            }
            return true
        }),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password should have a minimum of 8 chars')
        .trim()
]

module.exports = { authValidation }