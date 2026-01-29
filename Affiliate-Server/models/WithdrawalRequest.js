import mongoose from "mongoose";

const withdrawalRequestSchema = new mongoose.Schema({
  requesterId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  approverId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }, // super-affiliate
  methodId: { type: mongoose.Schema.Types.ObjectId, ref: "WithdrawalMethod", required: true },
  paymentType: { type: String, required: true },
  accountNumber: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }, // যে অ্যাপ্রুভ করল
  approvedAt: { type: Date },
  rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }, // যে রিজেক্ট করল
  rejectedAt: { type: Date },
}, { timestamps: true });

export default mongoose.model("WithdrawalRequest", withdrawalRequestSchema);