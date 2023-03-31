const Comment = require('../models/Comments');
const Video = require('../models/Video');
const createError = require('../utils/error');

const addComment = async (req, res, next) => {
  try {
    const newComment = new Comment({...req.body, userId: req.user.id});
    const saveComment = await newComment.save();
    return res.status(201).json(saveComment);
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  const commentId = req.params.commentId;
  const videoId = req.params.videoId;
  try {
    const comment = await Comment.findById(commentId);
    const video = await Video.findById(videoId);
    if (req.user.id === comment.userId || req.user.id === video.userId) {
      await Comment.findByIdAndDelete(commentId);
      return res.status(200).json('Comment Deleted');
    } else {
      return next(createError(401, 'You Can Only Delete Your Comments'));
    }
  } catch (error) {
    next(error);
  }
};

const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({videoId: req.params.videoId});
    if (comments.length === 0)
      return next(createError(404, 'Comments Not Found'));
    return res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addComment,
  deleteComment,
  getComments,
};
