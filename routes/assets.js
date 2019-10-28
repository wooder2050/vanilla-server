const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
const assetsController = require("./controllers/assets.controller");

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

router.post("/upload/photo/db", assetsController.assetUploadPhoto);
router.post("/upload/media/db", assetsController.assetUploadMedia);

router.post("/upload/photo/s3", upload.single("imgfile"), async function(
  req,
  res
) {
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

router.post("/upload/media/s3", upload.array("imgfile", 2), async function(
  req,
  res
) {
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

module.exports = router;
