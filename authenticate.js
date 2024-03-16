var passport = require('passport');
var LocalStrategy = require('passport-local');
var User = require('./models/users');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); //used to create, sign, and verify tokens

var config = require('./config.js');
var FacebookTokenStrategy = require('passport-facebook-token');

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey,
        {expiresIn: 3600});
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    User.findOne({ _id: jwt_payload._id })
      .then((user) => {
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      })
      .catch((error) => {
        return done(error, false);
      });
  })
);

exports.verifyAdmin = (req, res, next) => {
  if (req.user && req.user.admin) {
    return next();
  } else {
    const err = new Error("You are not authorized to perform this operation!");
    err.status = 403;
    return next(err);
  }
};

exports.facebookPassport = passport.use(new FacebookTokenStrategy({
  clientID: config.facebook.clientId,
  clientSecret: config.facebook.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
  try {
      let user = await User.findOne({ facebookId: profile.id });

      if (user) {
          return done(null, user); // User found, return user
      } else {
          user = new User({
              username: profile.displayName,
              facebookId: profile.id,
              firstname: profile.name.givenName,
              lastname: profile.name.familyName
          });

          await user.save(); // Save the new user
          return done(null, user); // Return the newly created user
      }
  } catch (err) {
      return done(err, false); // Return error if any occurs
  }
}));

  
  

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.verifyUser = passport.authenticate('jwt', {session: false});
