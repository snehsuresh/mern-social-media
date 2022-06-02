const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const mongoose = require("mongoose");
//create post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    res.status(500).json(error);
  }
});

//update post   params.id here is objectid not userid
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(mongoose.Types.ObjectId(req.params.id));

    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("Post updated");
    } else {
      res.status(403).json("You can update only your post");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
//delete post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(mongoose.Types.ObjectId(req.params.id));
    console.log(post.userId, req.body);
    if (post.userId === req.body.userId) {
      console.log("User id matched");
      await post.deleteOne({ $set: req.body });
      res.status(200).json("Post deleted");
    } else {
      res.status(403).json("You can delete only your post");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
//like or dislike post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(mongoose.Types.ObjectId(req.params.id));
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("You liked this post");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("You disliked this post");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//comment on a post
router.put("/:id/comment", async (req, res) => {
  try {
    const post = await Post.findById(mongoose.Types.ObjectId(req.params.id));
    await post.updateOne({ $push: { comments: req.body } });
    res.status(200).json("You commented on this post");

    // await post.updateOne({ $pull: { likes: req.body.userId } });
    // res.status(200).json("You disliked this post");
  } catch (error) {
    res.status(500).json(error);
  }
});

//get post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(mongoose.Types.ObjectId(req.params.id));
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
});
//get timeline posts      - show posts by you and whoever you follow
router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(
      mongoose.Types.ObjectId(req.params.userId)
    );

    const userPosts = await Post.find({ userId: currentUser._id });

    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (error) {
    res.status(500).json(error);
  }
});

//get user's all post
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
