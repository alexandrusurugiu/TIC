const { verifyToken } = require('../auth');

function validateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            error: "No token found"
        });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(403).json({
            error: 'Invalid or expired token'
        });
    }

    req.user = decoded;
    next();
}

module.exports = { validateToken };