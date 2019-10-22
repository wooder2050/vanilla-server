const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;

const albumSchema = new mongoose.Schema({
  email: String,
  assets: [
    {
      ref: "Asset",
      type: ObjectId
    }
  ]
});

module.exports = mongoose.model("Album", albumSchema);
