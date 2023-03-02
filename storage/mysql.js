const { Sequelize } = require("sequelize");
require("dotenv").config();

const dbName = process.env.DB_NAME;
const dialect = process.env.DB_DIALECT;
const userName = process.env.DB_USERNAME;
const password = process.env.DB_PASSWROD;
const host = process.env.DB_HOST;
console.log(dbName, userName, password);
module.exports = new Sequelize(dbName, userName, password, {
  dialect,
  host,
  operatorsAliases: 0,
  define: {
    timestamps: false
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});


