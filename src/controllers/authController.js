// controllers/authController.js
const { UserModel } = require('../models'); // Ensure this path is correct
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');

class AuthController {
  // Handle user registration
  async register(req, res) {
    try {
      const { email, password, confirmPassword, firstName, lastName } = req.body;

      const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
      const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      if (!password.match(passwordRegex)) {
        return res.status(400).send("Password must be at least 8 characters long and include letters, numbers, and symbols.");
      }

      if (password !== confirmPassword) {
          return res.status(400).send("Passwords do not match.");
      }

      if (!emailPattern.test(email)) {
        res.status(400).send('Invalid email format.');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await UserModel.create({
        email,
        password: hashedPassword,
        firstName,
        lastName
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
        firstName: user.firstName,
        lastName: user.lastName,
        token
      });
    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).send({ message: 'Internal server error', error: error.message });
    }
  }
}

module.exports = new AuthController();