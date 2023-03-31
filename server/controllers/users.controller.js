const User = require('../models/User');
const Video = require('../models/Video');
const createError = require('../utils/error');

const update = async (req, res, next) => {
  const userId = req.params.id;
  if (userId === req.user.id) {
    try {
      const updateUser = await User.findByIdAndUpdate(
        userId,
        {
          $set: req.body,
        },
        {new: true}
      );
      return res.status(200).json(updateUser);
    } catch (error) {
      next(error);
    }
  } else {
    return next(createError(401, 'You are unauthorized'));
  }
};

const deleteUser = async (req, res, next) => {
  const userId = req.params.id;
  if (userId === req.user.id) {
    try {
      const user = await User.findByIdAndDelete(userId);
      if (!user) return next(createError(404, 'User Not Found!'));
      return res.status(200).json({message: 'Account Deleted Successfully'});
    } catch (error) {
      next(error);
    }
  } else {
    return next(createError(401, 'You are unauthorized'));
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(createError(401, 'User Not Found!'));
    const {password, email, ...others} = user._doc;
    return res.status(200).json(others);
  } catch (error) {
    next(error);
  }
};

const subscribe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $push: {subscribedUsers: req.params.id},
    });
    await User.findByIdAndUpdate(req.params.id, {
      $inc: {subscribers: 1},
    });
    return res.status(200).json('Channel Subscribed');
  } catch (error) {
    next(error);
  }
};

const unsubscribe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: {subscribedUsers: req.params.id},
    });
    await User.findByIdAndUpdate(req.params.id, {
      $inc: {subscribers: -1},
    });
    return res.status(200).json('Channel Unsubscribed');
  } catch (error) {
    next(error);
  }
};

const like = async (req, res, next) => {
  const userId = req.user.id;
  const videoId = req.params.videoId;
  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: {likes: userId},
      $pull: {dislikes: userId},
    });
    return res.status(200).json('Video Like');
  } catch (error) {
    next(error);
  }
};

const dislike = async (req, res, next) => {
  const userId = req.user.id;
  const videoId = req.params.videoId;
  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: {dislikes: userId},
      $pull: {likes: userId},
    });
    return res.status(200).json('Video Dislike');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  update,
  deleteUser,
  getUser,
  subscribe,
  unsubscribe,
  like,
  dislike,
};
