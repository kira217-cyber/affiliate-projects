// routes/balanceRoutes.js
import express from "express";
import Admin from "../models/Admin.js";
import BalanceTransferConfig from "../models/BalanceTransfer.js";

const router = express.Router();

// GET: যে কেউ দেখতে পারবে (Admin Panel এর জন্য)
router.get("/", async (req, res) => {
  try {
    const config = await BalanceTransferConfig.get();
    res.json({ success: true, data: config });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// routes/balanceRoutes.js
router.post("/", async (req, res) => {
  try {
    const { source, enabled, minAmount, maxAmount } = req.body;

    // বাধ্যতামূলক ফিল্ড
    if (!source) {
      return res.status(400).json({ success: false, message: "Source is required" });
    }

    let configDoc = await BalanceTransferConfig.findOne();

    // প্রথমবার → নতুন ডকুমেন্ট তৈরি করো
    if (!configDoc) {
      configDoc = new BalanceTransferConfig();
    }

    // শুধু এই source টার জন্য আপডেট করো
    configDoc[source] = {
      enabled: enabled ?? true,
      minAmount: parseInt(minAmount) || 100,
      maxAmount: parseInt(maxAmount) || 50000,
    };

    await configDoc.save();

    res.json({
      success: true,
      message: `${source} rules saved!`,
      data: configDoc[source],
    });
  } catch (error) {
    console.error("Save error:", error);
    res.status(500).json({ success: false, message: "Failed to save" });
  }
});

// POST: Transfer to main balance (শুধু লগইন করা ইউজার)
router.post("/main-balance", async (req, res) => {
  try {
    const { from, amount } = req.body;

    const userId = req.body.userId; // অথবা তুমি যেভাবে ইউজার আইডি পাও
    if (!userId)
      return res
        .status(400)
        .json({ success: false, message: "User ID required" });

    const validSources = [
      "commissionBalance",
      "gameLossCommissionBalance",
      "depositCommissionBalance",
      "referCommissionBalance",
    ];

    if (!validSources.includes(from)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid source" });
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid amount" });
    }

    const user = await Admin.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const config = await BalanceTransferConfig.get();
    const sourceConfig = config[from];

    if (!sourceConfig.enabled) {
      return res.status(400).json({
        success: false,
        message: "This commission transfer is disabled by Admin",
      });
    }

    if (
      amountNum < sourceConfig.minAmount ||
      amountNum > sourceConfig.maxAmount
    ) {
      return res.status(400).json({
        success: false,
        message: `Amount must be between ৳${sourceConfig.minAmount} - ৳${sourceConfig.maxAmount}`,
      });
    }

    if ((user[from] || 0) < amountNum) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient balance" });
    }

    // Transfer
    user.balance += amountNum;
    user[from] -= amountNum;
    await user.save();

    res.json({
      success: true,
      message: "Transfer successful!",
      newMainBalance: user.balance,
      remaining: user[from],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
