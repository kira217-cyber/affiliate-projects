// models/WithdrawRequest.js
import mongoose from 'mongoose';

const withdrawRequestSchema = new mongoose.Schema({
  requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Super-affiliate ID
  methodId: { type: mongoose.Schema.Types.ObjectId, ref: 'WithdrawMethod', required: true },
  paymentType: { type: String, required: true },
  accountNumber: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected'] },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Admin who handles it (optional, can be set on approve/reject)
}, { timestamps: true });

export default mongoose.model('WithdrawRequest', withdrawRequestSchema);