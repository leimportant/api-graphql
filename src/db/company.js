// db/company.js
const { Sequelize } = require('sequelize');
const sequelize = require('./index');
const Country = require('./country');

const Company = sequelize.define('Company', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  industry: {
    type: Sequelize.STRING,
    allowNull: false
  },
  countryId: {
    type: Sequelize.INTEGER,
    references: {
      model: Country,
      key: 'id'
    }
  }
});

// Setup relationships
Country.hasMany(Company, { foreignKey: 'countryId' });
Company.belongsTo(Country, { foreignKey: 'countryId' });

module.exports = Company;
