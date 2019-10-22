const user = require("../../models/user");
const bcrypt = require("bcrypt");

exports.getAll = async function(req, res, next) {
  res.redirect("/register");
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
        register_pwdError : "Password must same!"
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
      register_emailError : "Same email already exists"
    });
  }
};
