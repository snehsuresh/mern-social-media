const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
//update user
router.put("/:id", async (req, res) => {
  console.log(req.params.id === req.body.userId);
  console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$", req.params.id, req.body.userId);
  console.log();
  if (req.params.id === req.body.userId || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Accound has been updated");
    } catch (error) {
      return res.send("User Not Found").json(err);
    }
  } else {
    return res.status(500).json("You can update only your account");
  }
});
//delete user
router.delete("/:id", async (req, res) => {
  if (req.params.id === req.body.userId || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Accound has been deleted");
    } catch (error) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(500).json("You can delete only your account");
  }
});

//get a user
router.get("/", async (req, res) => {
  //lh:5000/users?userId=123
  //lh:5000/users?username=abc
  //you can send either. using query you can choose which to set, you dont need different apis to handle both
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(mongoose.Types.ObjectId(userId))
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get friends or followers
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(
      mongoose.Types.ObjectId(req.params.userId)
    );
    // console.log("User details", user);

    const friends = await Promise.all(
      //use promiseall when we use map
      user.followings.map((friendId) => {
        return User.findById(mongoose.Types.ObjectId(friendId));
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendList);
  } catch (error) {
    res.status(500).json(error);
  }
});

//follow user
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const celebrity = await User.findById(
        mongoose.Types.ObjectId(req.params.id)
      );
      const fan = await User.findById(mongoose.Types.ObjectId(req.body.userId));
      //   console.log(fan);

      if (!celebrity.followers.includes(req.body.userId)) {
        await celebrity.updateOne({
          $push: { followers: req.body.userId },
        });
        await fan.updateOne({
          $push: { followings: req.params.id },
        });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you already follow this user");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("you cant follow yourself, bud");
  }
});

//unfollow user
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const celebrity = await User.findById(
        mongoose.Types.ObjectId(req.params.id)
      );
      const fan = await User.findById(mongoose.Types.ObjectId(req.body.userId));
      //   console.log(fan);

      if (celebrity.followers.includes(req.body.userId)) {
        await celebrity.updateOne({
          $pull: { followers: req.body.userId },
        });
        await fan.updateOne({
          $pull: { followings: req.params.id },
        });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you don't follow this user");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("you cant unfollow yourself, bud");
  }
});

module.exports = router;
