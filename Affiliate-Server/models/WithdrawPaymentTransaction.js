// models/WithdrawPaymentTransaction.js
import mongoose from "mongoose";

const withdrawPaymentTransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin", // ← এখানে Admin কারণ তোমার ইউজার Admin মডেলেই আছে
    required: true,
  },
  paymentMethod: {
    methodName: { type: String, required: true },
    methodNameBD: { type: String },
    methodImage: { type: String, required: true },
    gateway: { type: String }, // bKash, Nagad, Rocket
  },
  channel: { type: String, required: true },
  amount: { type: Number, required: true, min: 200, max: 30000 },
  userInputs: [
    {
      name: { type: String, required: true },
      value: { type: String, required: true },
      label: { type: String, required: true },
      labelBD: { type: String },
      type: { type: String, enum: ["text", "number", "file"], required: true },
    },
  ],
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "cancelled"],
    default: "pending",
  },
  reason: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

withdrawPaymentTransactionSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.WithdrawPaymentTransaction ||
  mongoose.model("WithdrawPaymentTransaction", withdrawPaymentTransactionSchema);