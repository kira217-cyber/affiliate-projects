// models/Tricker.js
import mongoose from "mongoose";

const trickerSchema = new mongoose.Schema({
  images: [
    {
      url: { type: String, required: true },
      alt: { type: String, default: "Logo" },
    },
  ],
});

export default mongoose.model("Tricker", trickerSchema);