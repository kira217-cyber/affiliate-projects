// models/SuperAffiliateVideo.js
import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    default: "Master Affiliate Tutorial",
  },
});

const masterAffiliateVideoSchema = new mongoose.Schema({
  videos: [videoSchema],
}, { timestamps: true });

export default mongoose.model("MasterAffiliateVideo", masterAffiliateVideoSchema);