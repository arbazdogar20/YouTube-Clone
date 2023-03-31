const router = require('express').Router();
const verifyToken = require('../utils/verifyToken');

const {
  addVideo,
  updateVideo,
  deleteVideo,
  addViews,
  trend,
  random,
  sub,
  tags,
  search,
  getVideo,
  getVideosByUser,
} = require('../controllers/videos.controller');

// Create a video
router.post('/', verifyToken, addVideo);

// Get All Videos by User Id
router.get('/all', verifyToken, getVideosByUser);

// Update a video
router.put('/:id', verifyToken, updateVideo);

// delete a video
router.delete('/:id', verifyToken, deleteVideo);

// get a video
router.get('/find/:id', getVideo);

// video views
router.put('/view/:id', addViews);

// trending videos
router.get('/trend', trend);

// random videos
router.get('/random', random);

// subscribed videos
router.get('/sub', verifyToken, sub);

// get video by tags
router.get('/tags', tags);

// search videos by title
router.get('/search', search);

module.exports = router;
