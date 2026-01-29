// routes/withdrawPaymentMethod.routes.js
import express from "express";
import WithdrawPaymentMethod from "../models/WithdrawPaymentMethod.js";
import upload from "../config/multer.js";
import path from "path";
import fs from "fs";

const router = express.Router();

// =============================
// POST: Add New Method (Super Affiliate Only)
// =============================
router.post("/method", upload.single("methodImage"), async (req, res) => {
  try {
    const {
      methodName,
      methodNameBD,
      gateway,
      color,
      backgroundColor,
      buttonColor,
      instruction,
      instructionBD,
      status,
      userInputs,
    } = req.body;

    // বাধ্যতামূলক ফিল্ড
    if (!methodName || !methodNameBD || !gateway) {
      return res.status(400).json({ success: false, msg: "Name & Gateway required" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, msg: "Method image is required" });
    }

    // Parse gateway
    const gatewayArr = typeof gateway === "string"
      ? JSON.parse(gateway)
      : gateway.split(",").map((g) => g.trim());

    // Parse userInputs (যদি থাকে)
    let userInputsArr = [];
    if (userInputs) {
      userInputsArr = typeof userInputs === "string" ? JSON.parse(userInputs) : userInputs;
    }

    const newMethod = new WithdrawPaymentMethod({
      methodName: methodName.trim(),
      methodNameBD: methodNameBD.trim(),
      methodImage: req.file.filename,
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
      msg: "Method added successfully",
      data: {
        ...saved._doc,
        methodImage: `/uploads/method-icons/${req.file.filename}`,
      },
    });
  } catch (err) {
    console.error("Add method error:", err);
    res.status(500).json({ success: false, msg: "Server error", error: err.message });
  }
});

// =============================
// PUT: Update Method
// =============================
router.put("/method/:id", upload.single("methodImage"), async (req, res) => {
  try {
    const method = await WithdrawPaymentMethod.findById(req.params.id);
    if (!method) return res.status(404).json({ success: false, msg: "Method not found" });

    // Update normal fields
    method.methodName = req.body.methodName || method.methodName;
    method.methodNameBD = req.body.methodNameBD || method.methodNameBD;
    method.color = req.body.color || method.color;
    method.backgroundColor = req.body.backgroundColor || method.backgroundColor;
    method.buttonColor = req.body.buttonColor || method.buttonColor;
    method.instruction = req.body.instruction ?? method.instruction;
    method.instructionBD = req.body.instructionBD ?? method.instructionBD;
    method.status = req.body.status || method.status;

    // Gateway update
    if (req.body.gateway) {
      method.gateway = typeof req.body.gateway === "string"
        ? JSON.parse(req.body.gateway)
        : req.body.gateway.split(",").map((g) => g.trim());
    }

    // User inputs update
    if (req.body.userInputs) {
      method.userInputs = typeof req.body.userInputs === "string"
        ? JSON.parse(req.body.userInputs)
        : req.body.userInputs;
    }

    // New image?
    if (req.file) {
      // Delete old image
      if (method.methodImage) {
        const oldPath = path.join(process.cwd(), "uploads/method-icons", method.methodImage);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      method.methodImage = req.file.filename;
    }

    const updated = await method.save();

    res.json({
      success: true,
      msg: "Method updated",
      data: {
        ...updated._doc,
        methodImage: `/uploads/method-icons/${updated.methodImage}`,
      },
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

// =============================
// GET: All Methods
// =============================
router.get("/methods", async (req, res) => {
  try {
    const methods = await WithdrawPaymentMethod.find().sort({ createdAt: -1 });
    const formatted = methods.map((m) => ({
      ...m._doc,
      methodImage: `/uploads/method-icons/${m.methodImage}`,
    }));
    res.json({ success: true, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

// =============================
// GET: Single Method
// =============================
router.get("/method/:id", async (req, res) => {
  try {
    const method = await WithdrawPaymentMethod.findById(req.params.id);
    if (!method) return res.status(404).json({ success: false, msg: "Not found" });

    res.json({
      success: true,
      data: {
        ...method._doc,
        methodImage: `/uploads/method-icons/${method.methodImage}`,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

// =============================
// DELETE: Delete Method
// =============================
router.delete("/method/:id", async (req, res) => {
  try {
    const method = await WithdrawPaymentMethod.findByIdAndDelete(req.params.id);
    if (!method) return res.status(404).json({ success: false, msg: "Not found" });

    // Delete image file
    if (method.methodImage) {
      const filePath = path.join(process.cwd(), "uploads/method-icons", method.methodImage);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    res.json({ success: true, msg: "Method deleted" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

export default router;