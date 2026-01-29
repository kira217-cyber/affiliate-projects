// models/schemas/gameHistorySchema.js

import mongoose from "mongoose";

const gameHistory = new mongoose.Schema(
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
      enum: ["BET", "SETTLE", "CANCEL", "REFUND"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    transaction_id: {
      type: String,
      required: true,
      unique: true, // খুবই জরুরি! ডুপ্লিকেট প্রিভেন্ট করবে
    },
    verification_key: String,
    times: String, // ISO string বা timestamp
    status: {
      type: String,
      enum: ["won", "lost", "cancelled", "refunded"],
      default: function () {
        return this.bet_type === "SETTLE" ? "won" : "lost";
      },
    },
    round_id: String, // optional
    bet_details: mongoose.Schema.Types.Mixed, // যদি আরো ডিটেইলস থাকে
  },
  {
    timestamps: true, // createdAt, updatedAt অটো যোগ হবে
  }
);

// ইনডেক্স যোগ করে দ্রুত সার্চ করা যায়
gameHistory.index({ transaction_id: 1 });
gameHistory.index({ username: 1, createdAt: -1 });
gameHistory.index({ provider_code: 1 });

export default gameHistory;