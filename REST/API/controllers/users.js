const { validationResult } = require('express-validator')
const { findByEmail, verifyPassword, checkEmailExists, create } = require('../models/User')
const { generateToken, hashPassword } = require('../auth')

const login = async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        return res.status(400).json({
            error: validationErrors.array()
        })
    }
    
    try {
        const { email, password } = req.body;

        const user = await findByEmail(email)

        if(!user) {
            return res.status(401).json({
                error: "Invalid login"
            })
        }

        const passIsValid = await verifyPassword(password, user.password)

        if (!passIsValid) {
            return res.status(401).json({
                error: "Invalid login"
            })
        }

        // Generate JWT token
        const token = generateToken({
            id: user.id,
            email: user.email
        });

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email
            }
        });

    } catch(error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
}

const register = async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        return res.status(400).json({
            error: validationErrors.array()
        });
    }

    try {
        const { email, password } = req.body;

        // Check if user already exists
        const userExists = await checkEmailExists(email);

        if (userExists) {
            return res.status(409).json({
                error: 'User with this email already exists'
            });
        }

        // Hash password and create user
        const hashedPassword = await hashPassword(password);
        const newUser = {
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        };

        const userId = await create(newUser);

        // Generate JWT token for automatic login
        const token = generateToken({
            id: userId,
            email: email
        });

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: userId,
                email: email
            }
        });
    } catch(error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

module.exports = { login, register };