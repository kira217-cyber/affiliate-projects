// models/SiteSettings.js
import mongoose from "mongoose";

const adminSiteSettingsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: "Affiliate Admin Panel",
  },
  favicon: {
    type: String, // /uploads/favicon.png
    default: "/uploads/favicons.png",
  },
});

adminSiteSettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

export default mongoose.model("AdminSiteSettings", adminSiteSettingsSchema);