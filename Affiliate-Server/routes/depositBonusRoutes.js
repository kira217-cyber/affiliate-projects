// routes/depositBonus.js
import express from "express";
// import { DepositBonus } from "../models/DepositBonus.js";
import DepositBonus from "../models/DepositBonus.js";
import Admin from "../models/Admin.js";
import DepositPaymentTransaction from "../models/DepositPaymentTransaction.js";
import DepositTurnover from "../models/DepositTurnover.js";

const router = express.Router();

// GET: All Bonuses
router.get("/", async (req, res) => {
  try {
    const bonuses = await DepositBonus.find()
      .populate("payment_methods", "methodName methodNameBD agentWalletNumber")
      .populate("promotion_bonuses.payment_method", "methodName methodNameBD");

    res.json({
      success: true,
      count: bonuses.length,
      data: bonuses,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

// POST: Create Bonus
router.post("/", async (req, res) => {
  try {
    const { payment_methods, promotion_bonuses } = req.body;

    if (!payment_methods || payment_methods.length === 0) {
      return res.status(400).json({ success: false, msg: "At least one payment method required" });
    }

    // Optional: basic server-side validation
    for (const bonus of promotion_bonuses || []) {
      if (bonus.turnover_percentage == null) {
        bonus.turnover_percentage = 0;
      }
      if (bonus.turnover_percentage < 0) {
        return res.status(400).json({ success: false, msg: "Turnover percentage cannot be negative" });
      }
    }

    const newBonus = await DepositBonus.create({
      payment_methods,
      promotion_bonuses,
    });

    const populated = await DepositBonus.findById(newBonus._id)
      .populate("payment_methods", "methodName methodNameBD agentWalletNumber")
      .populate("promotion_bonuses.payment_method", "methodName methodNameBD");

    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: err.message });
  }
});

// server 2 → routes এ যোগ করো (যেমন: depositRoutes.js বা adminRoutes.js)
// path: POST /opay/deposit-confirm   (তোমার দেওয়া path অনুযায়ী)
router.post('/opay/deposit-confirm', async (req, res) => {
  try {
    const {
      username,
      amount,
      trxid,
      token,
      method = 'opay',
      time,
      from,
    } = req.body;

    // Validation
    if (!username || username.trim() === '') {
      return res.status(400).json({ success: false, message: "username দরকার" });
    }

    const depositAmount = Number(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      return res.status(400).json({ success: false, message: "valid amount দরকার (number > 0)" });
    }

    // User খোঁজা + referredBy populate (এক লেভেল)
    const user = await Admin.findOne({ username: username.trim() })
      .populate('referredBy', 'username depositCommission depositCommissionBalance referredBy role');

    if (!user) {
      return res.status(404).json({ success: false, message: "ইউজার পাওয়া যায়নি" });
    }

    // Fixed values (temporary)
    const OPAY_PAYMENT_METHOD_ID = '000000000000000000000000'; // dummy
    const OPAY_CHANNEL = 'Merchant'; // or 'Personal'

    // Bonus skipped
    let bonusAmount = 0;
    let bonusType = null;
    let bonusValue = null;
    let turnoverMultiplier = 1;

    console.log(`[OPAY] Bonus skipped → ${user.username}`);

    const totalCredited = depositAmount + bonusAmount;

    // Transaction create
    const newTransaction = new DepositPaymentTransaction({
      userId: user._id,
      paymentMethodId: OPAY_PAYMENT_METHOD_ID,
      channel: OPAY_CHANNEL,
      amount: depositAmount,
      status: 'completed',
      trxid,
      token,
      method,
      from,
      time: time ? new Date(time) : new Date(),
      bonusApplied: bonusAmount,
      bonusType,
      bonusValue,
    });

    const savedTransaction = await newTransaction.save();

    // Balance update
    user.balance = (user.balance || 0) + totalCredited;
    await user.save();

    // Turnover
    const requiredTurnover = totalCredited * turnoverMultiplier;
    const turnover = new DepositTurnover({
      user: user._id,
      depositRequest: savedTransaction._id,
      depositAmount,
      bonusAmount,
      totalCreditedAmount: totalCredited,
      turnoverMultiplier,
      requiredTurnover,
      remainingTurnover: requiredTurnover,
      completedTurnover: 0,
      status: 'active',
      activatedAt: new Date(),
    });
    await turnover.save();

    // ─── Affiliate Commission ───────────────────────────────────────────
    // Manual API-এর মতো ঠিক একই লজিক (populate + findById দুটোই ব্যবহার করা হচ্ছে)
    if (user.referredBy) {
      // master = referredBy (populate হয়ে আছে)
      const master = user.referredBy;

      if (master && master.depositCommission > 0) {
        const masterRate = master.depositCommission / 100;
        const masterCommission = depositAmount * masterRate;

        if (masterCommission > 0) {
          await Admin.findByIdAndUpdate(master._id, {
            $inc: { depositCommissionBalance: masterCommission },
          });
          console.log(`Master Commission: +৳${masterCommission.toFixed(2)} → ${master.username}`);
        }

        // Super-affiliate চেক (যদি master-এরও referrer থাকে)
        if (master.referredBy) {
          // এখানে আবার findById করা হচ্ছে (manual API-এর মতো)
          const superAff = await Admin.findById(master.referredBy);

          if (
            superAff &&
            superAff.role === "super-affiliate" &&
            superAff.depositCommission > master.depositCommission
          ) {
            const superRate = superAff.depositCommission / 100;
            const totalSuperCommission = depositAmount * superRate;
            const superBonus = totalSuperCommission - masterCommission;

            if (superBonus > 0) {
              await Admin.findByIdAndUpdate(superAff._id, {
                $inc: { depositCommissionBalance: superBonus },
              });
              console.log(`Super Affiliate Bonus: +৳${superBonus.toFixed(2)} → ${superAff.username}`);
            }
          }
        }
      }
    }

    // Success log & response
    console.log(
      `OPAY DEPOSIT SUCCESS → ${user.username} | Deposit: ৳${depositAmount} | ` +
      `Bonus: ৳${bonusAmount} | Total: ৳${totalCredited} | ` +
      `Turnover: ${turnoverMultiplier}x → ৳${requiredTurnover} | trxid: ${trxid || 'N/A'}`
    );

    return res.status(200).json({
      success: true,
      message: "Opay deposit সফলভাবে যোগ হয়েছে",
      data: {
        deposited: depositAmount,
        bonus: bonusAmount,
        totalCredited,
        newBalance: user.balance,
        turnoverRequired: requiredTurnover,
        turnoverId: turnover._id,
        transactionId: savedTransaction._id,
      }
    });

  } catch (err) {
    console.error("Opay deposit error:", err.message || err);
    return res.status(500).json({
      success: false,
      message: "সার্ভারে সমস্যা হয়েছে",
      error: err.message
    });
  }
});

// PUT: Update Bonus
router.put("/:id", async (req, res) => {
  try {
    const updated = await DepositBonus.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("payment_methods", "methodName methodNameBD")
      .populate("promotion_bonuses.payment_method", "methodName methodNameBD");

    if (!updated) {
      return res.status(404).json({ success: false, msg: "Bonus not found" });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: err.message });
  }
});

// DELETE: Delete Bonus
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await DepositBonus.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, msg: "Bonus not found" });
    }
    res.json({ success: true, msg: "Bonus deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: err.message });
  }
});

export default router;