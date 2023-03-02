const User = require("../models/auth/user");
const { secret } = require("../../config").jwt;
const jwt = require("jsonwebtoken");


module.exports = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const user = jwt.verify(token, secret);

  try {
    const currentUser = await User.findOne({ where: { id: user.id }});
    if (!currentUser)
      res.status(400).json({ message: "Permission denied" });

    next();
  }
  catch (error) {
    res.json({ message: error.message });
  }

};