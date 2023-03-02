const express = require("express");
const cors = require("cors");
const app = express();
const redisClient = require("./storage/redis");
app.use(cors());

require("dotenv").config();

const router = require("./app/routes/index");
router(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async (error) => {
  if (error) {
    console.log(`Error: ${error}`);
    process.exit(0);
  }

  const value = await redisClient.get("key");
  console.log(`value from APP.JS: ${value}`);

  console.log(`Server working on port ${PORT}`);
});
