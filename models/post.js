const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;

const postSchema = new mongoose.Schema({
  email: {
    type: String
  },
  poster_id: {
    type: ObjectId
  },
  user_display_name: {
    type: String
  },
  profile_url: {
    type: String
  },
  post_type: {
    type: String
  },
  post_url: {
    type: String
  },
  description: {
    type: String
  },
  post_date: {
    type: Date
  },
  singer: {
    type: String
  },
  title: {
    type: String
  },
  lyrics: {
    type: String
  },
  cover_url: {
    type: String
  },
  maker: {
    type: String
  },
  location: {
    type: String
  },
  tags: [
    {
      type: String
    }
  ],
  likes: {
    user_id: {
      type: ObjectId
    },
    post_id: {
      type: ObjectId
    }
  },
  comments: {
    user_id: {
      type: ObjectId
    },
    post_id: {
      type: ObjectId
    },
    comment: {
      type: String
    },
    comment_date: {
      type: Date
    }
  }
});

module.exports = mongoose.model("Post", postSchema);
