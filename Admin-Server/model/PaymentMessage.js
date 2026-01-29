// models/Transaction.js
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  fullMessage: {
    type: String,
    required: true,
  },
  masking: {
    type: String,
    default: "null",
  },
  from: {
    type: String,
    required: true,
  },
  trxID: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  deviceName: {
    type: String,
    default: "unknown_device",
  },
  deviceId: {
    type: String,
    default: "unknown_device",
  },
  type: {
    type: String,
    default: "unknown",
  },
  title: {
    type: String,
    default: "Unknown",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("PaymentMessage", transactionSchema);
