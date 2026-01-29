// routes/partner.js
import express from "express";
import { uploadAny } from "../config/multer.js";
import Partner from "../models/Partner.js";
import fs from "fs";
import path from "path";

const router = express.Router();

// GET: ফ্রন্টএন্ডে দেখানোর জন্য
router.get("/", async (req, res) => {
  try {
    let data = await Partner.findOne();
    if (!data) {
      data = new Partner();
      await data.save();
    }
    res.json(data);
  } catch (err) {
    console.error("GET Error:", err);
    res.status(500).json({ message: "সার্ভারে সমস্যা হয়েছে" });
  }
});

// GET: অ্যাডমিন প্যানেলে দেখানোর জন্য
router.get("/admin", async (req, res) => {
  try {
    const data = await Partner.findOne() || new Partner();
    res.json(data);
  } catch (err) {
    console.error("GET Admin Error:", err);
    res.status(500).json({ message: "ডাটা লোড হয়নি" });
  }
});

// POST: প্রথমবার তৈরি করা (যদি না থাকে)
router.post("/", uploadAny, async (req, res) => {
  try {
    // যদি আগে থেকে থাকে → ব্লক করুন
    if (await Partner.findOne()) {
      return res.status(400).json({ message: "ইতিমধ্যে Partner ডাটা আছে! PUT ব্যবহার করুন।" });
    }

    const { titleBn, titleEn, description, highlightText, buttonText } = req.body;
    const files = req.files || [];

    let leftImage = "";
    let bgImage = "";

    const leftFile = files.find(f => f.fieldname === "leftImage");
    const bgFile = files.find(f => f.fieldname === "bgImage");

    if (leftFile) leftImage = `/uploads/method-icons/${leftFile.filename}`;
    if (bgFile) bgImage = `/uploads/method-icons/${bgFile.filename}`;

    const newPartner = new Partner({
      titleBn: titleBn || "বিশেষ অংশীদার",
      titleEn: titleEn || "Special Partner",
      description: description || "এখনই নিবন্ধন করুন এবং ৫০% পর্যন্ত রাজস্ব ভাগ সহ উপার্জন শুরু করুন!",
      highlightText: highlightText || "৫০% পর্যন্ত রাজস্ব ভাগ",
      buttonText: buttonText || "আমাদের অংশীদার হোন",
      leftImage,
      bgImage
    });

    await newPartner.save();
    res.status(201).json({ message: "সফলভাবে তৈরি হয়েছে!", data: newPartner });
  } catch (err) {
    console.error("POST Error:", err);
    res.status(400).json({ message: err.message || "তৈরি করা যায়নি" });
  }
});

// PUT: আপডেট করা (পুরানো ফাইল মুছে ফেলে)
router.put("/", uploadAny, async (req, res) => {
  try {
    const old = await Partner.findOne();
    if (!old) {
      return res.status(404).json({ message: "কোনো ডাটা পাওয়া যায়নি! POST করুন।" });
    }

    const { titleBn, titleEn, description, highlightText, buttonText } = req.body;
    const files = req.files || [];

    let leftImage = old.leftImage;
    let bgImage = old.bgImage;

    const leftFile = files.find(f => f.fieldname === "leftImage");
    const bgFile = files.find(f => f.fieldname === "bgImage");

    // পুরানো লেফট ইমেজ মুছুন
    if (leftFile) {
      if (old.leftImage && !old.leftImage.includes("http")) {
        const oldPath = path.join(process.cwd(), "uploads", "partner", path.basename(old.leftImage));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      leftImage = `/uploads/method-icons/${leftFile.filename}`;
    }

    // পুরানো ব্যাকগ্রাউন্ড মুছুন
    if (bgFile) {
      if (old.bgImage && !old.bgImage.includes("http")) {
        const oldPath = path.join(process.cwd(), "uploads", "partner", path.basename(old.bgImage));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      bgImage = `/uploads/method-icons/${bgFile.filename}`;
    }

    const updated = await Partner.findOneAndUpdate(
      {},
      {
        titleBn: titleBn || old.titleBn,
        titleEn: titleEn || old.titleEn,
        description: description || old.description,
        highlightText: highlightText || old.highlightText,
        buttonText: buttonText || old.buttonText,
        leftImage,
        bgImage
      },
      { new: true }
    );

    res.json({ message: "সফলভাবে আপডেট হয়েছে!", data: updated });
  } catch (err) {
    console.error("PUT Error:", err);
    res.status(400).json({ message: err.message || "আপডেট করা যায়নি" });
  }
});

// DELETE: পুরো Partner সেকশন মুছে ফেলা (ফাইল সহ)
router.delete("/", async (req, res) => {
  try {
    const data = await Partner.findOne();
    if (!data) {
      return res.status(404).json({ message: "কোনো Partner ডাটা পাওয়া যায়নি" });
    }

    // লেফট ইমেজ মুছুন
    if (data.leftImage && !data.leftImage.includes("http")) {
      const leftPath = path.join(process.cwd(), "uploads", "partner", path.basename(data.leftImage));
      if (fs.existsSync(leftPath)) fs.unlinkSync(leftPath);
    }

    // ব্যাকগ্রাউন্ড ইমেজ মুছুন
    if (data.bgImage && !data.bgImage.includes("http")) {
      const bgPath = path.join(process.cwd(), "uploads", "partner", path.basename(data.bgImage));
      if (fs.existsSync(bgPath)) fs.unlinkSync(bgPath);
    }

    await Partner.deleteOne({});
    res.json({ message: "সফলভাবে মুছে ফেলা হয়েছে! এখন POST করে নতুন তৈরি করুন।" });
  } catch (err) {
    console.error("DELETE Error:", err);
    res.status(500).json({ message: "মুছে ফেলা যায়নি" });
  }
});

export default router;