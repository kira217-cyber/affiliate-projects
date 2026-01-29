const mongoose = require("mongoose");
const config = require("../config/config");

// Minimal Admin schema aligned with fields used by deposit flow
const AdminSchema = new mongoose.Schema(
  {
    name: { type: String, default: null },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, default: null },
    username: { type: String, default: null },
    player_id: { type: String, default: null },
    balance: { type: Number, default: 0 },
    deposit: { type: Number, default: 0 },
    status: { type: String, default: "active" },
  },
  { timestamps: true }
);

// Bind to affiliate users DB and use the 'admins' collection explicitly
const adminConn = mongoose.createConnection(config.USERS_DB_CONN || config.DB_CONN);
module.exports = adminConn.model("Admin", AdminSchema, "admins");
