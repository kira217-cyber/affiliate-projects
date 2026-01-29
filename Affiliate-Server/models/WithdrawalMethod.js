// models/WithdrawalMethod.js
import mongoose from "mongoose";

const withdrawalMethodSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  methodName: { type: String, required: true },
  paymentTypes: [{ type: String }],
  minAmount: { type: Number, required: true },
  maxAmount: { type: Number, required: true },
  methodIcon: { type: String }, // নতুন ফিল্ড: ইমেজ URL
}, { timestamps: true });

export default mongoose.model("WithdrawalMethod", withdrawalMethodSchema);