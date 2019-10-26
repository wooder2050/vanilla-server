const Asset = require("../../models/asset");

exports.getAll = async function(req, res, next) {
  try {
    const assetArray = await Asset.find({
      email: req.user.email
    }).sort({ created_at: "desc" });
    return res.status(200).json({
      postUpdate: true,
      message: "asset successfully onload",
      assets: assetArray
    });
  } catch (e) {
    return res.status(400).json({
      postUpdate: false,
      message: "asset onload failed",
      assets: assetArray
    });
  }
};

exports.assetUploadPhoto = async function(req, res, next) {
  await Asset.create({
    email: req.body.email,
    url: req.body.post_url,
    created_at: Date.now(),
    cover_url: req.body.cover_url,
    type: req.body.post_type
  });
  const assetArray = await Asset.find({
    email: req.body.email
  }).sort({ created_at: "desc" });

  return res.status(200).json({
    userUpdate: true,
    message: "photo successfully upload",
    assets: assetArray
  });
};

exports.assetUploadMedia = async function(req, res, next) {
  await Asset.create({
    email: req.body.email,
    url: req.body.post_url,
    created_at: Date.now(),
    cover_url: req.body.cover_url,
    type: req.body.post_type
  });
  const assetArray = await Asset.find({
    email: req.body.email
  }).sort({ created_at: "desc" });

  return res.status(200).json({
    userUpdate: true,
    message: "media successfully upload",
    assets: assetArray
  });
};
