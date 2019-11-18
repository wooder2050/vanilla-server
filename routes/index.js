const express = require("express");
const router = express.Router();

router.get(
  "/",
  function(req, res, next) {
    if (req.user) {
      res.redirect("/");
    } else {
      res.redirect("/login");
    }
  }
);

module.exports = router;