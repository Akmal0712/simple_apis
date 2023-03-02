require("dotenv").config();

module.exports = {
  appPort: 3000,
  jwt: {
    secret: process.env.SECRET_KEY,
    tokens: {
      access: { 
        type: "access",
        expiresIn: "1h"
      },
      refresh: {
        type: "refresh",
        expiresIn: "1h"
      }
    },
  }
};