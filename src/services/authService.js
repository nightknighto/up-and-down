const { UserModel } = require('../models');
const bcrypt = require('bcrypt');

class AuthService {
  // Validate user credentials
  async validateUser(email, password) {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return false;
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      return isPasswordValid;
    } catch (error) {
      console.error('Error validating user:', error);
      throw new Error('Error validating user');
    }
  }

  // Save user details to the database
  async saveUser(email, password, name) {
    try {
      const hashedPassword = await bcrypt.hash(password, 5);
      const user = new UserModel({ email, password: hashedPassword, name });
      await user.save();
      return user;
    } catch (error) {
      console.error('Error saving user:', error);
      throw new Error('Error saving user');
    }
  }
}

module.exports = new AuthService();