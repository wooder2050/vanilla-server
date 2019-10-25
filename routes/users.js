const express = require("express");
const router = express.Router();
const usersController = require("./controllers/users.controller");

router.get("/followingUsers", usersController.getFollowingUsers);
router.post("/update", usersController.postUserUpdate);
router.post("/followingUpdate", usersController.followUpdate);
router.get("/search/:username", usersController.getSearchUser);
router.get("/:id", usersController.getUserInfo);

module.exports = router;
