const express = require("express");
const router = express.Router();
const user = require("../models/user");
const asset = require("../models/asset");
const post = require("../models/post");

router.get("/myposts", async function(req, res) {
  try {
    const postArray = await post
      .find({
        email: req.user.email
      })
      .sort({ post_date: "desc" });
    return res.status(200).json({
      message: "post successfully onload",
      posts: postArray
    });
  } catch (e) {}
});

router.get("/followingposts", async function(req, res) {
  if (req.user) {
    const userInfo = await user.find({
      email: req.user.email
    });
    const postArray = await post
      .find({})
      .sort({ post_date: "desc" })
      .limit(100);
    const followingPosts = [];
    for (var i = 0; i < postArray.length; i++) {
      if (postArray[i].email === req.user.email) {
        followingPosts.push(postArray[i]);
      }
      for (var j = 0; j < userInfo[0].following.length; j++) {
        if (postArray[i].poster_id + "" === userInfo[0].following[j]._id + "") {
          followingPosts.push(postArray[i]);
        }
      }
    }
    return res.status(200).json({
      message: "posts successfully onload",
      followingPosts: followingPosts
    });
  }
});

router.get("/userpage/:id", async function(req, res) {
  try {
    const pageUser = await user.find({
      _id: req.params.id
    });
    const postArray = await post
      .find({
        email: pageUser[0].email
      })
      .sort({ post_date: "desc" });
    return res.status(200).json({
      message: "user info successfully onload",
      pageUser: pageUser,
      pageUserPosts: postArray
    });
  } catch (e) {}
});

router.get("/followingusers", async function(req, res) {
  if (req.user) {
    const loginUser = await user.find({
      email: req.user.email
    });

    const followingArray = loginUser[0].following;

    const followingUsers = await Promise.all(
      followingArray.map(async id => {
        return await user.findById(id);
      })
    );
    return res.status(200).json({
      message: "following user info successfully onload",
      followingUsers: followingUsers
    });
  }
});

router.get("/newposts", async function(req, res) {
  try {
    const postArray = await post
      .find()
      .sort({ post_date: "desc" })
      .limit(100);
    return res.status(200).json({
      message: "post successfully onload",
      newPosts: postArray
    });
  } catch (e) {}
});

router.get("/assets", async function(req, res) {
  try {
    const assetArray = await asset
      .find({
        email: req.user.email
      })
      .sort({ created_at: "desc" });
    return res.status(200).json({
      postUpdate: true,
      message: "user post successfully updated",
      assets: assetArray
    });
  } catch (e) {}
});
router.get("/userpage/:id", async function(req, res) {
  const pageUser = await user.find({
    _id: req.params.id
  });
  return res.status(200).json({
    message: "user info successfully onload",
    pageUser: pageUser[0]
  });
});

module.exports = router;
