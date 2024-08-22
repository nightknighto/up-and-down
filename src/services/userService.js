class UserService {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async createUser(userData) {
    try {
      const user = await this.userModel.create(userData);
      return user;
    } catch (error) {
      throw new Error('Failed to create user');
    }
  }

  async getUserById(userId) {
    try {
      const user = await this.userModel.findById(userId);
      return user;
    } catch (error) {
      throw new Error('Failed to get user');
    }
  }

  async updateUser(userId, userData) {
    try {
      const user = await this.userModel.findByIdAndUpdate(userId, userData, { new: true });
      return user;
    } catch (error) {
      throw new Error('Failed to update user');
    }
  }
}

module.exports = UserService;