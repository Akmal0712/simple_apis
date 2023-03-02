const Sequelize = require("sequelize");
const db = require("../../../storage/mysql");

const User = db.define("user", {
  login: {
    type: Sequelize.STRING,
    unique: true,
  },
  password: Sequelize.STRING, 
});

User.prototype.toJSON = function() {
  // eslint-disable-next-line no-unused-vars
  const { password, ...values } = this.get();
  return values;
};

module.exports = User;