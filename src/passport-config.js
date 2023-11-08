const passport = require("passport");
const passportJWT = require("passport-jwt");
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

const secretKey = "SECRET_KEY";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secretKey,
};

const { Users } = require("./models");

const jwtStrategy = new JwtStrategy(options, async (jwt_payload, done) => {
  const user = await Users.findOne({ where: { id: jwt_payload.id } });
  if (user) {
    return done(null, user);
  } else {
    return done(null, false);
  }
});

passport.use(jwtStrategy);

module.exports = passport;
