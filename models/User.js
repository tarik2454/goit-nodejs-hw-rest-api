const mongoose = require('mongoose');

const { Schema } = mongoose;
const { handleSaveError, preUpdate } = require('./hooks');

const emailRegexp = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema(
  {
    password: {
      type: String,
      minlength: 6,
      required: [true, 'Set password for user'],
    },
    email: {
      type: String,
      match: emailRegexp,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ['starter', 'pro', 'business'],
      default: 'starter',
    },
    avatarURL: { type: String },
    token: { type: String },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post('save', handleSaveError);
userSchema.pre('findOneAndUpdate', preUpdate);
userSchema.post('findOneAndUpdate', handleSaveError);

const User = mongoose.model('User', userSchema);

module.exports = {
  User,
};
