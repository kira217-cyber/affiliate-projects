// routes/withdraw.js
import express from "express";
import WithdrawMethod from "../models/WithdrawMethod.js";
import WithdrawRequest from "../models/WithdrawRequest.js";
import Transaction from "../models/AdminTransaction.js";
import Admin from "../models/Admin.js";
import upload from "../config/multer.js"; // Your multer
import mongoose from "mongoose";

const router = express.Router();

// Get all methods (for supers to see, set by admin)
router.get("/methods", async (req, res) => {
  try {
    const methods = await WithdrawMethod.find();
    res.json(methods);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Add method (admin only, but no auth check as per instructions)
router.post("/method", upload.single("methodIcon"), async (req, res) => {
  try {
    const { methodName, paymentTypes, minAmount, maxAmount } = req.body;
    const method = new WithdrawMethod({
      methodName,
      paymentTypes: paymentTypes.split(",").map((t) => t.trim()),
      minAmount: Number(minAmount),
      maxAmount: Number(maxAmount),
      methodIcon: req.file
        ? `/uploads/method-icons/${req.file.filename}`
        : null,
    });
    await method.save();
    res.json(method);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// Edit method
router.put("/method/:id", upload.single("methodIcon"), async (req, res) => {
  try {
    const { methodName, paymentTypes, minAmount, maxAmount } = req.body;
    const updateData = {
      methodName,
      paymentTypes: paymentTypes.split(",").map((t) => t.trim()),
      minAmount: Number(minAmount),
      maxAmount: Number(maxAmount),
    };
    if (req.file)
      updateData.methodIcon = `/uploads/method-icons/${req.file.filename}`;
    const method = await WithdrawMethod.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json(method);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// Delete method
router.delete("/method/:id", async (req, res) => {
  try {
    await WithdrawMethod.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Send withdraw request (super sends to admin)
router.post("/request", async (req, res) => {
  try {
    const { requesterId, methodId, paymentType, accountNumber, amount } =
      req.body;
    const user = await Admin.findById(requesterId);
    if (user.balance < amount)
      return res.status(400).json({ msg: "Insufficient balance" });
    user.balance -= amount; // Deduct temporarily
    await user.save();
    const request = new WithdrawRequest({
      requesterId,
      methodId,
      paymentType,
      accountNumber,
      amount,
    });
    await request.save();
    const tx = new Transaction({
      userId: requesterId,
      type: "withdraw_request",
      amount,
      methodName: (await WithdrawMethod.findById(methodId)).methodName,
      accountNumber,
      paymentType,
      relatedRequestId: request._id,
    });
    await tx.save();
    res.json(request);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// routes/withdrawRoutes.js বা adminWithdrawRoutes.js

router.get("/requests", async (req, res) => {
  try {
    // সরাসরি WithdrawRequest collection থেকে সব pending নিবো
    const requests = await WithdrawRequest.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .lean();

    const populatedRequests = await Promise.all(
      requests.map(async (req) => {
        let requester = { username: "Deleted User", phone: "N/A" };
        let method = { methodName: "Deleted Method", methodIcon: null };

        try {
          const user = await mongoose.connection.db
            .collection("admins")
            .findOne({ _id: req.requesterId });

          if (user) {
            requester = {
              username: user.username || "Unknown",
              phone: user.phone || "N/A",
              firstName: user.firstName || "",
              lastName: user.lastName || "",
            };
          }
        } catch (e) {
          console.log("User not found for request:", req._id);
        }

        try {
          const methodDoc = await mongoose.connection.db
            .collection("withdrawmethods")
            .findOne({ _id: req.methodId });

          if (methodDoc) {
            method = {
              methodName: methodDoc.methodName || "Unknown",
              methodIcon: methodDoc.methodIcon || null,
              paymentTypes: methodDoc.paymentTypes || [],
            };
          }
        } catch (e) {
          console.log("Method not found for request:", req._id);
        }

        return {
          ...req,
          requesterId: requester,
          methodId: method,
        };
      })
    );

    res.json(populatedRequests);
  } catch (err) {
    console.error("Error fetching withdraw requests:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Approve Route – কোনো populate নেই → কোনো MissingSchemaError আসবে না
router.put("/approve/:id", async (req, res) => {
  try {
    const requestId = req.params.id;

    // শুধু status আর adminId আপডেট করি
    const updatedRequest = await WithdrawRequest.findByIdAndUpdate(
      requestId,
      {
        status: "approved",
      },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ msg: "Request not found" });
    }

    // Manual data fetch (User + Method) – কোনো populate নেই
    const [user, method] = await Promise.all([
      mongoose.connection.db
        .collection("admins")
        .findOne({ _id: updatedRequest.requesterId }),
      mongoose.connection.db
        .collection("withdrawmethods")
        .findOne({ _id: updatedRequest.methodId }),
    ]);

    const responseData = {
      ...updatedRequest.toObject(),
      requesterId: {
        username: user?.username || "Deleted User",
        phone: user?.phone || "N/A",
      },
      methodId: {
        methodName: method?.methodName || "Unknown Method",
        methodIcon: method?.methodIcon || null,
      },
    };

    res.json({
      success: true,
      message: "Approved successfully",
      request: responseData,
    });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Reject Route – একইভাবে manual lookup
router.put("/reject/:id", async (req, res) => {
  try {
    const requestId = req.params.id;

    const request = await WithdrawRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ msg: "Request not found" });
    }

    // Update status + adminId
    request.status = "rejected";

    await request.save();

    // Refund balance
    await mongoose.connection.db
      .collection("admins")
      .updateOne(
        { _id: request.requesterId },
        { $inc: { balance: request.amount } }
      );

    // Manual populate
    const [user, method] = await Promise.all([
      mongoose.connection.db
        .collection("users")
        .findOne({ _id: request.requesterId }),
      mongoose.connection.db
        .collection("withdrawmethods")
        .findOne({ _id: request.methodId }),
    ]);

    const responseData = {
      ...request.toObject(),
      requesterId: {
        username: user?.username || "Deleted User",
        phone: user?.phone || "N/A",
      },
      methodId: {
        methodName: method?.methodName || "Unknown Method",
        methodIcon: method?.methodIcon || null,
      },
    };

    res.json({
      success: true,
      message: "Rejected & balance refunded",
      request: responseData,
    });
  } catch (err) {
    console.error("Reject error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// routes/adminWithdrawRoutes.js or withdrawRoutes.js
router.get("/admin-all-history", async (req, res) => {
  try {
    const requests = await WithdrawRequest.find({})
      .sort({ createdAt: -1 })
      .lean();

    // Manual populate method & user (no MissingSchemaError)
    const methodIds = [...new Set(requests.map((r) => r.methodId))];
    const requesterIds = [...new Set(requests.map((r) => r.requesterId))];

    const [methods, users] = await Promise.all([
      mongoose.connection.db
        .collection("withdrawmethods")
        .find({ _id: { $in: methodIds } })
        .toArray(),
      mongoose.connection.db
        .collection("admins")
        .find({ _id: { $in: requesterIds } })
        .toArray(),
    ]);

    const methodMap = Object.fromEntries(
      methods.map((m) => [m._id.toString(), m])
    );
    const userMap = Object.fromEntries(users.map((u) => [u._id.toString(), u]));

    const history = requests.map((req) => {
      const method = methodMap[req.methodId?.toString()] || {
        methodName: "Unknown",
        methodIcon: null,
      };
      const user = userMap[req.requesterId?.toString()] || {
        username: "Deleted User",
        phone: "N/A",
      };

      return {
        ...req,
        method: {
          methodName: method.methodName,
          methodIcon: method.methodIcon,
        },
        requester: { username: user.username, phone: user.phone },
      };
    });

    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// GET /api/withdraw/pending-count
router.get("/pending-count", async (req, res) => {
  try {
    const pendingCount = await WithdrawRequest.countDocuments({
      status: "pending",
    });

    res.status(200).json({
      success: true,
      count: pendingCount,
      message: `${pendingCount} pending withdrawal requests found`,
    });
  } catch (error) {
    console.error("Error counting pending withdrawals:", error);
    res.status(500).json({
      success: false,
      message: "Server error while counting pending requests",
      error: error.message,
    });
  }
});

// Get transaction history for super affiliate (their own requests)
router.get("/super-history/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Step 1: সব withdraw request নিবো (pending, approved, rejected)
    const requests = await WithdrawRequest.find({ requesterId: userId })
      .sort({ createdAt: -1 })
      .lean(); // খুব গুরুত্বপূর্ণ – mongoose document → plain object

    if (requests.length === 0) {
      return res.json([]);
    }

    // Step 2: Unique IDs সংগ্রহ করি
    const methodIds = [...new Set(requests.map((r) => r.methodId))];

    // Step 3: Direct collection থেকে method data নিবো (populate ছাড়া)
    const methods = await mongoose.connection.db
      .collection("withdrawmethods")
      .find({ _id: { $in: methodIds } })
      .toArray();

    const methodMap = Object.fromEntries(
      methods.map((m) => [m._id.toString(), m])
    );

    // Step 4: Final response তৈরি করি
    const history = requests.map((req) => {
      const methodIdStr = req.methodId.toString();
      const method = methodMap[methodIdStr] || {
        methodName: "Unknown Method",
        methodIcon: null,
      };

      return {
        _id: req._id,
        amount: req.amount,
        accountNumber: req.accountNumber,
        paymentType: req.paymentType,
        status: req.status,
        createdAt: req.createdAt,
        updatedAt: req.updatedAt,

        // Method info
        method: {
          methodName: method.methodName || "Unknown",
          methodIcon: method.methodIcon || null,
        },

        // Optional: admin যদি approve/reject করে থাকে
        processedByAdmin: req.adminId ? true : false,
      };
    });

    res.json(history);
  } catch (err) {
    console.error("Super history error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
