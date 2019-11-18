const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Asset = require("../models/asset");
const Post = require("../models/post");

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
    console.log("성공");
    if (req.user) {
      const userInfo = await User.find({
        email: req.user.email
      });
      const assetArray = await Asset.find({
        email: req.user.email
      }).sort({ created_at: "desc" });
      const postArray = await Post.find({
        email: req.user.email
      }).sort({ post_date: "desc" });
      const newPostArray = await Post.find({})
        .sort({ post_date: "desc" })
        .limit(50);
      const followingPosts = [];
      for (var i = 0; i < newPostArray.length; i++) {
        if (newPostArray[i].email === req.user.email) {
          followingPosts.push(newPostArray[i]);
        }
        for (var j = 0; j < userInfo[0].following.length; j++) {
          if (
            newPostArray[i].poster_id + "" ===
            userInfo[0].following[j]._id + ""
          ) {
            followingPosts.push(newPostArray[i]);
          }
        }
      }
      const followingArray = userInfo[0].following;
      const followedArray = userInfo[0].follower;
      const followingUsers = await Promise.all(
        followingArray.map(async id => {
          return await User.find({ _id: id });
        })
      );
      const followedUsers = await Promise.all(
        followedArray.map(async id => {
          return await User.find({ _id: id });
        })
      );
      res.status(200).json({
        authenticated: true,
        message: "user successfully authenticated",
        user: userInfo[0],
        assets: assetArray,
        posts: postArray,
        followingPosts: followingPosts,
        followingUsers: followingUsers,
        followedUsers: followedUsers,
        newPosts: newPostArray,
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
