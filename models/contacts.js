const mongoose = require('mongoose');

const { Schema } = mongoose;
const { handleSaveError, preUpdate } = require('./hooks');

const genderList = ['male', 'female'];
const birthYearRegexp = /^\d{4}$/;
const phoneRegexp = /^[0-9]+$/;

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
      match: phoneRegexp,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      enum: genderList,
    },
    birthYear: {
      type: String,
      match: birthYearRegexp,
    },
    fotoURL: {
      type: String,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },

  { versionKey: false, timestamps: true }
);

contactSchema.post('save', handleSaveError);
contactSchema.pre('findOneAndUpdate', preUpdate);
contactSchema.post('findOneAndUpdate', handleSaveError);

const Contact = mongoose.model('Contact', contactSchema);

module.exports = {
  Contact,
};
