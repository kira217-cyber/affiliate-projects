const mongoose = require('mongoose');

const OpayConfigSchema = new mongoose.Schema(
  {
    apiKey: { type: String, required: true },
    viewerApiKey: { type: String, default: null },
    active: { type: Boolean, default: true },
    lastValidation: { type: Object, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('OpayConfig', OpayConfigSchema);
