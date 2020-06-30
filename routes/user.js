const express = require("express");
const isSignedIn = require("../middlewares/auth");
const User = require("../models/user");
const Post = require("../models/post");
const router = express.Router();

router.get("/myprofile", isSignedIn, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(422).send({ error: "something is want Wrong!" });
    }
    return res.status(200).send(user);
  } catch (err) {
    return res.status(422).send({ error: "something is want Wrong!" });
  }
});

router.get("/myposts", isSignedIn, async (req, res) => {
  try {
    const posts = await Post.find({ postedBy: req.user._id });
    if (!posts) {
      return res.status(422).send({ error: "No post found with this id!" });
    }
    return res.status(200).send(posts);
  } catch (err) {
    return res.status(422).send({ error: "Something is want wrong!" });
  }
});

router.get("/user/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(422).send({ error: "No User found with this id!" });
    }
    return res.status(200).send(user);
  } catch (err) {
    return res.status(422).send({ error: "Something is want wrong!" });
  }
});

module.exports = router;
