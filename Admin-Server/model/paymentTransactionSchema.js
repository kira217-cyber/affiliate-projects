const mongoose = require("mongoose");

const paymentTransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  paymentMethod: {
    methodName: {
      type: String,
      required: true,
    },
    agentWalletNumber: {
      type: String,
      required: true,
    },
    agentWalletText: {
      type: String,
      required: true,
    },
    paymentPageImage: {
      // Changed from methodImage to match frontend
      type: String,
      required: true,
    },
    gateway: {
      type: String,
      default: "",
    },
  },
  channel: {
    type: String,
    default: "",
  },
  amount: {
    type: Number,
    required: true,
    min: 200,
    max: 30000,
  },
  promotionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Promotion",
    default: null,
  },
  promotionTitle: {
    type: String,
    default: "",
  },
  promotionBonus: {
    bonus_type: {
      type: String,
      enum: [null, "Fix", "Percentage"],
      default: null,
    },
    bonus: {
      type: Number,
      default: null,
    },
  },
  userInputs: [
    {
      name: {
        type: String,
        required: true,
      },
      value: {
        type: String,
        required: true,
      },
      label: {
        type: String,
        required: true,
      },
      labelBD: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        enum: ["number", "text", "file"],
        required: true,
      },
    },
  ],
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "cancelled"],
    default: "pending",
  },
  reason: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

paymentTransactionSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  // Validate reason only for failed or cancelled status
  if (["failed", "cancelled"].includes(this.status) && !this.reason) {
    return next(new Error("Reason is required for failed or cancelled status"));
  }
  next();
});

// Export the model, reusing it if already defined
module.exports =
  mongoose.models.PaymentTransaction ||
  mongoose.model("PaymentTransaction", paymentTransactionSchema);
