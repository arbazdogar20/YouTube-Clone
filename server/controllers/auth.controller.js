const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createError = require('../utils/error');

const signUp = async (req, res, next) => {
  const {name, email, password} = req.body;
  try {
    const findUser = await User.findOne({name, email});
    if (findUser) return next(createError(403, 'User Already Exist'));
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const newUser = new User({...req.body, password: hash});
    await newUser.save();
    return res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

const signIn = async (req, res, next) => {
  try {
    const user = await User.findOne({name: req.body.name});
    if (!user) return next(createError(404, 'User Not Found!'));
    const isCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (!isCorrect)
      return next(createError(401, 'Email & Password Is Invalid!'));

    // JWT
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECREAT_KEY
    );

    const {password, ...others} = user._doc;

    return res
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  } catch (error) {
    next(error);
  }
};

const googleAuth = async (req, res, next) => {
  try {
    const user = await User.findOne({email: req.body.email});
    // console.log(`userfind => ${user}`)
    if (user) {
      const token = jwt.sign(
        {
          id: user._id,
        },
        process.env.JWT_SECREAT_KEY
      );

      return res
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .status(200)
        .json(user);
    } else {
      const newUser = new User({...req.body, fromGoogle: true});
      const savedUser = await newUser.save();

      const token = jwt.sign(
        {
          id: savedUser._id,
        },
        process.env.JWT_SECREAT_KEY
      );

      return res
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .status(200)
        .json(savedUser);
    }
  } catch (error) {
    next(error);
  }
};

// Logout
const logout = async (req, res, next) => {
  res.clearCookie('access_token').status(200).json('Logout Successfully');
};

module.exports = {
  signUp,
  signIn,
  googleAuth,
  logout,
};
