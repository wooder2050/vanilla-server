const user = require("../../models/user");
const bcrypt = require("bcrypt");

exports.getAll = async function(req, res, next) {
  res.redirect("/register");
};
exports.followUpdate = async function(req, res, next) {
  console.log("팔로워 ", req.body.following, req.body.followed);
  const follower = await user.find({
    _id: req.body.following
  });
  const followee = await user.find({
    _id: req.body.followed
  });

  follower[0].following.push(followee[0]._id);
  followee[0].follower.push(follower[0]._id);
  const updatedfollower = await user.update(
    { _id: req.body.following },
    {
      following: follower[0].following
    }
  );
  const updatedfollowee = await user.update(
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
};

exports.create = async function(req, res, next) {
  const loginUser = await user.find({
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
      const user_info = await user.create({
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
