// models/index.js
const sequelize = require('../config/database');
const Book = require('./book');

const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    // Sync all defined models to the DB
    await sequelize.sync();
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = {
  sequelize,
  Book,
  initializeDatabase
};
