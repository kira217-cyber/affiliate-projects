// models/WhyChooseUs.js
import mongoose from "mongoose";

const featureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  icon: { type: String, default: "" } // required: false
});

const whyChooseUsSchema = new mongoose.Schema({
  backgroundImage: { type: String, required: true },
  heading: { type: String, default: "কেন আমাদের?" },
  subheading: { type: String, default: "RAJABAJI সেরা অধিভুক্ত সহযোগিতা এবং সুবিশেষ গ্যারান্টি দেয়!" },
  features: [featureSchema]
}, { timestamps: true });

export default mongoose.model("WhyChooseUs", whyChooseUsSchema);