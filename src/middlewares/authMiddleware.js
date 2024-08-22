const jwt = require('jsonwebtoken');
const config = require('../../config/config');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).send({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, config.jwtSecret, (err, decoded) => {
      if (err) {
          return res.status(401).send({ message: 'Failed to authenticate token' });
      }
      req.userId = decoded.id; // Ensure this matches the primary key in the User model
      next();
  });
};

module.exports = authMiddleware;