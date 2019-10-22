const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    required: false
  },
  user_name: {
    type: String,
    required: true
  },
  profile_url: {
    type: String
  },
  info: {
    type: String
  },
  user_display_name: {
    type: String
  },
  user_job: {
    type: String
  },
  isArtist: {
    type: Boolean
  },
  follower: {
    friend_id: {
      type: ObjectId
    }
  },
  following: {
    friend_id: {
      type: ObjectId
    }
  },

  story: {
    story_url: {
      type: String,
      unique: false
    },
    date: {
      type: Date
    }
  }
});

module.exports = mongoose.model("User", userSchema);
