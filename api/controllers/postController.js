const Post = require("../models/Post");
const User = require("../models/User");
const NotificationModel = require("../models/Notification");
exports.createPost = async (req, res) => {
  try {
    req.body.userId = req.user.id;
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updatePost = async (req, res) => {
  try {
    var isPostFound = true;
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(403).json("post not found");
      isPostFound = false;
    }
    if (post.userId === req.user.id) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("the post has been updated");
    } else {
      res.status(403).json("you can update only your post");
    }
  } catch (err) {
    if (isPostFound) {
      res.status(500).json(err);
    }
  }
};

exports.deletePost = async (req, res) => {
  try {
    var isPostFound = true;
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(403).json("post not found");
      isPostFound = false;
    }
    if (post.userId === req.user.id || req.user.isAdmin) {
      await post.deleteOne();
      res.status(200).json("the post has been deleted");
    } else {
      res.status(403).json("you can delete only your post");
    }
  } catch (err) {
    if (isPostFound) {
      res.status(500).json(err);
    }
  }
};

exports.likeAndUnlike = async (req, res) => {
  try {
    console.log(req.body.postId);
    console.log("Reached here");
    var isPostFound = true;
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(403).json("post not found");
      isPostFound = false;
    }
    if (!post.likes.includes(req.user.id)) {
      await post.updateOne({ $push: { likes: req.user.id } });
      if (post.userId != req.user.id) {
        NotificationModel.create({
          userId: post.userId,
          emiterId: req.user.id,
          text: "liked your post.",
          postId: req.body.postId,
        })
          .then((response) => res.status(200).json("post liked"))
          .catch((error) => res.status(500).json(error));
      } else res.status(200).json("post liked");
    } else {
      await post.updateOne({ $pull: { likes: req.user.id } });
      if (post.userId != req.params.id) {
        NotificationModel.deleteOne({
          userId: post.userId,
          emiterId: req.user.id,
          text: "liked your post.",
          postId: req.body.postId,
        })
          .then((response) => res.status(200).json("post disliked"))
          .catch((error) => res.status(500).json(error));
      } else res.status(200).json("post removed");
    }
  } catch (err) {
    if (isPostFound) {
      console.log("err is here", err);
      res.status(500).json(err);
    }
  }
};

exports.getAPost = async (req, res) => {
  try {
    var isPostFound = true;
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(403).json("post not found");
      isPostFound = false;
    } else {
      res.status(200).json(post);
    }
  } catch (err) {
    if (isPostFound) {
      res.status(500).json(err);
    }
  }
};

exports.timeline = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.addComment = async (req, res) => {
  try {
    const comment = req.body;
    comment.userId = req.user.id;
    const post = await Post.findById(req.params.id);

    await post.updateOne({ $push: { comments: comment } });
    if (post.userId != req.user.id) {
      NotificationModel.create({
        userId: post.userId,
        emiterId: req.user.id,
        text: "commented your post.",
        postId: req.body.postId,
      });
    }
    res.status(200).json("commented successfully");
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.unComment = async (req, res) => {
  try {
    console.log("body   : ", req.body);
    console.log("query   : ", req.params.id);

    await Post.updateOne(
      { _id: req.body.postId },
      { $pull: { comments: { _id: req.params.id } } }
    );
    res.status(200).json("comment removed");
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.userPosts = async (req, res) => {
  try {
    // const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: req.params.id });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.allPosts = async (req, res) => {
  try {
    // const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
};
