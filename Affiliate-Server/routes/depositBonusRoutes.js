// routes/depositBonus.js
import express from "express";
// import { DepositBonus } from "../models/DepositBonus.js";
import DepositBonus from "../models/DepositBonus.js";

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