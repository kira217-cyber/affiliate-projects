// routes/refund.js
import express from "express";
import Admin from "../models/Admin.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    let {
      account_id,
      username: rawUsername,
      provider_code,
      amount,
      game_code,
      verification_key,
      bet_type,
      transaction_id,
      times,
    } = req.body;

    console.log("Refund callback received →", {
      account_id,
      rawUsername,
      provider_code,
      amount,
      game_code,
      bet_type,
      transaction_id,
    });

    // Required fields validation
    if (!rawUsername || !provider_code || !amount || !game_code || !bet_type) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing.",
      });
    }

    // Trim username (তোমার callback-এর মতো)
    let username = rawUsername.substring(0, 45);
    username = username.substring(0, username.length - 2);

    const player = await Admin.findOne({ username });
    if (!player) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    console.log("Matched player ID →", player._id);

    const amountFloat = parseFloat(amount);
    if (isNaN(amountFloat) || amountFloat <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or non-positive amount",
      });
    }

    // ────────────────────────────────────────────────
    // নতুন কন্ডিশন: শুধুমাত্র bet_type === "REFUND" হলেই প্রসেস করবে
    // ────────────────────────────────────────────────
    // if (bet_type !== "REFUND") {
    //   return res.status(400).json({
    //     success: false,
    //     message: `Invalid bet_type for refund endpoint. Expected "REFUND", received "${bet_type}"`,
    //   });
    // }

    // ────────────────────────────────────────────────
    // Player net change: Refund হিসেবে +amount
    // ────────────────────────────────────────────────
    const playerNetChange = +amountFloat; // positive add to balance

    const refundRecord = {
      username,
      provider_code,
      game_code,
      bet_type: "REFUND",
      amount: amountFloat,
      transaction_id: transaction_id || null,
      verification_key: verification_key || null,
      times: times || null,
      status: "refunded",
      createdAt: new Date(),
    };

    const newBalance = (player.balance || 0) + playerNetChange;

    // Update player balance & push refund history
    const updatedPlayer = await Admin.findOneAndUpdate(
      { _id: player._id },
      {
        $set: { balance: newBalance },
        $push: { refundHistory: refundRecord },
      },
      { new: true },
    );

    if (!updatedPlayer) {
      return res.status(500).json({
        success: false,
        message: "Failed to update player data.",
      });
    }

    // Final response
    res.json({
      success: true,
      message: "Refund processed successfully.",
      data: {
        username,
        new_balance: updatedPlayer.balance,
        refundRecord,
      },
    });
  } catch (error) {
    console.error("Refund callback error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

export default router;
