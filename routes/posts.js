const express = require("express");
const router = express.Router();
const postsController = require("./controllers/posts.controller");

router.get("/myPost", postsController.getMyPost);
router.get("/newPost", postsController.getNewPost);
router.get("/followingPost", postsController.getFollowingPost);
router.post("/upload", postsController.postUpload);


module.exports = router;
