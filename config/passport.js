const User = require("../models/user");
const bcrypt = require("bcrypt");
require("dotenv").config();

module.exports = function(app) {
  var passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy,
    GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(async function(user, done) {
    User.findById(user._id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(
    new LocalStrategy(
      {
        emailField: "email",
        passwordField: "password",
        session: true
      },
      async function(email, password, done) {
        const loginUser = await User.findOne({
          email: email
        });
        if (loginUser) {
          bcrypt.compare(password, loginUser.password, function(err, result) {
            if (result) {
              return done(null, loginUser);
            } else {
              return done(null, false, { message: "Incorrect password." });
            }
          });
        } else {
          return done(null, false, { message: "Incorrect username." });
        }
      }
    )
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.REDIRECT_URIS
      },
      async function(accessToken, refreshToken, profile, done) {
        var email = profile.emails[0].value;
        var name = profile.displayName;
        var loginUser = await User.findOne({
          email: email
        });
        if (loginUser) {
          done(null, loginUser);
        } else {
          const user = await User.create({
            email: email,
            user_name: name
          });
          done(null, user);
        }
      }
    )
  );
  return passport;
};
