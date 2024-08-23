const { Sequelize } = require('sequelize');
const config = require('../../config/config');

const sequelize = new Sequelize(config.database.database, config.database.username, config.database.password, {
  host: config.database.host,
  port: config.database.port,
  dialect: 'mysql'
});

const UserModel = require('./userModel')(sequelize, Sequelize);
const FileModel = require('./fileModel')(sequelize, Sequelize)

module.exports = {
  sequelize,
  UserModel,
  FileModel,
};