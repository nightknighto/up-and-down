// controllers/authController.js
const { UserModel } = require('../models'); // Ensure this path is correct
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');

class AuthController {
  // Handle user registration
  async register(req, res) {
    try {
      const { email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await UserModel.create({
        email,
        password: hashedPassword
      });

      const token = jwt.sign({ id: user.id }, config.jwtSecret, {
        expiresIn: '1h'
      });

      res.status(201).send({
        message: 'User registered successfully',
        userId: user.id,
        token
      });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).send({ message: 'Internal server error', error: error.message });
    }
  }

  // Handle user login
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ where: { email } });

      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).send({ message: 'Invalid password' });
      }

      const token = jwt.sign({ id: user.id }, config.jwtSecret, {
        expiresIn: '1h'
      });

      res.status(200).send({
        message: 'User logged in successfully',
        userId: user.id,
        token
      });
    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).send({ message: 'Internal server error', error: error.message });
    }
  }
}

module.exports = new AuthController();