const User = require("../../models/user");
const Post = require("../../models/post");
const bcrypt = require("bcrypt");

exports.postUserUpdate = async function(req, res, next) {
  await User.update(
    { email: req.body.email },
    {
      info: req.body.info,
      user_display_name: req.body.user_display_name,
      profile_url: req.body.profile_url,
      user_job: req.body.user_job
    }
  );

  const user_info = await User.find({
    email: req.body.email
  });

  await Post.updateMany(
    {
      email: req.body.email
    },
    {
      profile_url: req.body.profile_url,
      user_display_name: req.body.user_display_name
    }
  );
  return res.status(200).json({
    userUpdate: true,
    message: "user info successfully updated",
    user: user_info[0]
  });
};

exports.getUserInfo = async function(req, res, next) {
  try {
    const pageUser = await User.find({
      _id: req.params.id
    });
    const postArray = await Post.find({
      email: pageUser[0].email
    }).sort({ post_date: "desc" });
    const followingArray = pageUser[0].following;
    const followedArray = pageUser[0].follower;
    const followingUsers = await Promise.all(
      followingArray.map(async id => {
        return await User.find({ _id: id });
      })
    );
    const followedUsers = await Promise.all(
      followedArray.map(async id => {
        return await User.find({ _id: id });
      })
    );
    return res.status(200).json({
      message: "user info successfully onload",
      pageUser: pageUser,
      pageUserPosts: postArray,
      userPagefollowingUsers: followingUsers,
      userPagefollowedUsers: followedUsers
    });
  } catch (e) {
    return res.status(400).json({
      message: "user info onload failed"
    });
  }
};

exports.getSearchUser = async function(req, res, next) {
  var re = new RegExp("^" + req.params.username);
  const findUser = await User.find({ user_name: { $regex: re } });
  return res.status(200).json({
    message: "successfully searched",
    users: findUser
  });
};

exports.followUpdate = async function(req, res, next) {
  const follower = await User.find({
    _id: req.body.following
  });
  const followee = await User.find({
    _id: req.body.followed
  });
  var followingState = false;
  for (var i = 0; i < followee[0].follower.length; i++) {
    if (followee[0].follower[i] === follower[0]._id) {
      followingState = true;
    }
  }
  if (followingState) {
    return res.status(401).json({
      followUpdate: false,
      message: "user following failed",
      follower: follower[0],
      followee: followee[0]
    });
  } else {
    follower[0].following.push(followee[0]._id);
    followee[0].follower.push(follower[0]._id);
    const updatedfollower = await User.update(
      { _id: req.body.following },
      {
        following: follower[0].following
      }
    );
    const updatedfollowee = await User.update(
      { _id: req.body.followed },
      {
        follower: followee[0].follower
      }
    );

    return res.status(200).json({
      followUpdate: true,
      message: "user following successfully updated",
      follower: updatedfollower[0],
      followee: updatedfollowee[0]
    });
  }
};

exports.create = async function(req, res, next) {
  const loginUser = await User.find({
    email: req.body.email
  });

  if (loginUser.length === 0) {
    if (req.body.password !== req.body.password2) {
      res.status(401).json({
        register_authenticated: false,
        register_message: "Password must same!",
        register_pwdError: "Password must same!"
      });
    } else {
      const hash = await bcrypt.hash(req.body.password, 10);
      const user_info = await User.create({
        email: req.body.email,
        user_name: req.body.user_name,
        password: hash
      });
      return res.status(200).json({
        register_authenticated: true,
        register_message: "user successfully authenticated",
        register_user: user_info
      });
    }
  } else {
    res.status(401).json({
      register_authenticated: false,
      register_message: "Same email already exists",
      register_emailError: "Same email already exists"
    });
  }
};
