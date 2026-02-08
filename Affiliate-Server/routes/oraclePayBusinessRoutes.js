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

router.get("/deposits/admin", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "20", 10), 1), 100);
    const skip = (page - 1) * limit;

    const q = String(req.query.q || "").trim();
    const status = String(req.query.status || "").trim().toUpperCase();

    // status filter (optional)
    const matchStage = {};
    if (["PENDING", "PAID", "FAILED"].includes(status)) {
      matchStage.status = status;
    }

    // ✅ aggregation: userIdentity(string) -> ObjectId -> lookup admins -> allow username search
    const pipeline = [
      { $match: matchStage },

      // userIdentity string -> ObjectId (safe convert)
      {
        $addFields: {
          userObjectId: {
            $convert: {
              input: "$userIdentity",
              to: "objectId",
              onError: null,
              onNull: null,
            },
          },
        },
      },

      // lookup admins
      {
        $lookup: {
          from: "admins",
          localField: "userObjectId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $addFields: {
          user: { $arrayElemAt: ["$user", 0] },
        },
      },

      // username search (optional)
      ...(q
        ? [
            {
              $match: {
                $or: [
                  { "user.username": { $regex: q, $options: "i" } },
                  { invoiceNumber: { $regex: q, $options: "i" } },
                  { transactionId: { $regex: q, $options: "i" } },
                ],
              },
            },
          ]
        : []),

      // sort latest first
      { $sort: { createdAt: -1 } },

      // pagination + total in one query
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                userIdentity: 1,
                amount: 1,
                invoiceNumber: 1,
                status: 1,
                checkoutItems: 1,
                transactionId: 1,
                sessionCode: 1,
                bank: 1,
                footprint: 1,
                paidAt: 1,
                createdAt: 1,
                updatedAt: 1,

                // user info
                userName: { $ifNull: ["$user.username", "Unknown"] },
                userWhatsapp: { $ifNull: ["$user.whatsapp", ""] },
                userId: "$userObjectId",
              },
            },
          ],
          total: [{ $count: "count" }],
        },
      },
    ];

    const result = await OraclePayDeposit.aggregate(pipeline);
    const data = result?.[0]?.data || [];
    const total = result?.[0]?.total?.[0]?.count || 0;

    res.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("oraclepay deposits admin error:", err);
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
    // const callbackUrl = `https://gentle-sparrow-84.webhook.cool`;
    const successRedirectUrl = `${process.env.PUBLIC_FRONTEND_URL}`;

    

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

// single user history
router.get("/wallet-agent-history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const list = await OraclePayDeposit.find({ userIdentity: String(userId) })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ success: true, data: list });
  } catch (err) {
    console.error("OraclePay history error:", err?.message || err);
    return res
      .status(500)
      .json({ success: false, message: "Server error" });
  }
});

/**
 * ✅ WEBHOOK (OraclePay -> Backend)
 * POST /api/oraclepay-business/webhook
 * OraclePay requirement: Always reply 'OK'
 */
router.post("/webhook", async (req, res) => {
  // ✅ Always respond OK first
  res.send("OK");

  try {
    const data = req.body || {};

    const invoiceNumber = String(data.invoice_number || "").trim();
    const userId = String(data.user_identity || "").trim();
    const status = String(data.status || "").toUpperCase();
    const amount = Number(data.amount || 0);

    if (!invoiceNumber) return console.log("❌ invoice_number missing");
    if (!userId) return console.log("❌ user_identity missing");
    if (!mongoose.Types.ObjectId.isValid(userId))
      return console.log("❌ invalid user id:", userId);
    if (!amount || amount <= 0) return console.log("❌ invalid amount:", amount);

    // ✅ 1) Create deposit if not exists (idempotent create)
    // invoice unique আছে, তাই duplicate এ error হবে
    // তাই findOne করে create করবো
    let dep = await OraclePayDeposit.findOne({ invoiceNumber });

    if (!dep) {
      dep = await OraclePayDeposit.create({
        userIdentity: userId,
        amount,
        invoiceNumber,
        status: status === "COMPLETED" ? "PAID" : "PENDING",
        checkoutItems: data.checkout_items || {},
        transactionId: data.transaction_id || "",
        sessionCode: data.session_code || "",
        bank: data.bank || "",
        footprint: data.footprint || "",
        paidAt: status === "COMPLETED" ? new Date() : undefined,
      });

      console.log("✅ Deposit created:", invoiceNumber, dep.status);
    } else {
      console.log("ℹ️ Deposit already exists:", invoiceNumber, dep.status);
    }

    // ✅ 2) If not completed, stop here
    if (status !== "COMPLETED") {
      console.log("ℹ️ not completed:", status);
      return;
    }

    // ✅ 3) If already PAID, do not add balance again (idempotent)
    // if (dep.status === "PAID") {
    //   console.log("ℹ️ already PAID, skip balance:", invoiceNumber);
    //   return;
    // }

    // ✅ 4) Update deposit to PAID + set webhook fields
    // conditionally update to avoid race/double
    // const paidDep = await OraclePayDeposit.findOneAndUpdate(
    //   { invoiceNumber, status: { $ne: "PAID" } },
    //   {
    //     $set: {
    //       status: "PAID",
    //       transactionId: data.transaction_id || "",
    //       sessionCode: data.session_code || "",
    //       bank: data.bank || "",
    //       footprint: data.footprint || "",
    //       paidAt: new Date(),
    //       checkoutItems: data.checkout_items || dep.checkoutItems || {},
    //     },
    //   },
    //   { new: true }
    // );

    // if (!paidDep) {
    //   console.log("ℹ️ someone already updated to PAID, skip:", invoiceNumber);
    //   return;
    // }

    // ✅ 5) Add balance
    const updatedUser = await Admin.findByIdAndUpdate(
      userId,
      { $inc: { balance: amount } },
      { new: true }
    ).select("username balance");

    if (!updatedUser) return console.log("❌ Admin not found:", userId);

    console.log(
      `✅ COMPLETED -> Balance Added | user=${updatedUser.username} | +${amount} | newBalance=${updatedUser.balance}`
    );
  } catch (err) {
    console.error("❌ webhook error:", err?.message || err);
  }
});


export default router;
