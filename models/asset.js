const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;

const assetSchema = new mongoose.Schema({
  email:String,
  url: String,
  created_at: Date,
  cover_url: String,
  type: String
});

module.exports = mongoose.model("Asset", assetSchema);
