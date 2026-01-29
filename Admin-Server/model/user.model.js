const mongoose = require("mongoose");
const config = require("../config/config");
const validator = require("validator");

const GameHistorySchema = new mongoose.Schema({
  username: String,
  bet_amount: Number,
  win_amount: Number,
  gameID: String,
  serial_number: String,
  currency: String,
  status: String,
  playedAt: Date,
});

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: null,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      default: () =>
        `${Math.floor(Math.random() * 100000)}${Math.floor(
          Math.random() * 10
        )}`,
    },
    country: {
      type: String,
      default: null,
    },
    currency: {
      type: String,
      default: null,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      validate: {
        validator: (value) =>
          validator.isMobilePhone(value, "any", { strictMode: false }),
        message: "Invalid phone number format",
      },
    },
    phoneNumberOTP: {
      type: Number,
      default: null,
    },
    phoneNumberVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    player_id: {
      type: String,
      required: [true, "Player ID is required"],
    },
    promoCode: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    emailVerifyOTP: {
      type: Number,
      default: null,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "banned", "deactivated"],
      default: "active",
    },
    balance: {
      type: Number,
      default: 0,
    },
    deposit: {
      type: Number,
      default: 0,
    },
    withdraw: {
      type: Number,
      default: 0,
    },
    bonusSelection: {
      type: String,
      default: null,
    },
    birthday: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profileImage: {
      type: String,
      default: null,
    },
    gameHistory: [GameHistorySchema],
  },
  { timestamps: true }
);

// Index for unique phoneNumber
UserSchema.index({ phoneNumber: 1 }, { unique: true });

// Handle duplicate key errors
UserSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    next(new Error(`${field} already exists`));
  } else {
    next(error);
  }
});

// Use a dedicated connection for user data (affiliate cluster)
const usersConn = mongoose.createConnection(config.USERS_DB_CONN || config.DB_CONN);
const User = usersConn.model("User", UserSchema);
module.exports = User;
