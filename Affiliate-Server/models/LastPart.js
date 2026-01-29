// models/LastPart.js
import mongoose from "mongoose";

const lastPartSchema = new mongoose.Schema({
  titleBn: { type: String, default: "RAJABAJI অ্যাফিলিয়েট প্রোগ্রাম" },
  titleEn: { type: String, default: "RAJABAJI Affiliate Program" },
  subtitle: { type: String, default: "আমাদের অংশ হতে আবেদন করুন" },
  description: {
    type: String,
    default:
      "আমরা ক্রমাগত আমাদের গ্রাহকদের কাছ থেকে ১০০% বিশ্বস্ততার সাথে বৃদ্ধি পাচ্ছি। আমাদের সাথে যোগ দিন এবং একসাথে শেয়ার করতে এবং উপার্জন করতে এখনই আমাদের অংশীদার হোন।",
  },
  buttonText: { type: String, default: "যোগাযোগ করুন" },
  buttonLink: { type: String, default: "/register" },
  tabletImage: { type: String, default: "/uploads/method-icons/default-tablet.jpg" },
  mobileImage: { type: String, default: "/uploads/method-icons/default-mobile.jpg" },
});

export default mongoose.model("LastPart", lastPartSchema);