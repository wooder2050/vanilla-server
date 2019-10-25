const express = require("express");
const router = express.Router();
const User = require("../models/user");

module.exports = function(passport) {
  router.get("/", function(req, res) {
    res.json({
      success: true,
      message: "user has successfully authenticated",
      user: req.user,
      cookies: req.cookies
    });
  });

  router.post(
    "/",
    passport.authenticate("local", {
      successRedirect: "http://localhost:3000/mypage",
      failureRedirect: "http://localhost:3000/login"
    })
  );

  router.get("/success", async function(req, res, next) {
    if (req.user) {
      const user_info = await User.find({
        email: req.user.email
      });
      res.status(200).json({
        authenticated: true,
        message: "user successfully authenticated",
        user: user_info[0],
        cookies: req.cookies
      });
    } else {
      res.status(401).json({
        authenticated: false,
        message: "user failed to authenticate."
      });
    }
  });

  router.get("/failed", (req, res) => {
    res.status(401).json({
      success: false,
      message: "user failed to authenticate."
    });
  });

  router.get(
    "/google",
    passport.authenticate("google", {
      scope: ["https://www.googleapis.com/auth/plus.login", "email"]
    })
  );

  router.get(
    "/google/callback",
    passport.authenticate("google", {
      successRedirect: "http://localhost:3000/mypage",
      failureRedirect: "http://localhost:3000/login"
    })
  );

  return router;
};
