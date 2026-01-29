// models/SiteSettings.js
import mongoose from "mongoose";

const siteSettingsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: "Rajabaji - Best Online Casino",
  },
  favicon: {
    type: String, // /uploads/favicon.png
    default: "/uploads/favicon.png",
  },
});

siteSettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

export default mongoose.model("SiteSettings", siteSettingsSchema);