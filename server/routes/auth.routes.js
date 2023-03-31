const router = require('express').Router();

const {
  signUp,
  signIn,
  googleAuth,
  logout,
} = require('../controllers/auth.controller');

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/google', googleAuth);
router.post('/logout', logout);

module.exports = router;
