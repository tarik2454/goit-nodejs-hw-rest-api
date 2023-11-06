const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs/promises');
const gravatar = require('gravatar');
const Jimp = require('jimp');

const { User } = require('../models/User');
const { HttpError } = require('../helpers/index');
const { ctrlWrapper } = require('../decorators/index');

require('dotenv').config();

const { JWT_SECRET } = process.env;

const avatarPath = path.resolve('public', 'avatars');

const signup = async (req, res) => {
  const { email, password } = req.body;
  let avatarURL;

  if (req.file) {
    const { path: oldPath, filename } = req.file;
    const newPath = path.join(avatarPath, filename);
    await fs.rename(oldPath, newPath);
    avatarURL = path.join('avatars', filename);
  } else {
    avatarURL = gravatar.url(email, { s: '250', d: 'retro' });
  }

  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, 'Email already in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    ...req.body,
    avatarURL,
    password: hashPassword,
  });

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
    expiresIn: '190h',
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

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarPath, filename);
  await fs.rename(oldPath, newPath);

  await Jimp.read(newPath)
    .then(avatar => avatar.resize(250, 250).writeAsync(newPath))
    .catch(err => {
      throw HttpError(404, err.message);
    });

  const avatarURL = path.join('avatars', filename);
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.status(200).json({ avatarURL: avatarURL });
};

module.exports = {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  signout: ctrlWrapper(signout),
  updateAvatar: ctrlWrapper(updateAvatar),
};
