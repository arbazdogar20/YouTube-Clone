const User = require('../models/User');
const Video = require('../models/Video');
const createError = require('../utils/error');

// Add Video
const addVideo = async (req, res, next) => {
  try {
    const addVideo = new Video({userId: req.user.id, ...req.body});
    const saveVideo = await addVideo.save();
    return res.status(201).json(saveVideo);
  } catch (error) {
    next(error);
  }
};

// Get Videos By UserId
const getVideosByUser = async (req, res, next) => {
  // const userId = req.params.userId;
  try {
    const videos = await Video.find({userId: req.user.id});
    if (videos.length === 0)
      return next(createError(404, 'You are not upload videos yet.'));
    // const saveVideo = await addVideo.save();
    return res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};

// Update Video
const updateVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, 'Video Not Found'));
    if (req.user.id === video.userId) {
      const updateVideo = await Video.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        {new: true}
      );
      return res.status(200).json(updateVideo);
    } else {
      return next(createError(401, 'You Only Update Your Video'));
    }
  } catch (error) {
    next(error);
  }
};

// Delete Video
const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, 'Video Not Found'));
    if (req.user.id === video.userId) {
      await Video.findByIdAndDelete(req.params.id);
      return res.status(200).json({message: 'Video Deleted Successfully'});
    } else {
      return next(createError(401, 'You Only Deleted Your Video'));
    }
  } catch (error) {
    next(error);
  }
};

// Get Video
const getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, 'Video Not Found'));
    return res.status(200).json(video);
  } catch (error) {
    next(error);
  }
};

// addViews Video
const addViews = async (req, res, next) => {
  try {
    await Video.findByIdAndUpdate(req.params.id, {
      $inc: {views: 1},
    });
    return res.status(200).json('Views Increased');
  } catch (error) {
    next(error);
  }
};

// Trend Video
const trend = async (req, res, next) => {
  try {
    const videos = await Video.find().sort({views: -1});
    return res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};

// Random Video
const random = async (req, res, next) => {
  try {
    const videos = await Video.aggregate([{$sample: {size: 40}}]);
    return res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};

// Subscribe Video
const sub = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const subscribedChannels = user.subscribedUsers;

    const list = await Promise.all(
      subscribedChannels.map((channelId) => {
        return Video.find({userId: channelId});
      })
    );
    return res
      .status(200)
      .json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (error) {
    next(error);
  }
};

// get Video by tag
const tags = async (req, res, next) => {
  const tags = req.query.tags.split(',');
  try {
    const videos = await Video.find({tags: {$in: tags}}).limit(20);
    if (videos.length === 0)
      return next(createError(404, 'No Video Available'));
    return res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};

// search Video
const search = async (req, res, next) => {
  const search = req.query.search;
  try {
    const videos = await Video.find({
      title: {$regex: search, $options: 'i'},
    }).limit(40);
    if (videos.length === 0)
      return next(createError(404, 'No Video Available'));
    return res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addVideo,
  getVideosByUser,
  updateVideo,
  deleteVideo,
  getVideo,
  addViews,
  trend,
  random,
  sub,
  tags,
  search,
};
