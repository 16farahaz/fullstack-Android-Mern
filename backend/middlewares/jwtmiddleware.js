const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({ message: 'No authorization header provided!' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(403).json({ message: 'No token provided!' });

    jwt.verify(token, '123456789', (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Invalid token!' });

        req.user = decoded;
        next();
    });
};


module.exports = verifyJWT;