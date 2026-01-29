import express from "express";
const router = express.Router();
import WithdrawalMethod from "../models/WithdrawalMethod.js";
import WithdrawalRequest from "../models/WithdrawalRequest.js";
import Transaction from "../models/Transaction.js";
import Admin from "../models/Admin.js";
import upload from "../config/multer.js";

// POST: Add Method (Super Affiliate Only)
router.post("/method", upload.single("methodIcon"), async (req, res) => {
  try {
    const { adminId, methodName, paymentTypes, minAmount, maxAmount } = req.body;

    // Validate Admin
    const admin = await Admin.findById(adminId);
    if (!admin || admin.role !== "super-affiliate") {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    // Validate required fields
    if (!methodName || !paymentTypes || !minAmount || !maxAmount) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Convert paymentTypes string to array
    const paymentTypesArray = paymentTypes
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);

    if (paymentTypesArray.length === 0) {
      return res.status(400).json({ msg: "At least one payment type is required" });
    }

    // Create new method
    const method = new WithdrawalMethod({
      adminId,
      methodName: methodName.trim(),
      paymentTypes: paymentTypesArray,
      minAmount: Number(minAmount),
      maxAmount: Number(maxAmount),
      methodIcon: req.file ? `/uploads/method-icons/${req.file.filename}` : null,
    });

    await method.save();
    console.log("Method Added:", method);
    res.status(201).json(method);
  } catch (err) {
    console.error("POST /method error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// PUT: Update Method (Super Affiliate Only)
router.put("/method/:methodId", upload.single("methodIcon"), async (req, res) => {
  try {
    const { adminId, methodName, paymentTypes, minAmount, maxAmount } = req.body;
    const methodId = req.params.methodId;

    // Validate Admin
    const admin = await Admin.findById(adminId);
    if (!admin || admin.role !== "super-affiliate") {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    // Find existing method
    const existingMethod = await WithdrawalMethod.findById(methodId);
    if (!existingMethod) {
      return res.status(404).json({ msg: "Method not found" });
    }

    // Validate required fields
    if (!methodName || !paymentTypes || !minAmount || !maxAmount) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Convert paymentTypes string to array
    const paymentTypesArray = paymentTypes
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);

    if (paymentTypesArray.length === 0) {
      return res.status(400).json({ msg: "At least one payment type is required" });
    }

    // Prepare update data
    const updateData = {
      methodName: methodName.trim(),
      paymentTypes: paymentTypesArray,
      minAmount: Number(minAmount),
      maxAmount: Number(maxAmount),
    };

    // Handle image update
    if (req.file) {
      // Delete old image if exists
      if (existingMethod.methodIcon) {
        const oldImagePath = path.join(__dirname, "..", existingMethod.methodIcon);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log("Deleted old image:", oldImagePath);
        }
      }
      updateData.methodIcon = `/uploads/method-icons/${req.file.filename}`;
    }

    // Update method
    const updatedMethod = await WithdrawalMethod.findByIdAndUpdate(
      methodId,
      updateData,
      { new: true, runValidators: true }
    );

    console.log("Method Updated:", updatedMethod);
    res.json(updatedMethod);
  } catch (err) {
    console.error("PUT /method error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// গেট মেথডস (সুপার বা মাস্টারের উপলাইনের)
router.get("/methods/:adminId", async (req, res) => {
  const admin = await Admin.findById(req.params.adminId);
  const superId =
    admin.role === "super-affiliate" ? admin._id : admin.referredBy;
  const methods = await WithdrawalMethod.find({ adminId: superId });
  res.json(methods);
});

// DELETE /api/withdraw/method/:methodId
router.delete("/method/:methodId", async (req, res) => {
  try {
    const methodId = req.params.methodId;

    const method = await WithdrawalMethod.findById(methodId);
    if (!method) {
      return res.status(404).json({ msg: "মেথড পাওয়া যায়নি" });
    }

    // অপশনাল: চেক করুন যে এই মেথড সেই অ্যাডমিনের কিনা
    // if (method.adminId.toString() !== req.body.adminId) {
    //   return res.status(403).json({ msg: "অনুমতি নেই" });
    // }

    await WithdrawalMethod.findByIdAndDelete(methodId);
    res.json({ msg: "মেথড ডিলিট হয়েছে" });
  } catch (err) {
    console.error("Delete Method Error:", err);
    res.status(500).json({ msg: "সার্ভারে সমস্যা" });
  }
});

// ক্রিয়েট রিকোয়েস্ট (মাস্টার ওনলি)
router.post("/request", async (req, res) => {
  const { requesterId, methodId, paymentType, accountNumber, amount } =
    req.body;

  const requester = await Admin.findById(requesterId);
  if (
    !requester ||
    requester.role !== "master-affiliate" ||
    requester.balance < amount
  )
    return res.status(400).json({ msg: "Invalid request" });

  const method = await WithdrawalMethod.findById(methodId);
  if (amount < method.minAmount || amount > method.maxAmount)
    return res.status(400).json({ msg: "Amount out of range" });

  requester.balance -= amount;
  await requester.save();

  const request = new WithdrawalRequest({
    requesterId,
    approverId: requester.referredBy,
    methodId,
    paymentType,
    accountNumber,
    amount,
  });
  await request.save();

  const superAdmin = await Admin.findById(requester.referredBy);
  superAdmin.pendingRequests.push(request._id);
  await superAdmin.save();

  // শুধু এই অংশ আপডেট
  const tx = new Transaction({
    adminId: requesterId,
    type: "withdraw_request",
    amount,
    relatedRequestId: request._id,
    description: "Withdraw requested",
    accountNumber, // নতুন
    methodName: method.methodName, // নতুন
    paymentType, // নতুন
  });
  await tx.save();

  res.json(request);
});

// Get Pending Requests
router.get("/requests/:adminId", async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.adminId).populate({
      path: "pendingRequests",
      populate: [
        { path: "requesterId", select: "username firstName lastName" },
        { path: "methodId", select: "methodName paymentTypes methodIcon" },
      ],
    });

    if (!admin) return res.status(404).json({ msg: "Admin not found" });
    res.json(admin.pendingRequests || []);
  } catch (err) {
    console.error("Get Requests Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});


// approve
router.put("/approve/:requestId", async (req, res) => {
  try {
    const { adminId } = req.body;
    if (!adminId) return res.status(400).json({ msg: "Admin ID required" });

    const admin = await Admin.findById(adminId);
    if (!admin || admin.role !== "super-affiliate")
      return res.status(403).json({ msg: "Unauthorized" });

    const request = await WithdrawalRequest.findById(req.params.requestId)
      .populate("requesterId")
      .populate("methodId");

    if (!request || request.status !== "pending")
      return res.status(400).json({ msg: "Invalid request" });

    // Update Request
    request.status = "approved";
    request.approvedBy = adminId;
    request.approvedAt = new Date();
    await request.save();

    // Add to Super's balance
    admin.commissionBalance += request.amount;
    await admin.save();

    // Remove from pending
    admin.pendingRequests = admin.pendingRequests.filter(
      (id) => id.toString() !== request._id.toString()
    );
    await admin.save();

    // Update Transaction: adminId আপডেট করুন!
    const updatedTx = await Transaction.findOneAndUpdate(
      { relatedRequestId: request._id, type: "withdraw_request" },
      {
        type: "approve",
        adminId: adminId, // এই লাইন অবশ্যই
        description: "Withdraw approved - amount sent",
        accountNumber: request.accountNumber,
        methodName: request.methodId?.methodName,
        paymentType: request.paymentType,
        status: "success",
      },
      { new: true }
    );

    res.json({ msg: "Approved", transaction: updatedTx });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// reject
router.put("/reject/:requestId", async (req, res) => {
  try {
    const { adminId } = req.body;
    if (!adminId) return res.status(400).json({ msg: "Admin ID required" });

    const admin = await Admin.findById(adminId);
    if (!admin || admin.role !== "super-affiliate")
      return res.status(403).json({ msg: "Unauthorized" });

    const request = await WithdrawalRequest.findById(req.params.requestId)
      .populate("requesterId")
      .populate("methodId");

    if (!request || request.status !== "pending")
      return res.status(400).json({ msg: "Invalid request" });

    // Refund
    const requester = await Admin.findById(request.requesterId._id);
    if (requester) {
      requester.balance += request.amount;
      await requester.save();
    }

    // Update Request
    request.status = "rejected";
    request.rejectedBy = adminId;
    request.rejectedAt = new Date();
    await request.save();

    // Remove from pending
    admin.pendingRequests = admin.pendingRequests.filter(
      (id) => id.toString() !== request._id.toString()
    );
    await admin.save();

    // Update Transaction: adminId আপডেট করুন!
    const updatedTx = await Transaction.findOneAndUpdate(
      { relatedRequestId: request._id, type: "withdraw_request" },
      {
        type: "refund", // আপনার স্কিমায় আছে
        adminId: adminId, // এই লাইন অবশ্যই
        description: "Withdraw rejected - amount refunded",
        accountNumber: request.accountNumber,
        methodName: request.methodId?.methodName,
        paymentType: request.paymentType,
        status: "success",
      },
      { new: true }
    );

    res.json({ msg: "Rejected & refunded", transaction: updatedTx });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// GET /api/withdraw/history/:adminId
router.get("/history/:adminId", async (req, res) => {
  try {
    const adminId = req.params.adminId;

    // ১. নিজের ট্রানজেকশন
    const ownTx = await Transaction.find({ adminId });

    // ২. রিকোয়েস্টের সাথে সম্পর্কিত ট্রানজেকশন
    const requests = await WithdrawalRequest.find({ requesterId: adminId });
    const requestIds = requests.map((r) => r._id);

    const relatedTx = await Transaction.find({
      relatedRequestId: { $in: requestIds },
      type: { $in: ["approve", "refund"] },
    });

    // ৩. একত্রিত
    const allTx = [...ownTx, ...relatedTx];

    // ৪. ডুপ্লিকেট সরান
    const unique = Array.from(
      new Map(allTx.map((t) => [t._id.toString(), t])).values()
    );

    res.json(unique);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// GET /api/withdraw/master-history/:adminId
router.get("/master-history/:adminId", async (req, res) => {
  try {
    const adminId = req.params.adminId;

    // ১. মাস্টারের নিজের ট্রানজেকশন
    const ownTx = await Transaction.find({ adminId });

    // ২. মাস্টারের রিকোয়েস্টের সাথে সম্পর্কিত ট্রানজেকশন (approve/refund)
    const requests = await WithdrawalRequest.find({ requesterId: adminId });
    const requestIds = requests.map((r) => r._id);

    const relatedTx = await Transaction.find({
      relatedRequestId: { $in: requestIds },
      type: { $in: ["approve", "refund"] },
    });

    // ৩. একত্রিত
    const allTx = [...ownTx, ...relatedTx];

    // ৪. ডুপ্লিকেট সরান
    const unique = Array.from(
      new Map(allTx.map((t) => [t._id.toString(), t])).values()
    );

    res.json(unique);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
