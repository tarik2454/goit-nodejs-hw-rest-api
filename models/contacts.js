const mongoose = require('mongoose');
const { Schema } = mongoose;
const handleSaveError = require('./hooks');

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
  },
  { versionKey: false }
);

contactSchema.post('save', handleSaveError);

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
