const express = require("express");
const router = express.Router();
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

router.get("/userpage/:id", async function(req, res) {
  try {
    const pageUser = await user.find({
      _id: req.params.id
    });
    console.log("/userpage/:id ",pageUser);
    return res.status(200).json({
      message: "user info successfully onload",
      pageUser: pageUser
    });
  } catch (e) {}
});

router.get("/newposts", async function(req, res) {
  try {
    const postArray = await post.find().sort({ post_date: "desc" });
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

module.exports = router;
