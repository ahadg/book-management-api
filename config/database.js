// config/database.js
const { Sequelize } = require('sequelize');

// SQLite will create a file named "database.sqlite" in the project root
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

module.exports = sequelize;
