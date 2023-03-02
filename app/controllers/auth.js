const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authHelper = require("../helpers/authhelper");
const { secret } = require("../../config").jwt;
const redis = require("../../storage/redis");

const User = require("../models/auth/user"); 
 
const signup = async (req, res) => {
  try {
    const { login, password } = req.body;

    const [user, created] = await User.findOrCreate({
      where: { login },
      defaults: {
        login,
        password: bcrypt.hashSync(password, 10)
      }
    });

    if (!created) {
      return res.status(401).json({ message: "User with this login is exist" });
    }

    res.json(user);
  }
  catch (error) {
    res.status(500).json({ message: error });
  }
};

const signin = async (req, res) => {
  const { login, password } = req.body;

  try {
    const user = await User.findOne({ where: { login } });

    if (!user) {
      res.status(401).json({ message: "User does not exist" });
    }

    const isValid = bcrypt.compareSync(password, user.password);
    if(isValid) {
      try {
        const access_token = await authHelper.generateAccessToken(user.id);
        const refresh_token = await authHelper.generateRefreshToken(user.id);

        res.json({
          id: user.id,
          access_token: `Bearer ${access_token}`,
          refresh_token,
        });
      }
      catch (e) {
        res.status(500).json(e);
      }
    }
    else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  }
  catch (error) {
    res.status(500).json({ message: error });
  }
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  try {
    const payload = jwt.verify(refreshToken, secret);
    if (payload.type !== "refresh") {
      res.status(400).json({ message: "Invalid token!" });
    }
    const token = await redis.get(`${payload.userId}_refresh_token`);
    if (!token) res.status(400).json({ message: "Token expired!" });

    const user = await User.findOne({ where: { id: payload.userId }, attributes: ["login", "id"]});

    const access_token = authHelper.generateAccessToken(user.id);
    const refresh_token = authHelper.generateRefreshToken(user.id);

    res.json({
      id: user.id,
      access_token: `Bearer ${access_token}`,
      refresh_token: refresh_token.token
    });
  }
  catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      res.status(400).json({ message: "Token expired!" });
    }
    else if (e instanceof jwt.JsonWebTokenError) {
      res.status(400).json({ message: "Invalid token!" });
    }
  }
};

const info = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const user = jwt.verify(token, secret);

  res.json({ id: user.id });
};

const logout = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const user = jwt.verify(token, secret);

  await redis.del(`${user.id}_token`, `${user.id}_refresh_token`);

  res.json({ result: "lougout" });
};

module.exports = { signin, signup, refreshToken, info, logout };