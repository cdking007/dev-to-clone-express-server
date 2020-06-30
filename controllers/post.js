const Post = require("../models/post");
const User = require("../models/user");

exports.postCreatePost = async (req, res) => {
  try {
    const { title, body, description, thumb } = req.body;
    if (!title || !body || !description || !thumb) {
      return res.status(422).send({ error: "Title and body is required!" });
    }
    const postedBy = req.user._id;

    const post = new Post({ title, body, description, photo: thumb, postedBy });
    await post.save();
    return res.status(201).send(post);
  } catch (err) {
    console.log(err);
    return res.status(422).send({ error: "Something is wrong!" });
  }
};
exports.getSinglePost = async (req, res) => {
  try {
    const titleurl = req.params.url;
    const post = await Post.findOne({ url: titleurl })
      .populate("postedBy")
      .populate("comments.postedBy", "name");
    if (!post) {
      return res.status(404).send({ error: "no post found on this url" });
    }
    return res.status(200).send(post);
  } catch (err) {
    return res
      .status(422)
      .send({ error: "Something want wrong with this post" });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({}).populate("postedBy", "_id name");
    return res.status(200).send(posts);
  } catch (err) {
    return res.status(500).send({ error: "server is down!" });
  }
};

exports.getMyPosts = async (req, res) => {
  try {
    const id = req.user._id;
    const posts = await Post.find({ postedBy: id });
    return res.status(200).send(posts);
  } catch (err) {
    return res.status(500).send({ error: "server is down!" });
  }
};

exports.patchSignlePost = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findOne({ _id: id });
    if (!post) {
      return res.status(404).send({ error: "post not found" });
    }
    if (req.user._id.toString() !== post.postedBy.toString()) {
      return res.status(404).send({ error: "Post not found" });
    }
    const { title, description, body } = req.body;
    console.log(title, description, body);

    const updatePost = await Post.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    });
    console.log(updatePost);
    return res.status(200).send(updatePost);
  } catch (error) {
    return res.status(400).send({ error: "Something is want wrong!" });
  }
};

exports.deleteSignlePost = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findOne({ _id: id });
    if (!post) {
      return res.status(404).send({ error: "post not found" });
    }
    if (req.user._id.toString() !== post.postedBy.toString()) {
      return res.status(404).send({ error: "Post not found" });
    }
    await Post.findOneAndDelete({ _id: id });
    return res.status(200).send({ msg: "post deleted" });
  } catch (error) {
    return res.status(400).send({ error: "Something is want wrong!" });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findOne({ _id: id }).populate("postedBy", "name");
    if (!post) {
      return res.status(404).send({ error: "no post found on this url" });
    }
    return res.status(200).send(post);
  } catch (err) {
    return res.status(422).send({ error: "Something is want wrong!" });
  }
};
exports.putLike = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $push: { likes: req.user._id },
      },
      {
        new: true,
      }
    );
    return res.status(201).send(post);
  } catch (err) {
    return res.status(422).send({ error: "Like operation failed!" });
  }
};

exports.putdisLike = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $pull: { likes: req.user._id },
      },
      {
        new: true,
      }
    );
    return res.status(201).send(post);
  } catch (err) {
    return res.status(422).send({ error: "Like operation failed!" });
  }
};

exports.postComment = async (req, res) => {
  try {
    const post = await Post.findById(req.body.id);
    if (!post) {
      return res.status(404).send({ error: "No Post found!" });
    }
    post.comments = post.comments.concat({
      text: req.body.comment,
      postedBy: req.user._id,
    });
    await post.save();
    const tempPost = await post
      .populate("postedBy")
      .populate("comments.postedBy", "name")
      .execPopulate();
    console.log(tempPost.comments);
    return res.status(201).send(tempPost.comments);
  } catch (err) {
    return res.status(422).send({ error: "Like operation failed!" });
  }
};
