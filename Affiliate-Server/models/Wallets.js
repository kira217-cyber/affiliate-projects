// models/Wallets.js
import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
  methodId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Payment method ID
  processTab: { type: String }, // e.g., "Personal" or "Agent"
  inputs: [
    {
      name: { type: String, required: true }, // e.g., "accountNumber"
      value: { type: String, required: true }, // e.g., "01712345678"
      label: { type: String }, // e.g., "Account Number"
      labelBD: { type: String }, // e.g., "অ্যাকাউন্ট নম্বর"
    },
  ],
});

export default walletSchema;