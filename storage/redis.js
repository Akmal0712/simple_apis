const { createClient } = require("redis");
require("dotenv").config();

const redis = createClient({ url: process.env.REDIS });
(async () => {
  await redis.connect();

  console.log("Redis client is connected");
})();

module.exports = redis;