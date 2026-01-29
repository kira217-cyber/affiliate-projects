// models/Slider.js
import mongoose from "mongoose";

const sliderSchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  button1Text: { type: String, required: true },
  button1Link: { type: String, default: "#" },
  button2Text: { type: String, required: true },
  button2Link: { type: String, default: "#" },
  titleColor: { type: String, default: "#99FF47" },
  subtitleColor: { type: String, default: "#e5e7eb" },
  button1Color: { type: String, default: "#99FF47" },
  button1TextColor: { type: String, default: "#000000" },
  button2Color: { type: String, default: "#7c3aed" },
  button2TextColor: { type: String, default: "#ffffff" },
  titleSize: { type: String, default: "text-5xl" },
  subtitleSize: { type: String, default: "text-xl" },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Slider", sliderSchema);