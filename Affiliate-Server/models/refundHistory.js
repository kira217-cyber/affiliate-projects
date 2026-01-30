// models/schemas/refundHistorySchema.js
import mongoose from "mongoose";

const refundHistory = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    provider_code: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    game_code: {
      type: String,
      required: true,
      trim: true,
    },
    bet_type: {
      type: String,
      enum: ["REFUND"],  // শুধু REFUND allowed
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,  // positive amount for refund
    },
    transaction_id: {
      type: String,
      required: true,
      unique: true,  // ডুপ্লিকেট প্রিভেন্ট
    },
    verification_key: String,
    times: String,  // ISO string বা timestamp
    status: {
      type: String,
      enum: ["refunded"],
      default: "refunded",
    },
    round_id: String,  // optional
    refund_details: mongoose.Schema.Types.Mixed,  // অতিরিক্ত ডিটেইলস যদি থাকে
  },
  {
    timestamps: true,  // createdAt, updatedAt অটো
  }
);

// ইনডেক্স যোগ
refundHistory.index({ transaction_id: 1 });
refundHistory.index({ username: 1, createdAt: -1 });
refundHistory.index({ provider_code: 1 });

export default refundHistory;