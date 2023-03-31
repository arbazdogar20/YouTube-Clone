const router = require('express').Router();

const {
  update,
  getUser,
  deleteUser,
  subscribe,
  unsubscribe,
  like,
  dislike,
} = require('../controllers/users.controller');
const verifyToken = require('../utils/verifyToken');

// update user
router.put('/:id', verifyToken, update);

// delete user
router.delete('/:id', verifyToken, deleteUser);

// find user
router.get('/find/:id', getUser);

// subscribe user
router.put('/sub/:id', verifyToken, subscribe);

// unsubscribe user
router.put('/unsub/:id', verifyToken, unsubscribe);

// like user
router.put('/like/:videoId', verifyToken, like);

// dislike user
router.put('/dislike/:videoId', verifyToken, dislike);

module.exports = router;
