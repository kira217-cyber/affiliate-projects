// models/Promotion.js
import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema({
  image: { type: String, required: true },
  title_en: { type: String, required: true },
  title_bn: { type: String, required: true },
  description_en: { type: String, required: true },
  description_bn: { type: String, required: true },
  footer_en: { type: String },
  footer_bn: { type: String },
  category: {
    type: String,
    enum: [
      "All",
      "Deposit",
      "Slots",
      "Fishing",
      "APP Download",
      "Newbie",
      "Rebate",
      "Ranking",
      "Poker",
      "Live Casino",
      "Sports",
    ],
    default: "All",
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

// এখানে default export করুন
const Promotion = mongoose.model("Promotion", promotionSchema);

export default Promotion;