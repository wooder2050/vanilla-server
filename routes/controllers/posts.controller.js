const User = require("../../models/user");
const Asset = require("../../models/asset");
const Post = require("../../models/post");

exports.getMyPost = async function(req, res, next) {
  try {
    const postArray = await Post.find({
      email: req.user.email
    }).sort({ post_date: "desc" });
    return res.status(200).json({
      message: "my post successfully onload",
      posts: postArray
    });
  } catch (e) {
    return res.status(400).json({
      message: "my post onload failed"
    });
  }
};

exports.getNewPost = async function(req, res, next) {
  try {
    const postArray = await Post.find()
      .sort({ post_date: "desc" })
      .limit(100);
    return res.status(200).json({
      message: "new post successfully onload",
      newPosts: postArray
    });
  } catch (e) {
    return res.status(400).json({
      message: "new post onload failed"
    });
  }
};

exports.getFollowingPost = async function(req, res, next) {
  if (req.user) {
    const userInfo = await User.find({
      email: req.user.email
    });
    const postArray = await Post.find({})
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
      message: "following posts successfully onload",
      followingPosts: followingPosts
    });
  } else {
    return res.status(400).json({
      message: "following posts onload failed"
    });
  }
};

exports.postUpload = async function(req, res, next) {
  const asset_urls = await Asset.find({
    _id: req.body.assetId
  });

  await Post.create({
    poster_id: req.body._id,
    email: req.body.email,
    user_display_name: req.body.user_display_name,
    profile_url: req.body.profile_url,
    singer: req.body.singer,
    title: req.body.title,
    post_type: req.body.post_type,
    post_url: asset_urls[0].url,
    cover_url: asset_urls[0].cover_url,
    post_date: Date.now(),
    description: req.body.description,
    maker: req.body.maker,
    location: req.body.location,
    tags: req.body.tags
  });

  return res.status(200).json({
    userPost: true,
    message: "successfully posted"
  });
};
