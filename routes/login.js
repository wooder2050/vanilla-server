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
    console.log("로그인1");
    if (req.user) {
      console.log("로그인2");
      const userInfo = await User.find({
        email: req.user.email
      });
      console.log("로그인3");
      const assetArray = await Asset.find({
        email: req.user.email
      }).sort({ created_at: "desc" });
      console.log("로그인4");
      const postArray = await Post.find({
        email: req.user.email
      }).sort({ post_date: "desc" });
      console.log("로그인5");
      const newPostArray = await Post.find({})
        .sort({ post_date: "desc" })
        .limit(50);
      console.log("로그인6");
      const followingPosts = [];
      for (var i = 0; i < newPostArray.length; i++) {
        if (newPostArray[i].email === req.user.email) {
          followingPosts.push(newPostArray[i]);
        }
        console.log("로그인7");
        for (var j = 0; j < userInfo[0].following.length; j++) {
          if (
            newPostArray[i].poster_id + "" ===
            userInfo[0].following[j]._id + ""
          ) {
            followingPosts.push(newPostArray[i]);
          }
        }
      }
      console.log("로그인8");
      const followingArray = userInfo[0].following;
      const followedArray = userInfo[0].follower;
      console.log("로그인9");
      const followingUsers = await Promise.all(
        followingArray.map(async id => {
          return await User.find({ _id: id });
        })
      );
      console.log("로그인10");
      const followedUsers = await Promise.all(
        followedArray.map(async id => {
          return await User.find({ _id: id });
        })
      );
      console.log("로그인11");
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
