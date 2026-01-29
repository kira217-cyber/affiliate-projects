// routes/depositPaymentMethod.routes.js

import express from "express";
import DepositPaymentMethod from "../models/DepositPaymentMethod.js";
import upload from "../config/multer.js"; // তোমার multer config আগের মতোই থাকবে
import path from "path";
import fs from "fs";

const router = express.Router();

// দুটো ফাইল accept করবে: methodImage (required), paymentPageImage (optional)
const uploadFields = upload.fields([
  { name: "methodImage", maxCount: 1 },
  { name: "paymentPageImage", maxCount: 1 },
]);

// =============================
// POST: Add New Method
// =============================
router.post("/method", uploadFields, async (req, res) => {
  try {
    const {
      methodName,
      methodNameBD,
      agentWalletNumber,
      agentWalletText,
      gateway,
      color,
      backgroundColor,
      buttonColor,
      instruction,
      instructionBD,
      status,
      userInputs,
    } = req.body;

    // Required fields
    if (!methodName || !methodNameBD || !agentWalletNumber || !agentWalletText) {
      return res.status(400).json({
        success: false,
        msg: "Method Name, Bangla Name, Wallet Number & Text are required",
      });
    }

    // methodImage is required
    if (!req.files || !req.files.methodImage) {
      return res.status(400).json({
        success: false,
        msg: "Method image is required",
      });
    }

    // Parse gateway
    let gatewayArr = [];
    if (gateway) {
      try {
        gatewayArr = typeof gateway === "string" ? JSON.parse(gateway) : gateway;
        if (!Array.isArray(gatewayArr)) {
          gatewayArr = gateway.split(",").map((g) => g.trim());
        }
      } catch (e) {
        gatewayArr = gateway.split(",").map(g => g.trim());
      }
    }

    // Parse userInputs
    let userInputsArr = [];
    if (userInputs) {
      try {
        userInputsArr = typeof userInputs === "string" ? JSON.parse(userInputs) : userInputs;
      } catch (e) {
        userInputsArr = [];
      }
    }

    const newMethod = new DepositPaymentMethod({
      methodName: methodName.trim(),
      methodNameBD: methodNameBD.trim(),
      agentWalletNumber: agentWalletNumber.trim(),
      agentWalletText: agentWalletText.trim(),
      methodImage: req.files.methodImage[0].filename,
      paymentPageImage: req.files.paymentPageImage ? req.files.paymentPageImage[0].filename : "",
      gateway: gatewayArr,
      color: color || "#000000",
      backgroundColor: backgroundColor || "#ffffff",
      buttonColor: buttonColor || "#000000",
      instruction: instruction || "",
      instructionBD: instructionBD || "",
      status: status || "active",
      userInputs: userInputsArr,
    });

    const saved = await newMethod.save();

    res.status(201).json({
      success: true,
      msg: "Deposit method added successfully",
      data: {
        ...saved._doc,
        methodImage: `/uploads/method-icons/${req.files.methodImage[0].filename}`,
        paymentPageImage: req.files.paymentPageImage
          ? `/uploads/method-icons/${req.files.paymentPageImage[0].filename}`
          : "",
      },
    });
  } catch (err) {
    console.error("Add deposit method error:", err);
    res.status(500).json({ success: false, msg: "Server error", error: err.message });
  }
});

// =============================
// PUT: Update Method
// =============================
router.put("/method/:id", uploadFields, async (req, res) => {
  try {
    const method = await DepositPaymentMethod.findById(req.params.id);
    if (!method) {
      return res.status(404).json({ success: false, msg: "Method not found" });
    }

    // Update text fields
    method.methodName = req.body.methodName?.trim() || method.methodName;
    method.methodNameBD = req.body.methodNameBD?.trim() || method.methodNameBD;
    method.agentWalletNumber = req.body.agentWalletNumber?.trim() || method.agentWalletNumber;
    method.agentWalletText = req.body.agentWalletText?.trim() || method.agentWalletText;
    method.color = req.body.color || method.color;
    method.backgroundColor = req.body.backgroundColor || method.backgroundColor;
    method.buttonColor = req.body.buttonColor || method.buttonColor;
    method.instruction = req.body.instruction ?? method.instruction;
    method.instructionBD = req.body.instructionBD ?? method.instructionBD;
    method.status = req.body.status || method.status;

    // Gateway
    if (req.body.gateway) {
      try {
        method.gateway = typeof req.body.gateway === "string" ? JSON.parse(req.body.gateway) : req.body.gateway;
        if (!Array.isArray(method.gateway)) {
          method.gateway = req.body.gateway.split(",").map((g) => g.trim());
        }
      } catch (e) {
        method.gateway = req.body.gateway.split(",").map((g) => g.trim());
      }
    }

    // User Inputs
    if (req.body.userInputs) {
      try {
        method.userInputs = typeof req.body.userInputs === "string"
          ? JSON.parse(req.body.userInputs)
          : req.body.userInputs;
      } catch (e) {
        method.userInputs = [];
      }
    }

    // Handle methodImage update (if new file uploaded)
    if (req.files && req.files.methodImage) {
      // Delete old image
      if (method.methodImage) {
        const oldPath = path.join(process.cwd(), "uploads/method-icons", method.methodImage);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      method.methodImage = req.files.methodImage[0].filename;
    }

    // Handle paymentPageImage update (optional)
    if (req.files && req.files.paymentPageImage) {
      if (method.paymentPageImage) {
        const oldPath = path.join(process.cwd(), "uploads/method-icons", method.paymentPageImage);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      method.paymentPageImage = req.files.paymentPageImage[0].filename;
    }

    const updated = await method.save();

    res.json({
      success: true,
      msg: "Updated successfully",
      data: {
        ...updated._doc,
        methodImage: `/uploads/method-icons/${updated.methodImage}`,
        paymentPageImage: updated.paymentPageImage
          ? `/uploads/method-icons/${updated.paymentPageImage}`
          : "",
      },
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

// =============================
// বাকি রুট (একদম আগের মতোই)
// =============================

router.get("/methods", async (req, res) => {
  try {
    const methods = await DepositPaymentMethod.find().sort({ createdAt: -1 });
    const formatted = methods.map((m) => ({
      ...m._doc,
      methodImage: `/uploads/method-icons/${m.methodImage}`,
      paymentPageImage: m.paymentPageImage ? `/uploads/method-icons/${m.paymentPageImage}` : "",
    }));
    res.json({ success: true, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

router.get("/method/:id", async (req, res) => {
  try {
    const method = await DepositPaymentMethod.findById(req.params.id);
    if (!method) return res.status(404).json({ success: false, msg: "Not found" });

    res.json({
      success: true,
      data: {
        ...method._doc,
        methodImage: `/uploads/method-icons/${method.methodImage}`,
        paymentPageImage: method.paymentPageImage ? `/uploads/method-icons/${method.paymentPageImage}` : "",
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

router.delete("/method/:id", async (req, res) => {
  try {
    const method = await DepositPaymentMethod.findByIdAndDelete(req.params.id);
    if (!method) return res.status(404).json({ success: false, msg: "Not found" });

    // Delete files
    if (method.methodImage) {
      const path1 = path.join(process.cwd(), "uploads/method-icons", method.methodImage);
      if (fs.existsSync(path1)) fs.unlinkSync(path1);
    }
    if (method.paymentPageImage) {
      const path2 = path.join(process.cwd(), "uploads/method-icons", method.paymentPageImage);
      if (fs.existsSync(path2)) fs.unlinkSync(path2);
    }

    res.json({ success: true, msg: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

export default router;