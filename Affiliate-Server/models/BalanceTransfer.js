// models/BalanceTransferConfig.js
import mongoose from "mongoose";

const balanceTransferConfigSchema = new mongoose.Schema(
  {
    commissionBalance: {
      enabled: { type: Boolean, default: true },
      minAmount: { type: Number, default: 100 },
      maxAmount: { type: Number, default: 100000 },
    },
    gameLossCommissionBalance: {
      enabled: { type: Boolean, default: true },
      minAmount: { type: Number, default: 50 },
      maxAmount: { type: Number, default: 50000 },
    },
    depositCommissionBalance: {
      enabled: { type: Boolean, default: true },
      minAmount: { type: Number, default: 200 },
      maxAmount: { type: Number, default: 100000 },
    },
    referCommissionBalance: {
      enabled: { type: Boolean, default: true },
      minAmount: { type: Number, default: 100 },
      maxAmount: { type: Number, default: 50000 },
    },
  },
  { timestamps: true }
);

// Singleton: Always return one config document
balanceTransferConfigSchema.statics.get = async function () {
  let config = await this.findOne();
  if (!config) {
    config = await this.create({
      commissionBalance: { enabled: true, minAmount: 100, maxAmount: 100000 },
      gameLossCommissionBalance: {
        enabled: true,
        minAmount: 50,
        maxAmount: 50000,
      },
      depositCommissionBalance: {
        enabled: true,
        minAmount: 200,
        maxAmount: 100000,
      },
      referCommissionBalance: {
        enabled: true,
        minAmount: 100,
        maxAmount: 50000,
      },
    });
  }
  return config;
};

export default mongoose.model(
  "BalanceTransferConfig",
  balanceTransferConfigSchema
);
