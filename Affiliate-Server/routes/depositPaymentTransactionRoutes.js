// routes/depositTransaction.routes.js
import express from "express";
import DepositPaymentTransaction from "../models/DepositPaymentTransaction.js";
import DepositPaymentMethod from "../models/DepositPaymentMethod.js";
import Admin from "../models/Admin.js"; // তোমার ইউজার মডেল
import DepositBonus from "../models/DepositBonus.js";
import DepositTurnover from "../models/DepositTurnover.js"

const router = express.Router();

// ===============================================
// POST: Create Deposit Request (User Side)
// ===============================================
router.post("/deposit-transaction", async (req, res) => {
  try {
    const {
      paymentMethodId,
      userId,
      channel,
      amount,
      userInputs = [],
    } = req.body;

    if (!paymentMethodId || !amount || !userId) {
      return res.status(400).json({
        success: false,
        msg: "paymentMethodId, channel & amount required",
      });
    }

    const method = await DepositPaymentMethod.findById(paymentMethodId);
    if (!method || method.status !== "active") {
      return res.status(400).json({
        success: false,
        msg: "Invalid or inactive payment method",
      });
    }

    // চেক করো amount রেঞ্জে আছে কিনা
    if (amount < method.minAmount || amount > method.maxAmount) {
      return res.status(400).json({
        success: false,
        msg: `Amount must be between ${method.minAmount} - ${method.maxAmount} BDT`,
      });
    }

    const transaction = new DepositPaymentTransaction({
      userId,
      paymentMethodId,
      paymentMethod: {
        methodName: method.methodName,
        methodNameBD: method.methodNameBD,
        methodImage: method.methodImage,
        agentWalletNumber: method.agentWalletNumber,
        agentWalletText: method.agentWalletText || "agent",
      },
      channel,
      amount,
      userInputs,
      status: "pending",
    });

    await transaction.save();

    res.status(201).json({
      success: true,
      msg: "Deposit request created successfully",
      data: transaction,
    });
  } catch (err) {
    console.error("Create deposit error:", err);
    res
      .status(500)
      .json({ success: false, msg: "Server error", error: err.message });
  }
});

