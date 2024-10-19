// index.js

const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const { schema, root } = require('./src/schema');
const sequelize = require('./src/db'); // pastikan path ini benar

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // Replace with your Next.js app URL
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}));

// Periksa koneksi sequelize di sini
sequelize.authenticate().then(() => {
  console.log('Connection to the database has been established successfully.');
  app.listen(4000, () => console.log('Server running on http://localhost:4000/graphql'));
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});
