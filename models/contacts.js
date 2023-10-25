const mongoose = require('mongoose');
const { Schema } = mongoose;
const { handleSaveError, preUpdate } = require('./hooks');

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
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    // gender: {
    //   type: String,
    //   enum: ['male', 'female'],
    // },
    // birthYear: {
    //   type: String,
    //   match: /^\d{4}$/,
    // },
  },
  { versionKey: false }
);

contactSchema.post('save', handleSaveError);

contactSchema.pre('findOneAndUpdate', preUpdate);
contactSchema.post('findOneAndUpdate', handleSaveError);

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
