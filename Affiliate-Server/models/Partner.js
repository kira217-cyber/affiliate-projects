// models/Partner.js
import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema({
  titleBn: { type: String, default: "বিশেষ অংশীদার" },
  titleEn: { type: String, default: "Special Partner" },
  description: { type: String, default: "এখনই নিবন্ধন করুন এবং ৫০% পর্যন্ত রাজস্ব ভাগ সহ আমাদের নতুন অ্যাফিলিয়েট সদস্য হিসেবে উপার্জন শুরু করুন!" },
  highlightText: { type: String, default: "৫০% পর্যন্ত রাজস্ব ভাগ" },
  buttonText: { type: String, default: "আমাদের অংশীদার হোন" },
  leftImage: { type: String, default: "https://i.ibb.co.com/WNkZ1WWz/casino-illustration-vector-3d-elements-theme-casinos-gambling-396616-1541.jpg" },
  bgImage: { type: String, default: "https://i.ibb.co.com/cKsgJMVB/photo-1689443111130-6e9c7dfd8f9e.jpg" }
}, { timestamps: true });

export default mongoose.models.Partner || mongoose.model("Partner", partnerSchema);