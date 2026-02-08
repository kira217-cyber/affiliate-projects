import mongoose from "mongoose";

const oraclePayDepositSchema = new mongoose.Schema(
  {
    userIdentity: { type: String, required: true },
    amount: { type: Number, required: true },
    invoiceNumber: { type: String, required: true, unique: true },

    status: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },

    checkoutItems: { type: Object, default: {} },

    // webhook response fields
    transactionId: { type: String, default: "" },
    sessionCode: { type: String, default: "" },
    bank: { type: String, default: "" },
    footprint: { type: String, default: "" },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("OraclePayDeposit", oraclePayDepositSchema);
