// models/imageSchema.js
const mongoose = require('mongoose');

const imageRegistrationSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['login_banner', 'registration_banner'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('imageRegistrationSchema', imageRegistrationSchema);