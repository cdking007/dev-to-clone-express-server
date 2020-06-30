const express = require("express");
const isSignedIn = require("../middlewares/auth");
const postController = require("../controllers/post");

const router = express.Router();

router.post("/createpost", isSignedIn, postController.postCreatePost);
router.get("/allposts", isSignedIn, postController.getAllPosts);
router.get("/posts/:url", postController.getSinglePost);
router.post("/posts/comment", isSignedIn, postController.postComment);
router.get("/post/:id", isSignedIn, postController.getPostById);
router.put("/posts/like", isSignedIn, postController.putLike);
router.put("/posts/dislike", isSignedIn, postController.putdisLike);
router.patch("/posts/:id", isSignedIn, postController.patchSignlePost);
router.delete("/posts/:id", isSignedIn, postController.deleteSignlePost);
router.get("/myposts", isSignedIn, postController.getMyPosts);

module.exports = router;
