import mongoose from "mongoose";

const socialLinkSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  icon: { type: String, required: true }, // uploaded image path
});

export default mongoose.model("SocialLink", socialLinkSchema);