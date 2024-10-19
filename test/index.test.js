const request = require('supertest');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// Define the GraphQL schema
const schema = buildSchema(`
  type Country {
    id: ID!
    name: String!
    code: String!
  }

  input CountryInput {
    name: String!
    code: String!
  }

  type Query {
    getCountry(id: ID!): Country
    getCountries: [Country]
  }

  type Mutation {
    createCountry(name: String!, code: String!): Country
    createCountries(countries: [CountryInput]!): [Country]
    updateCountry(id: ID!, name: String, code: String): Country
    deleteCountry(id: ID!): Country
  }
`);

// In-memory data store
const countries = [];
let idCount = 0;

// Define the root resolver
const root = {
  getCountry: ({ id }) => countries.find(country => country.id == id),
  getCountries: () => countries,
  createCountry: ({ name, code }) => {
    const newCountry = { id: idCount++, name, code };
    countries.push(newCountry);
    return newCountry;
  },
  createCountries: ({ countries: newCountries }) => {
    const createdCountries = newCountries.map(({ name, code }) => {
      const newCountry = { id: idCount++, name, code };
      countries.push(newCountry);
      return newCountry;
    });
    return createdCountries;
  },
  updateCountry: ({ id, name, code }) => {
    const country = countries.find(country => country.id == id);
    if (!country) {
      throw new Error("Country not found");
    }
    if (name) country.name = name;
    if (code) country.code = code;
    return country;
  },
  deleteCountry: ({ id }) => {
    const index = countries.findIndex(country => country.id == id);
    if (index === -1) {
      throw new Error("Country not found");
    }
    const deletedCountry = countries.splice(index, 1);
    return deletedCountry[0];
  }
};

// Create an instance of Express
const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: false,
}));

// Test cases for GraphQL API
describe('GraphQL API', () => {
  beforeEach(() => {
    countries.length = 0;
    idCount = 0;
  });

  it('should create multiple new countries', async () => {
    const response = await request(app)
      .post('/graphql')
      .send({
        query: `
          mutation {
            createCountries(countries: [{id: 'IDN', name: "Indonesia", code: "ID"}, {id: 'MYS', name: "Malaysia", code: "MY"}]) {
              id
              name
              code
            }
          }
        `
      });
    expect(response.body.data.createCountries).toHaveLength(2);
    expect(response.body.data.createCountries).toEqual([
      { id: "0", name: "Indonesia", code: "ID" },
      { id: "1", name: "Malaysia", code: "MY" }
    ]);
  });

  it('should create a new country', async () => {
    const response = await request(app)
      .post('/graphql')
      .send({
        query: `
          mutation {
            createCountry(name: "Indonesia", code: "ID") {
              id
              name
              code
            }
          }
        `
      });
    expect(response.body.data.createCountry).toEqual({
      id: "0",
      name: "Indonesia",
      code: "ID"
    });
  });

  it('should get all countries', async () => {
    const response = await request(app)
      .post('/graphql')
      .send({
        query: `
          {
            getCountries {
              id
              name
              code
            }
          }
        `
      });
    expect(response.body.data.getCountries).toHaveLength(0);
  });

  it('should get a country by id', async () => {
    await request(app)
      .post('/graphql')
      .send({
        query: `
          mutation {
            createCountry(name: "Indonesia", code: "ID") {
              id
              name
              code
            }
          }
        `
      });

    const response = await request(app)
      .post('/graphql')
      .send({
        query: `
          {
            getCountry(id: 0) {
              id
              name
              code
            }
          }
        `
      });
    expect(response.body.data.getCountry).toEqual({
      id: "0",
      name: "Indonesia",
      code: "ID"
    });
  });

  it('should update a country', async () => {
    await request(app)
      .post('/graphql')
      .send({
        query: `
          mutation {
            createCountry(name: "Indonesia", code: "ID") {
              id
              name
              code
            }
          }
        `
      });

    const response = await request(app)
      .post('/graphql')
      .send({
        query: `
          mutation {
            updateCountry(id: "IDN", name: "Indonesia Raya") {
              id
              name
              code
            }
          }
        `
      });
    expect(response.body.data.updateCountry).toEqual({
      id: "IDN",
      name: "Indonesia Raya",
      code: "ID"
    });
  });

  it('should delete a country', async () => {
    await request(app)
      .post('/graphql')
      .send({
        query: `
          mutation {
            createCountry(name: "Indonesia", code: "ID") {
              id
              name
              code
            }
          }
        `
      });

    const response = await request(app)
      .post('/graphql')
      .send({
        query: `
          mutation {
            deleteCountry(id: "IDN") {
              id
              name
              code
            }
          }
        `
      });
    expect(response.body.data.deleteCountry).toEqual({
      id: "IDN",
      name: "Indonesia",
      code: "ID"
    });
    const checkResponse = await request(app)
      .post('/graphql')
      .send({
        query: `
          {
            getCountries {
              id
              name
              code
            }
          }
        `
      });
    expect(checkResponse.body.data.getCountries).toHaveLength(0);
  });
});
