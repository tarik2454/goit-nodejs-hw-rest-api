const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { User } = require('../models/User');
const { HttpError } = require('../helpers/HttpError');
const { ctrlWrapper } = require('../decorators/index');

const { JWT_SECRET } = process.env;

const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, 'Email already in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashPassword });

  res.status(201).json({
    username: newUser.username,
    email: newUser.email,
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, 'Email is invalid');
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, 'Password is invalid');
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '46h',
  });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
  });
};

const getCurrent = async (req, res) => {
  const { username, email } = req.user;

  res.json({ username, email });
};

const signout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: '' });

  res.json({ message: 'Logout success' });
};

module.exports = {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  signout: ctrlWrapper(signout),
};
