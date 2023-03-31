const jwt = require('jsonwebtoken');
const createError = require('./error');

const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(createError(404, 'Token Not Found!'));

  jwt.verify(token, process.env.JWT_SECREAT_KEY, (err, user) => {
    if (err) return next(createError(403, 'Token Is Not Valid'));
    req.user = user;
    next();
  });
};

module.exports = verifyToken;
