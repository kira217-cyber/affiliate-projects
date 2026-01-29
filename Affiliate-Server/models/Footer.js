// models/Footer.js
import mongoose from "mongoose";

const footerSchema = new mongoose.Schema({
  logo: { type: String, default: "/uploads/method-icons/default-logo.png" },
  tagline: { type: String, default: "Rajabaji Trusted Casino – Best Online Cricket Betting App" },
  paymentMethods: [
    {
      name: { type: String, default: "bKash" },
      image: { type: String, default: "/uploads/method-icons/bkash.png" },
    },
  ],
  socialLinks: [
    {
      platform: { type: String, required: true }, // facebook, instagram, youtube, twitter
      url: { type: String, required: true },
    },
  ],
  copyright: { type: String, default: "Copyright © 2025 Rajabaji. All Rights Reserved." },
});

export default mongoose.model("Footer", footerSchema);