// db/index.js
const { Sequelize } = require('sequelize');

// Ganti dengan konfigurasi database Anda
const sequelize = new Sequelize('grapql_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;
