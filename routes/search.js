const express = require("express");
const router = express.Router();
const user = require("../models/user");

router.get("/:username", async function(req, res) {
  var re = new RegExp("^" + req.params.username);
  const findUser = await user.find({ user_name: { $regex: re } });
  return res.status(200).json({
    message: "successfully searched",
    users: findUser
  });
});

module.exports = router;
