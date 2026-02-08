import express from "express";
import mongoose from "mongoose";
import axios from "axios";
import OraclePaySetting from "../models/OraclePaySetting.js";
import OraclePayDeposit from "../models/OraclePayDeposit.js";
import Admin from "../models/Admin.js";

const router = express.Router();

/**
 * Helper: always ensure settings exists
 */
async function getOrCreateSetting() {
  let s = await OraclePaySetting.findOne();
  if (!s) {
    s = new OraclePaySetting({ businessToken: "", active: false });
    await s.save();
  }
  return s;
}

/**
 * ✅ ADMIN: GET settings (token + active)
 * GET /api/oraclepay-business/admin
 */
router.get("/admin", async (req, res) => {
  try {
    const s = await getOrCreateSetting();
    res.json({
      success: true,
      data: { businessToken: s.businessToken || "", active: !!s.active },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * ✅ ADMIN: UPDATE settings
 * PUT /api/oraclepay-business/admin
 * body: { businessToken, active }
 */
router.put("/admin", async (req, res) => {
  try {
    const { businessToken, active } = req.body;

    const s = await getOrCreateSetting();

    if (typeof businessToken === "string") s.businessToken = businessToken.trim();
    if (typeof active === "boolean") s.active = active;

    await s.save();

    res.json({
      success: true,
      message: "OraclePay settings updated",
      data: { active: !!s.active },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * ✅ FRONTEND: STATUS (token hide)
 * GET /api/oraclepay-business/status
 */
router.get("/status", async (req, res) => {
  try {
    const s = await getOrCreateSetting();
    const enabled = !!(s.active && s.businessToken);
    res.json({ success: true, data: { enabled } });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * ✅ CREATE PAYMENT LINK (Client -> Backend)
 * POST /api/oraclepay-business/create
 * body: { amount, userIdentity, invoiceNumber, checkoutItems }
 *
 * Important: token server-side থেকেই যাবে
 */
router.post("/create", async (req, res) => {
  try {
    const s = await getOrCreateSetting();
    if (!s.active || !s.businessToken) {
      return res
        .status(400)
        .json({ success: false, message: "OraclePay is disabled by admin." });
    }

    const { amount, userIdentity, invoiceNumber, checkoutItems } = req.body;

    const numAmount = Number(amount);

    if (!userIdentity) {
      return res.status(400).json({ success: false, message: "userIdentity required" });
    }
    if (!invoiceNumber) {
      return res.status(400).json({ success: false, message: "invoiceNumber required" });
    }
    if (!numAmount || numAmount < 5) {
      return res.status(400).json({ success: false, message: "Minimum amount is 5" });
    }

    // ✅ callback_url + success_redirect_url env থেকে
    const callbackUrl = `${process.env.PUBLIC_BACKEND_URL}/api/oraclepay-business/webhook`;
    const successRedirectUrl = `${process.env.PUBLIC_FRONTEND_URL}/success?invoice=${encodeURIComponent(
      invoiceNumber
    )}`;

    // ✅ deposit record create (PENDING)
    await OraclePayDeposit.create({
      userIdentity: String(userIdentity),
      amount: numAmount,
      invoiceNumber: String(invoiceNumber),
      status: "PENDING",
      checkoutItems: checkoutItems || {},
    });

    // ✅ OraclePay API call
    const opayRes = await axios.post(
      "https://api.oraclepay.org/api/opay-business/generate-payment-page",
      {
        payment_amount: numAmount,
        user_identity_address: String(userIdentity),
        callback_url: callbackUrl,
        success_redirect_url: successRedirectUrl,
        checkout_items: checkoutItems || {},
        invoice_number: String(invoiceNumber),
      },
      {
        headers: { "X-Opay-Business-Token": s.businessToken },
      }
    );

    if (!opayRes?.data?.success || !opayRes?.data?.payment_page_url) {
      return res.status(400).json({
        success: false,
        message: "Failed to create payment link",
        data: opayRes?.data || null,
      });
    }

    res.json({
      success: true,
      payment_page_url: opayRes.data.payment_page_url,
    });
  } catch (err) {
    // Duplicate invoiceNumber handle
    if (err?.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "invoiceNumber already exists. Try again.",
      });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * ✅ WEBHOOK (OraclePay -> Backend)
 * POST /api/oraclepay-business/webhook
 * OraclePay requirement: Always reply 'OK'
 */
router.post("/webhook", async (req, res) => {
  res.send("OK");

  try {
    const data = req.body || {};
    const invoiceRaw = data.invoice_number || data.invoiceNumber;
    if (!invoiceRaw) {
      console.log("❌ invoice missing");
      return;
    }

    const invoiceNumber = String(invoiceRaw).trim();
    const status = String(data.status || "").toUpperCase();
    if (status !== "COMPLETED") {
      console.log("ℹ️ not completed:", status);
      return;
    }

    // ✅ update deposit to PAID (idempotent)
    const dep = await OraclePayDeposit.findOneAndUpdate(
      { invoiceNumber, status: { $ne: "PAID" } },
      {
        $set: {
          status: "PAID",
          transactionId: data.transaction_id || "",
          sessionCode: data.session_code || "",
          bank: data.bank || "",
          footprint: data.footprint || "",
          paidAt: new Date(),
          checkoutItems: data.checkout_items || {},
        },
      },
      { new: true }
    );

    if (!dep) {
      console.log("ℹ️ deposit not found or already PAID:", invoiceNumber);
      return;
    }

    const amount = Number(data.amount ?? dep.amount ?? 0);
    if (!amount || amount <= 0) {
      console.log("❌ invalid amount:", data.amount, dep.amount);
      return;
    }

    // ✅ তোমার ক্ষেত্রে userIdentity ব্যবহার হবে
    const userId = String(dep.userIdentity || "").trim();
    if (!userId) {
      console.log("❌ dep.userIdentity missing");
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log("❌ invalid userId:", userId);
      return;
    }

    // ✅ balance inc and capture updated user
    const updatedUser = await Admin.findByIdAndUpdate(
      userId,
      { $inc: { balance: amount } },
      { new: true }
    ).select("username balance");

    if (!updatedUser) {
      console.log("❌ Admin not found for userId:", userId);
      return;
    }

    console.log(
      `✅ Balance Added | user=${updatedUser.username} | newBalance=${updatedUser.balance} | +${amount}`
    );
  } catch (err) {
    console.error("❌ OraclePay webhook error:", err?.message || err);
  }
});


export default router;
