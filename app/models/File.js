const Sequelize = require("sequelize");
const db = require("../../storage/mysql");

const File = db.define("files", {
  user_id: Sequelize.INTEGER,
  name: Sequelize.STRING,
  extension: Sequelize.CHAR, 
  mime_type: Sequelize.STRING,
  size: Sequelize.INTEGER,
  created_at: Sequelize.DATE,
});

module.exports = File;