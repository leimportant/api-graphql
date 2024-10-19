# Menggunakan Sequelize CLI
```sh
npm install -g sequelize-cli
```

inisialisasi proyek Sequelize dengan perintah berikut:
```sh
sequelize init
```

# Buat Model Sequelize
```sh
sequelize model:generate --name Country --attributes id:string(15):primaryKey,name:string,code:string

sequelize model:generate --name Salesorg --attributes id:string,name:string

sequelize model:generate --name Company --attributes name:string,industry:string,countryId:integer
```

# Migrasi Tabel
```sh
sequelize db:migrate
```

## Contoh penggunaan di Grapql

# Create Data
```sh
mutation {
  createCountries(countries: [{id: "IDN", name: "Indonesia", code: "ID"}, {id: "MYS", name: "Malaysia", code: "MY"}]) {
    id
    name
    code
  }
}
```
# Get List Data

```sh
{
  getCountries {
    id
    name
    code
  }
}
```

# Update Data

```sh
mutation {
  updateCountry(id: "IDN", name: "Indonesia Raya") {
    id
    name
    code
  }
}
```

# Delete Data

```sh
 mutation {
  deleteCountry(id: "IDN") {
    id
    name
    code
  }
}
```

## Test By Postman
```bash
curl -X POST http://localhost:4000/graphql -H "Content-Type: application/json" -d "{\"query\": \"{ getCountries { id name code }}\"}"

```
