// models/DepositTurnover.js
import mongoose from 'mongoose';

const depositTurnoverSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
      index: true,
    },
    depositRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DepositPaymentTransaction',
      required: true,
      unique: true,
    },
    depositAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    bonusAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalCreditedAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    turnoverMultiplier: {
      type: Number,
      required: true,
      min: 0,
    },
    requiredTurnover: {
      type: Number,
      required: true,
      min: 0,
    },
    completedTurnover: {
      type: Number,
      default: 0,
      min: 0,
    },
    remainingTurnover: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'expired', 'cancelled'],
      default: 'active',
    },
    activatedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
      // optional — যদি পরে expiry logic যোগ করতে চাও
    },
  },
  { timestamps: true }
);

export default mongoose.model('DepositTurnover', depositTurnoverSchema);