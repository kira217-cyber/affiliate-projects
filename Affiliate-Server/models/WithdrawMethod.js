// models/WithdrawMethod.js
import mongoose from 'mongoose';

const withdrawMethodSchema = new mongoose.Schema({
  methodName: { type: String, required: true },
  paymentTypes: [{ type: String, required: true }], // e.g., ['personal', 'agent']
  minAmount: { type: Number, required: true },
  maxAmount: { type: Number, required: true },
  methodIcon: { type: String }, // Path to uploaded icon, e.g., '/uploads/method-icons/method-123.jpg'
}, { timestamps: true });

export default mongoose.model('WithdrawMethod', withdrawMethodSchema);