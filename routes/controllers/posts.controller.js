const User = require("../../models/user");
const Asset = require("../../models/asset");
const Post = require("../../models/post");

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
