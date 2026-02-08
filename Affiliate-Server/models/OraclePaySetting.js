import mongoose from "mongoose";

const oraclePaySettingSchema = new mongoose.Schema(
  {
    businessToken: { type: String, default: "" }, // X-Opay-Business-Token
    active: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("OraclePaySetting", oraclePaySettingSchema);
