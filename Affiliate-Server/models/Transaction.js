// models/Transaction.js
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    type: {
      type: String,
      enum: ["withdraw_request", "approve", "reject", "refund"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    relatedRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WithdrawalRequest",
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["success", "failed"],
      default: "success",
    },
    accountNumber: { type: String },
    methodName: { type: String },
    paymentType: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
