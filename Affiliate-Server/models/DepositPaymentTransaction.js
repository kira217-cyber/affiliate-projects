// models/DepositPaymentTransaction.js
import mongoose from "mongoose";

const depositPaymentTransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  paymentMethodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DepositPaymentMethod",
    required: true,
  },
  paymentMethod: {
    methodName: String,
    methodNameBD: String,
    methodImage: String,
    agentWalletNumber: String,
    agentWalletText: String,
  },
  channel: { type: String, required: true }, // e.g., "Personal", "Merchant"
  amount: { type: Number, required: true, min: 100 },
  promotionId: { type: mongoose.Schema.Types.ObjectId, ref: "Promotion", default: null },
  promotionTitle: { type: String, default: "" },
  userInputs: [
    {
      name: String,
      value: String,
      label: String,
      labelBD: String,
      type: { type: String, enum: ["text", "number", "file"] },
    },
  ],
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "cancelled"],
    default: "pending",
  },
  reason: { type: String, default: "" },
}, { timestamps: true });

depositPaymentTransactionSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  if (["failed", "cancelled"].includes(this.status) && !this.reason) {
    return next(new Error("Reason is required for failed/cancelled status"));
  }
  next();
});

export default mongoose.models.DepositPaymentTransaction ||
  mongoose.model("DepositPaymentTransaction", depositPaymentTransactionSchema);