// ===============================================
// GET: All Deposit Transactions (Admin Panel)
// ===============================================
router.get("/deposit-transaction", async (req, res) => {
  try {
    const transactions = await DepositPaymentTransaction.find()
      .populate("userId", "username whatsapp email")
      .populate(
        "paymentMethodId",
        "methodName methodNameBD methodImage agentWalletNumber"
      )
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

// ===============================================
// GET: Single Transaction Details
// ===============================================
router.get("/deposit-transaction/:id", async (req, res) => {
  try {
    const transaction = await DepositPaymentTransaction.findById(req.params.id)
      .populate("userId", "username whatsapp email")
      .populate("paymentMethodId", "methodName methodNameBD");

    if (!transaction) {
      return res
        .status(404)
        .json({ success: false, msg: "Transaction not found" });
    }

    res.json({ success: true, data: transaction });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

// ===============================================
// PUT: /deposit-transaction/:id   → Approve / Reject / Cancel

router.put("/deposit-transaction/:id", async (req, res) => {
  try {
    const { status, reason } = req.body;

    if (!["pending", "completed", "failed", "cancelled"].includes(status)) {
      return res.status(400).json({ success: false, msg: "Invalid status" });
    }

    if (["failed", "cancelled"].includes(status) && !reason?.trim()) {
      return res.status(400).json({ success: false, msg: "Reason required for failed/cancelled" });
    }

    const transaction = await DepositPaymentTransaction.findById(req.params.id)
      .populate("userId", "username balance referredBy depositCommission depositCommissionBalance")
      .populate("paymentMethodId");

    if (!transaction) {
      return res.status(404).json({ success: false, msg: "Transaction not found" });
    }

    const wasPending = transaction.status === "pending";
    const isNowCompleted = status === "completed";

    // স্ট্যাটাস আপডেট
    await DepositPaymentTransaction.findByIdAndUpdate(
      req.params.id,
      {
        status,
        reason: reason?.trim() || "",
        updatedAt: Date.now(),
      },
      { new: true }
    );

    // শুধু pending থেকে completed হলেই সব হিসাব + turnover
    if (isNowCompleted && wasPending) {
      const depositAmount = transaction.amount;
      const user = transaction.userId;
      const userId = user._id;

      // Bonus হিসাব
      let bonusAmount = 0;
      let bonusType = null;
      let bonusValue = null;

      let turnoverMultiplier = 1; // default fallback

      if (transaction.paymentMethodId?._id) {
        const paymentMethodObjId = transaction.paymentMethodId._id;

        // ১. DepositBonus থেকে এই payment method এর config খুঁজে বের করা
        const bonusConfig = await DepositBonus.findOne({
          payment_methods: paymentMethodObjId,
        });

        if (bonusConfig) {
          // ২. promotion_bonuses এর মধ্যে এই payment_method এর entry খুঁজে নেওয়া
          const matchingBonus = bonusConfig.promotion_bonuses.find(
            (b) => b.payment_method.toString() === paymentMethodObjId.toString()
          );

          if (matchingBonus) {
            // ৩. Bonus হিসাব
            if (matchingBonus.bonus > 0) {
              bonusAmount = matchingBonus.bonus_type === "Percentage"
                ? depositAmount * (matchingBonus.bonus / 100)
                : matchingBonus.bonus;

              bonusType = matchingBonus.bonus_type;
              bonusValue = matchingBonus.bonus;

              console.log(`DEPOSIT BONUS +৳${bonusAmount.toFixed(2)} (${bonusValue}${bonusType === "Percentage" ? "%" : "৳"}) → ${user.username}`);
            }

            // ৪. Turnover multiplier নেওয়া (এখান থেকেই!)
            if (matchingBonus.turnover_multiplier != null) {
              turnoverMultiplier = Number(matchingBonus.turnover_multiplier);
              // নিরাপত্তার জন্য: 0 বা negative হলে কমপক্ষে 1 রাখা
              if (turnoverMultiplier < 1) turnoverMultiplier = 1;
            }
          }
        }
      }

      const totalCredited = depositAmount + bonusAmount;

      // User balance আপডেট (deposit + bonus)
      await Admin.findByIdAndUpdate(userId, { $inc: { balance: totalCredited } });

      // Transaction-এ bonus info সেভ করা
      if (bonusAmount > 0) {
        await DepositPaymentTransaction.findByIdAndUpdate(transaction._id, {
          $set: {
            bonusApplied: bonusAmount,
            bonusType,
            bonusValue,
          },
        });
      }

      // Turnover হিসাব এবং entry তৈরি
      const requiredTurnover = totalCredited * turnoverMultiplier;

      const turnover = new DepositTurnover({
        user: userId,
        depositRequest: transaction._id,
        depositAmount,
        bonusAmount,
        totalCreditedAmount: totalCredited,
        turnoverMultiplier,                    // ← এখন DepositBonus থেকে আসছে
        requiredTurnover,
        remainingTurnover: requiredTurnover,
        completedTurnover: 0,
        status: 'active',
        activatedAt: new Date(),
        // expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),  // optional
      });

      await turnover.save();

      // Affiliate Commission (অপরিবর্তিত)
      if (user.referredBy) {
        const master = await Admin.findById(user.referredBy);
        if (master && master.depositCommission > 0) {
          const masterRate = master.depositCommission / 100;
          const masterCommission = depositAmount * masterRate;
          if (masterCommission > 0) {
            await Admin.findByIdAndUpdate(master._id, {
              $inc: { depositCommissionBalance: masterCommission },
            });
            console.log(`Master Commission: +৳${masterCommission.toFixed(2)} → ${master.username}`);
          }

          if (master.referredBy) {
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

      // সফল লগ
      console.log(
        `DEPOSIT SUCCESS → ${user.username} | Deposit: ৳${depositAmount} | Bonus: ৳${bonusAmount.toFixed(2)} | Total Credit: ৳${totalCredited.toFixed(2)} | Turnover Multiplier: ${turnoverMultiplier}x | Required Turnover: ৳${requiredTurnover.toFixed(2)}`
      );

      return res.json({
        success: true,
        msg: "Deposit approved successfully. Balance, bonus & turnover created.",
        data: {
          totalCredited,
          bonusAmount,
          turnover: {
            requiredTurnover,
            multiplier: turnoverMultiplier,
            turnoverId: turnover._id,
          },
        },
      });
    }

    // অন্য স্ট্যাটাসের ক্ষেত্রে (reject/cancel)
    res.json({ success: true, msg: "Transaction updated successfully" });
  } catch (err) {
    console.error("Deposit transaction error:", err);
    res.status(500).json({ success: false, msg: "Server error", error: err.message });
  }
});


router.get("/stats", async (req, res) => {
  try {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Aggregation pipeline দিয়ে সবকিছু একসাথে calculate করছি (efficient)
    const stats = await DepositPaymentTransaction.aggregate([
      {
        $facet: {
          // Total Completed Deposit (with promotion bonus)
          totalDeposit: [
            { $match: { status: "completed" } },
            {
              $addFields: {
                bonusAmount: {
                  $cond: {
                    if: { $eq: ["$promotionBonus.bonus_type", "Fix"] },
                    then: "$promotionBonus.bonus",
                    else: {
                      $cond: {
                        if: { $eq: ["$promotionBonus.bonus_type", "Percentage"] },
                        then: {
                          $multiply: ["$amount", { $divide: ["$promotionBonus.bonus", 100] }]
                        },
                        else: 0
                      }
                    }
                  }
                }
              }
            },
            {
              $group: {
                _id: null,
                total: { $sum: { $add: ["$amount", "$bonusAmount"] } }
              }
            }
          ],

          // Today's Completed Deposit
          todayDeposit: [
            { $match: { status: "completed", createdAt: { $gte: last24Hours } } },
            {
              $addFields: {
                bonusAmount: {
                  $cond: {
                    if: { $eq: ["$promotionBonus.bonus_type", "Fix"] },
                    then: "$promotionBonus.bonus",
                    else: {
                      $cond: {
                        if: { $eq: ["$promotionBonus.bonus_type", "Percentage"] },
                        then: {
                          $multiply: ["$amount", { $divide: ["$promotionBonus.bonus", 100] }]
                        },
                        else: 0
                      }
                    }
                  }
                }
              }
            },
            {
              $group: {
                _id: null,
                total: { $sum: { $add: ["$amount", "$bonusAmount"] } }
              }
            }
          ],

          // Pending Deposit Count
          pendingCount: [
            { $match: { status: "pending" } },
            { $count: "count" }
          ]
        }
      }
    ]);

    // Result formatting
    const result = {
      totalDeposit: stats[0].totalDeposit[0]?.total || 0,
      todayDeposit: stats[0].todayDeposit[0]?.total || 0,
      pendingDepositRequests: stats[0].pendingCount[0]?.count || 0,
    };

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error("Deposit stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch deposit stats"
    });
  }
});

// ===============================================
// DELETE: Delete Transaction (Admin)
// ===============================================
router.delete("/deposit-transaction/:id", async (req, res) => {
  try {
    const transaction = await DepositPaymentTransaction.findByIdAndDelete(
      req.params.id
    );

    if (!transaction) {
      return res
        .status(404)
        .json({ success: false, msg: "Transaction not found" });
    }

    res.json({ success: true, msg: "Transaction deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

// ===============================================
// GET: Search Transactions (by phone, name, trxid)
// ===============================================
router.get("/deposit-search-transaction/search", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res
        .status(400)
        .json({ success: false, msg: "Search query required" });
    }

    const transactions = await DepositPaymentTransaction.find({
      $or: [
        { "userInputs.value": { $regex: query, $options: "i" } }, // TrxID
        { "userId.phoneNumber": { $regex: query, $options: "i" } },
        { "userId.name": { $regex: query, $options: "i" } },
      ],
    })
      .populate("userId", "name phoneNumber")
      .populate("paymentMethodId", "methodName")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Search error" });
  }
});

export default router;
