const Sequelize = require("sequelize");
const db = require("../../storage/mysql");

const RefreshToken = db.define("refresh_tokens", {
  user_id: {
    type: Sequelize.INTEGER,
    unique: true, 
    primaryKey: true
  },
  token_id: Sequelize.STRING,
});

module.exports = RefreshToken;