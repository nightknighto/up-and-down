// controllers/userController.js
const { UserModel, FileModel } = require('../models');

class UserController {
  // Method to get the logged-in user's files
  async getUserFiles(req, res) {
    try {
      const userId = req.userId; // Assuming user ID is stored in req.user by authMiddleware

      // Query the File model to get all files for the user
      const files = await FileModel.findAll({
        where: { userId: userId }
      });

      if (!files) {
        return res.status(404).send({ message: 'No files found for this user' });
      }

      res.status(200).send({
        message: 'User files retrieved successfully',
        files: files
      });
    } catch (error) {
      console.error('Error fetching user files:', error);
      res.status(500).send({ message: 'Internal server error', error: error.message });
    }
  }
}

module.exports = new UserController();