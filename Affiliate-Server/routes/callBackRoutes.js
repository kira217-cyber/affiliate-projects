// routes/callback.js
import express from "express";
import Admin from "../models/Admin.js";
import DepositTurnover from "../models/DepositTurnover.js";
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

    console.log("Callback received →", {
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

    // Trim username (আপনার আগের লজিক)
    username = username.substring(0, 45);
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
    if (isNaN(amountFloat)) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    // ────────────────────────────────────────────────
    // Player net change & win/loss determination
    // ────────────────────────────────────────────────
    let isPlayerLoss = false;
    let isPlayerWin = false;
    let playerNetChange = 0;

    if (bet_type === "BET") {
      playerNetChange = -amountFloat;
      isPlayerLoss = true;
    } else if (bet_type === "SETTLE") {
      playerNetChange = amountFloat;

      if (amountFloat > 0) {
        isPlayerWin = true;
      } else if (amountFloat < 0) {
        isPlayerLoss = true;
      } else {
        // amount === 0 → push/cancel, commission নেই
      }
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
      status: isPlayerWin ? "won" : isPlayerLoss ? "lost" : "push",
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
    // Turnover logic (BET & SETTLE উভয় ক্ষেত্রেই)
    // ────────────────────────────────────────────────
    if (["BET", "SETTLE"].includes(bet_type)) {
      const activeTurnover = await DepositTurnover.findOne({
        user: player._id,
        status: "active",
        remainingTurnover: { $gt: 0 },
      }).sort({ activatedAt: 1 }); // oldest first

      if (activeTurnover) {
        // Turnover-এ সাধারণত **bet amount** (stake) যোগ হয়
        const betAmountForTurnover = Math.abs(amountFloat);

        const newCompleted =
          activeTurnover.completedTurnover + betAmountForTurnover;
        const newRemaining = Math.max(
          0,
          activeTurnover.requiredTurnover - newCompleted,
        );

        let newStatus = activeTurnover.status;
        let completedAt = activeTurnover.completedAt;

        if (newRemaining <= 0) {
          newStatus = "completed";
          completedAt = new Date();
        }

        await DepositTurnover.findByIdAndUpdate(activeTurnover._id, {
          $set: {
            completedTurnover: newCompleted,
            remainingTurnover: newRemaining,
            status: newStatus,
            completedAt: completedAt,
          },
        });

        console.log(
          `Turnover updated → User: ${username} | Bet/Settled: ৳${betAmountForTurnover} | Completed: ${newCompleted}/${activeTurnover.requiredTurnover} | Remaining: ${newRemaining}`,
        );

        if (newStatus === "completed") {
          console.log(`Turnover COMPLETED for user ${username}!`);
        }
      }
    }

    // ────────────────────────────────────────────────
    // GAME LOSS COMMISSION (আগের মতো)
    // ────────────────────────────────────────────────
    if (isPlayerLoss && player.referredBy) {
      const lossAmount = Math.abs(playerNetChange); // positive loss amount

      // Master Affiliate (direct referrer)
      const master = await Admin.findById(player.referredBy);
      if (master && master.gameLossCommission > 0) {
        const masterRate = master.gameLossCommission / 100;
        const masterCommission = lossAmount * masterRate;

        if (masterCommission > 0) {
          await Admin.findByIdAndUpdate(master._id, {
            $inc: { gameLossCommissionBalance: masterCommission },
          });
          console.log(
            `Game Loss Commission → Master: +৳${masterCommission.toFixed(2)} to ${master.username}`,
          );
        }

        // Super Affiliate (master-এর referrer)
        if (master.referredBy) {
          const superAff = await Admin.findById(master.referredBy);
          if (
            superAff &&
            superAff.role === "super-affiliate" &&
            superAff.gameLossCommission > master.gameLossCommission
          ) {
            const superRate = superAff.gameLossCommission / 100;
            const totalSuperCommission = lossAmount * superRate;
            const superBonus = totalSuperCommission - masterCommission;

            if (superBonus > 0) {
              await Admin.findByIdAndUpdate(superAff._id, {
                $inc: { gameLossCommissionBalance: superBonus },
              });
              console.log(
                `Game Loss Bonus → Super: +৳${superBonus.toFixed(2)} to ${superAff.username}`,
              );
            }
          }
        }
      }
    }

    // ────────────────────────────────────────────────
    // GAME WIN COMMISSION (নতুন যোগ করা)
    // ────────────────────────────────────────────────
    if (isPlayerWin && player.referredBy) {
      const winAmount = amountFloat; // positive win amount

      // Master Affiliate (direct referrer)
      const master = await Admin.findById(player.referredBy);
      if (master && master.gameWinCommission > 0) {
        const masterRate = master.gameWinCommission / 100;
        const masterCommission = winAmount * masterRate;

        if (masterCommission > 0) {
          await Admin.findByIdAndUpdate(master._id, {
            $inc: { gameWinCommissionBalance: masterCommission },
          });
          console.log(
            `Game Win Commission → Master: +৳${masterCommission.toFixed(2)} to ${master.username}`,
          );
        }

        // Super Affiliate (master-এর referrer)
        if (master.referredBy) {
          const superAff = await Admin.findById(master.referredBy);
          if (
            superAff &&
            superAff.role === "super-affiliate" &&
            superAff.gameWinCommission > master.gameWinCommission
          ) {
            const superRate = superAff.gameWinCommission / 100;
            const totalSuperCommission = winAmount * superRate;
            const superBonus = totalSuperCommission - masterCommission;

            if (superBonus > 0) {
              await Admin.findByIdAndUpdate(superAff._id, {
                $inc: { gameWinCommissionBalance: superBonus },
              });
              console.log(
                `Game Win Bonus → Super: +৳${superBonus.toFixed(2)} to ${superAff.username}`,
              );
            }
          }
        }
      }
    }

    // ────────────────────────────────────────────────
    // Final response
    // ────────────────────────────────────────────────
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
