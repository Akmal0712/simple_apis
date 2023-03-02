const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/auth/user");
const redis = require("../../storage/redis");
const { secret } = require("../../config").jwt;

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
  secretOrKey: secret
};

module.exports = passport => {
  passport.use(
    new JwtStrategy(options, async (payload, done) => {
      try {

        const user = await User.findOne({
          where: { id: payload.id},
          attributes: ["id", "login"]
        });
        const token = await redis.get(`${user.id}_token`);
        if (user && token) {
          done(null, user);
        } else {
          done(null, false);
        }
      }
      catch (error) {
        console.log(error);
      }
    })
  );
};