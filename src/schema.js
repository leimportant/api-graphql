// src/schema.js

const { buildSchema } = require('graphql');
const Country = require('./db/country');
const Company = require('./db/company');

const schema = buildSchema(`
  type Country {
    id: ID!
    name: String!
    code: String!
    companies: [Company]
  }

  type Company {
    id: ID!
    name: String!
    industry: String!
    country: Country
  }

  input CountryInput {
    id: String!
    name: String!
    code: String!
  }

  input CompanyInput {
    name: String!
    industry: String!
    countryId: ID!
  }

  type Query {
    getCountry(id: ID!): Country
    getCountries: [Country]
    getCompany(id: ID!): Company
    getCompanies: [Company]
  }

  type Mutation {
    createCountry(id: String!, name: String!, code: String!): Country
    createCountries(countries: [CountryInput]!): [Country]
    updateCountry(id: ID!, name: String, code: String): Country
    deleteCountry(id: ID!): Country

    createCompany(name: String!, industry: String!, countryId: ID!): Company
    createCompanies(companies: [CompanyInput]!): [Company]
    updateCompany(id: ID!, name: String, industry: String, countryId: ID): Company
    deleteCompany(id: ID!): Company
  }
`);

const root = {
  getCountry: async ({ id }) => {
    return await Country.findByPk(id, {
      include: [Company]
    });
  },
  getCountries: async () => {
    return await Country.findAll({
      include: [Company]
    });
  },
  createCountry: async ({ name, code }) => {
    return await Country.create({ name, code });
  },
  createCountries: async ({ countries }) => {
    return await Country.bulkCreate(countries);
  },
  updateCountry: async ({ id, name, code }) => {
    const country = await Country.findByPk(id);
    if (!country) throw new Error("Country not found");

    if (name) country.name = name;
    if (code) country.code = code;
    await country.save();
    return country;
  },
  deleteCountry: async ({ id }) => {
    const country = await Country.findByPk(id);
    if (!country) throw new Error("Country not found");

    await country.destroy();
    return country;
  },
  getCompany: async ({ id }) => {
    return await Company.findByPk(id, {
      include: [Country]
    });
  },
  getCompanies: async () => {
    return await Company.findAll({
      include: [Country]
    });
  },
  createCompany: async ({ name, industry, countryId }) => {
    return await Company.create({ name, industry, countryId });
  },
  createCompanies: async ({ companies }) => {
    return await Company.bulkCreate(companies);
  },
  updateCompany: async ({ id, name, industry, countryId }) => {
    const company = await Company.findByPk(id);
    if (!company) throw new Error("Company not found");

    if (name) company.name = name;
    if (industry) company.industry = industry;
    if (countryId) company.countryId = countryId;
    await company.save();
    return company;
  },
  deleteCompany: async ({ id }) => {
    const company = await Company.findByPk(id);
    if (!company) throw new Error("Company not found");

    await company.destroy();
    return company;
  }
};

module.exports = { schema, root };
