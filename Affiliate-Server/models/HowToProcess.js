// models/HowToProcess.js
import mongoose from "mongoose";

const stepSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  icon: { type: String, required: true } // /uploads/method-icons/xxx.png
});

const howToProcessSchema = new mongoose.Schema({
  mainHeading: { type: String, default: "কিভাবে এটা কাজ করে" },
  buttonText: { type: String, default: "আমাদের অংশীদার হয়ে উঠুন" },
  steps: [stepSchema]
}, { timestamps: true });

export default mongoose.model("HowToProcess", howToProcessSchema);