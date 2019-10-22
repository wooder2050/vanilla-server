var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next) {
  console.log("hi");
  console.log(req.user);
  if (req.isAuthenticated()) {
    console.log("hello");
    res.redirect("/");
  } else {
    console.log("bye");
    res.redirect("/login");
  }
});


module.exports = router;
