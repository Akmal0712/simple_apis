const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { secret, tokens } = require("../../config").jwt;
const redis = require("../../storage/redis");

const generateAccessToken = async (userId) => {
  const payload = { 
    id: userId,
    type: tokens.access.type
  };
  const expiresIn = { expiresIn: tokens.access.expiresIn };

  const token = jwt.sign(payload, secret, expiresIn);
  await redis.set(`${userId}_token`, token, "EX", 60 * 10);
  return token;
};

const generateRefreshToken = async (userId) => {
  const payload = {
    id: uuidv4(),
    userId,
    type: tokens.refresh.type
  };
  const expiresIn = { expiresIn: tokens.refresh.expiresIn };
  const token = jwt.sign(payload, secret, expiresIn);
  await redis.set(`${userId}_refresh_token`, token, "EX", 60 * 10);

  return token;
};

module.exports = {
  generateAccessToken,
  generateRefreshToken
};