// db/country.js
const { Sequelize } = require('sequelize');
const sequelize = require('./index');

const Country = sequelize.define('Country', {
  id: {
    type: Sequelize.STRING(15),
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  code: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Country;
