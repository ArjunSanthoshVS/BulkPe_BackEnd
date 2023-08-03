require('dotenv').config()
const jwt = require('jsonwebtoken')
const middleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    try {
        const decodeToken = jwt.verify(token, process.env.SECRET)
        req.userId = decodeToken.userId
        next()
    } catch (error) {
        return res.status(401).json({ message: "Invalid Token" })
    }
}

module.exports = middleware