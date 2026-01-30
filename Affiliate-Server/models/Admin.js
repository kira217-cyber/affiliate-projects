import mongoose from "mongoose";
import gameHistory from "./GameHistory.js"
import refundHistory from "./refundHistory.js";  // নতুন import
import wallets from "./Wallets.js"

const adminSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    username: { type: String, required: true, unique: true },
    email: { type: String, unique: true},
    whatsapp: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["super-affiliate", "master-affiliate", "user"],
      default: "super-affiliate",
    },
    referralCode: { type: String, unique: true },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    createdUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Admin" }],

    isActive: { type: Boolean, default: false },
    balance: { type: Number, default: 0 },
    commissionBalance: { type: Number, default: 0 },
    gameLossCommission: { type: Number, default: 0 },
    depositCommission: { type: Number, default: 0 },
    referCommission: { type: Number, default: 0 },
    gameWinCommission: { type: Number, default: 0 },
    gameWinCommissionBalance: { type: Number, default: 0 },
    gameLossCommissionBalance: { type: Number, default: 0 },
    depositCommissionBalance: { type: Number, default: 0 },
    referCommissionBalance : { type: Number, default: 0 },
    gameHistory:[gameHistory],
    refundHistory: [refundHistory],
    wallets:[wallets],

    pendingRequests: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "WithdrawalRequest",
      default: [], // এই লাইন অবশ্যই থাকতে হবে!
    },
  },
  { timestamps: true }
);

adminSchema.pre("save", function (next) {
  if (!this.referralCode && this._id) {
    this.referralCode = this._id.toString().slice(-6).toUpperCase();
  }
  next();
});

export default mongoose.model("Admin", adminSchema);
