const mongoose = require('mongoose');

const OpayVerifiedTransactionSchema = new mongoose.Schema(
  {
    success: { type: Boolean, default: true },
    userIdentifyAddress: { type: String, index: true },
    time: { type: Date },
    method: { type: String, index: true },
    token: { type: String },
    amount: { type: Number, index: true },
    from: { type: String },
    trxid: { type: String, unique: true, sparse: true, index: true },
    deviceName: { type: String },
    deviceId: { type: String },
    bdTimeZone: { type: String },
    raw: { type: Object },
    receivedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('OpayVerifiedTransaction', OpayVerifiedTransactionSchema);
