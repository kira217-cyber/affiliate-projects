import mongoose from 'mongoose';

const adminTransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Super or Admin
  type: { type: String, required: true }, // e.g., 'withdraw_request', 'approve', 'reject', 'refund'
  amount: { type: Number, required: true },
  methodName: { type: String },
  accountNumber: { type: String },
  paymentType: { type: String },
  description: { type: String },
  relatedRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'WithdrawRequest' }
}, { timestamps: true });

export default mongoose.model('AdminTransaction', adminTransactionSchema);