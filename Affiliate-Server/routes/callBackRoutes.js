// routes/callback.js
import express from "express";
import Admin from "../models/Admin.js";
import DepositTurnover from "../models/DepositTurnover.js"; // ← নতুন import যোগ করো
import mongoose from "mongoose";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    let {
      account_id,
      username,
      provider_code,
      amount,
      game_code,
      verification_key,
      bet_type,
      transaction_id,
      times,
    } = req.body;

    console.log("Callback received ->", {
      account_id,
      username,
      provider_code,
      amount,
      game_code,
      bet_type,
      transaction_id,
    });

    // Required fields validation
    if (!username || !provider_code || !amount || !game_code || !bet_type) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing.",
      });
    }

    // Trim username
    username = username.substring(0, 45);
    username = username.substring(0, username.length - 2);

    const player = await Admin.findOne({ username });
    if (!player) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    console.log("Matched player ID ->", player._id);

    const amountFloat = parseFloat(amount);
    if (isNaN(amountFloat)) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    // Determine if player lost money
    let isPlayerLoss = false;
    let playerNetChange = 0;

    if (bet_type === "BET") {
      playerNetChange = -amountFloat;
      isPlayerLoss = true;
    } else if (bet_type === "SETTLE") {
      playerNetChange = amountFloat;
      if (amountFloat <= 0) isPlayerLoss = true;
    } else {
      isPlayerLoss = false;
    }

    const gameRecord = {
      username,
      provider_code,
      game_code,
      bet_type,
      amount: amountFloat,
      transaction_id: transaction_id || null,
      verification_key: verification_key || null,
      times: times || null,
      status: bet_type === "SETTLE" && amountFloat > 0 ? "won" : "lost",
      createdAt: new Date(),
    };

    const newBalance = (player.balance || 0) + playerNetChange;

    // Update player balance & push game history
    const updatedPlayer = await Admin.findOneAndUpdate(
      { _id: player._id },
      {
        $set: { balance: newBalance },
        $push: { gameHistory: gameRecord },
      },
      { new: true },
    );

    if (!updatedPlayer) {
      return res.status(500).json({
        success: false,
        message: "Failed to update player data.",
      });
    }

    // ────────────────────────────────────────────────
    // ── NEW: Turnover পূরণ লজিক ──
    // ────────────────────────────────────────────────
    // শুধুমাত্র BET বা SETTLE-এর ক্ষেত্রে turnover update করব
    // এবং শুধু active turnover-এ (remaining > 0)
    if (["BET", "SETTLE"].includes(bet_type)) {
      // Active turnover খুঁজে বের করা (সবচেয়ে পুরোনো active-টা প্রথমে update করা ভালো)
      const activeTurnover = await DepositTurnover.findOne({
        user: player._id,
        status: "active",
        remainingTurnover: { $gt: 0 },
      }).sort({ activatedAt: 1 }); // oldest first

      if (activeTurnover) {
        // এখানে amountFloat হচ্ছে bet amount (BET-এ negative, SETTLE-এ positive)
        // কিন্তু turnover-এ সাধারণত **bet amount** (যে টাকা বাজি ধরা হয়েছিল) যোগ হয়
        // তাই আমরা absolute value নিবো
        const betAmountForTurnover = Math.abs(amountFloat);

        // completedTurnover বাড়ানো
        const newCompleted =
          activeTurnover.completedTurnover + betAmountForTurnover;

        // remaining হিসাব
        const newRemaining = Math.max(
          0,
          activeTurnover.requiredTurnover - newCompleted,
        );

        // status update
        let newStatus = activeTurnover.status;
        let completedAt = activeTurnover.completedAt;

        if (newRemaining <= 0) {
          newStatus = "completed";
          completedAt = new Date();
        }

        // Atomic update
        await DepositTurnover.findByIdAndUpdate(activeTurnover._id, {
          $set: {
            completedTurnover: newCompleted,
            remainingTurnover: newRemaining,
            status: newStatus,
            completedAt: completedAt,
          },
        });

        console.log(
          `Turnover updated → User: ${username} | Bet/Settled: ৳${betAmountForTurnover} | Completed: ${newCompleted} / ${activeTurnover.requiredTurnover} | Remaining: ${newRemaining}`,
        );

        // Optional: যদি completed হয়ে যায় তাহলে notification বা log
        if (newStatus === "completed") {
          console.log(
            `Turnover COMPLETED for user ${username}! Required: ৳${activeTurnover.requiredTurnover}`,
          );
        }
      } else {
        console.log(`No active turnover found for user ${username}`);
      }
    }

    // === Multi-Level Game Loss Commission Logic ===
    if (isPlayerLoss && player.referredBy) {
      const lossAmount = Math.abs(playerNetChange);

      const referrer = await Admin.findById(player.referredBy);
      if (referrer && referrer.gameLossCommission > 0) {
        const masterRate = referrer.gameLossCommission / 100;
        const masterCommission = lossAmount * masterRate;

        if (masterCommission > 0) {
          await Admin.findByIdAndUpdate(referrer._id, {
            $inc: { gameLossCommissionBalance: masterCommission },
          });
          console.log(
            `Master Commission: +৳${masterCommission.toFixed(2)} → ${referrer.username}`,
          );
        }

        if (referrer.referredBy) {
          const superReferrer = await Admin.findById(referrer.referredBy);

          if (
            superReferrer &&
            superReferrer.role === "super-affiliate" &&
            superReferrer.gameLossCommission > referrer.gameLossCommission
          ) {
            const superRate = superReferrer.gameLossCommission / 100;
            const totalSuperCommission = lossAmount * superRate;
            const superBonus = totalSuperCommission - masterCommission;

            if (superBonus > 0) {
              await Admin.findByIdAndUpdate(superReferrer._id, {
                $inc: { gameLossCommissionBalance: superBonus },
              });
              console.log(
                `Super Bonus: +৳${superBonus.toFixed(2)} → ${superReferrer.username}`,
              );
            }
          }
        }
      }
    }

    res.json({
      success: true,
      message: "Callback processed successfully.",
      data: {
        username,
        new_balance: updatedPlayer.balance,
        gameRecord,
      },
    });
  } catch (error) {
    console.error("Callback error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

export default router;
