const router = require('express').Router();
const verifyToken = require('../utils/verifyToken');

const {
  addComment,
  deleteComment,
  getComments,
} = require('../controllers/comments.controller');

router.post('/', verifyToken, addComment);
router.delete('/:commentId/:videoId', verifyToken, deleteComment);
router.get('/:videoId', getComments);

module.exports = router;
