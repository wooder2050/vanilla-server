const express = require("express");
const router = express.Router();

router.get("/", function(req, res, next) {
  console.log("logout");
  req.logout();
  console.log(req.user);
  req.session.destroy();
  res.status(200).json({
    authenticated: false,
    message: "user successfully logout"
  });
});

module.exports = router;
