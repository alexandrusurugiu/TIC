const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/users')
const { authValidation } = require('../validators/authValidator')

router.post('/register', authValidation, register);
router.post('/login', authValidation, login);

module.exports = router;