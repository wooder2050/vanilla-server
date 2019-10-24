const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
const user = require("../models/user");
const post = require("../models/post");
const album = require("../models/album");
const asset = require("../models/asset");
const usersController = require("./controllers/users.controller");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.REGION
});

const s3 = new AWS.S3();
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function(req, file, cb) {
      let extension = path.extname(file.originalname);
      cb(null, Date.now().toString() + extension);
    },
    acl: "public-read-write"
  })
});

router.post("/follow", usersController.followUpdate);

router.get("/:assetId", async function(req, res) {
  const selectAsset = await asset.find({
    _id: req.params.assetId
  });
  return res.status(200).json({
    asset: selectAsset
  });
});

router.post("/single", upload.single("imgfile"), async function(req, res) {
  if (req.file) {
    res.status(200).json({
      upload: true,
      message: "user successfully upload",
      profile_url: req.file.location,
      cookies: req.cookies
    });
  } else {
    res.status(401).json({
      upload: false,
      message: "user failed to upload."
    });
  }
});

router.post("/multi", upload.array("imgfile", 2), async function(req, res) {
  let imgFileArray = req.files;
  const imgFileLocationArray = [];
  for (var i = 0; i < imgFileArray.length; i++) {
    imgFileLocationArray.push(imgFileArray[i].location);
  }
  if (req.files) {
    res.status(200).json({
      upload: true,
      message: "user successfully upload",
      post_url: imgFileLocationArray[0],
      cover_url: imgFileLocationArray[1],
      cookies: req.cookies
    });
  } else {
    res.status(401).json({
      upload: false,
      message: "user failed to upload."
    });
  }
});

router.post("/database", async function(req, res, next) {
  await user.update(
    { email: req.body.email },
    {
      info: req.body.info,
      user_display_name: req.body.user_display_name,
      profile_url: req.body.profile_url,
      user_job: req.body.user_job
    }
  );
  const user_info = await user.find({
    email: req.body.email
  });
  return res.status(200).json({
    userUpdate: true,
    message: "user info successfully updated",
    user: user_info[0]
  });
});

router.post("/databasepost", async function(req, res, next) {
  await asset.create({
    email: req.body.email,
    url: req.body.post_url,
    created_at: Date.now(),
    cover_url: req.body.cover_url,
    type: req.body.post_type
  });
  const assetArray = await asset
    .find({
      email: req.body.email
    })
    .sort({ created_at: "desc" });

  return res.status(200).json({
    userUpdate: true,
    message: "user info successfully updated",
    assets: assetArray
  });
});
router.post("/posting", async function(req, res, next) {
  const asset_urls = await asset.find({
    _id: req.body.assetId
  });

  await post.create({
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
});

module.exports = router;
