// routes/lastpart.js
import express from "express";
import LastPart from "../models/LastPart.js";
import { uploadAny } from "../config/multer.js";
import fs from "fs";
import path from "path";

const router = express.Router();

// GET: সব ডাটা
router.get("/", async (req, res) => {
  try {
    const data = await LastPart.findOne() || {
      titleBn: "RAJABAJI অ্যাফিলিয়েট প্রোগ্রাম",
      titleEn: "RAJABAJI Affiliate Program",
      subtitle: "আমাদের অংশ হতে আবেদন করুন",
      description: "আমরা ক্রমাগত আমাদের গ্রাহকদের কাছ থেকে ১০০% বিশ্বস্ততার সাথে বৃদ্ধি পাচ্ছি।",
      buttonText: "যোগাযোগ করুন",
      buttonLink: "/contact",
      tabletImage: "https://i.ibb.co.com/Sw9GXxg9/6810b5078bf 0cd001d0e57ca.jpg",
      mobileImage: "https://i.ibb.co.com/xth9Kzqy/phone-casino-chips-dice.jpg",
    };
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: প্রথমবার তৈরি
router.post("/", uploadAny, async (req, res) => {
  try {
    const existing = await LastPart.findOne();
    if (existing) return res.status(400).json({ message: "Already exists! Use PUT." });

    const data = {
      titleBn: req.body.titleBn,
      titleEn: req.body.titleEn,
      subtitle: req.body.subtitle,
      description: req.body.description,
      buttonText: req.body.buttonText,
      buttonLink: req.body.buttonLink,
    };

    req.files.forEach(file => {
      if (file.fieldname === "tabletImage") data.tabletImage = `/uploads/method-icons/${file.filename}`;
      if (file.fieldname === "mobileImage") data.mobileImage = `/uploads/method-icons/${file.filename}`;
    });

    const newData = new LastPart(data);
    await newData.save();
    res.json(newData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT: আপডেট
router.put("/", uploadAny, async (req, res) => {
  try {
    let lastpart = await LastPart.findOne();
    if (!lastpart) return res.status(404).json({ message: "Not found! Use POST first." });

    // টেক্সট আপডেট
    lastpart.titleBn = req.body.titleBn || lastpart.titleBn;
    lastpart.titleEn = req.body.titleEn || lastpart.titleEn;
    lastpart.subtitle = req.body.subtitle || lastpart.subtitle;
    lastpart.description = req.body.description || lastpart.description;
    lastpart.buttonText = req.body.buttonText || lastpart.buttonText;
    lastpart.buttonLink = req.body.buttonLink || lastpart.buttonLink;

    // ছবি আপডেট
    req.files.forEach(file => {
      if (file.fieldname === "tabletImage") {
        if (lastpart.tabletImage.includes("method-icons")) {
          const oldPath = path.join(process.cwd(), lastpart.tabletImage);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        lastpart.tabletImage = `/uploads/method-icons/${file.filename}`;
      }
      if (file.fieldname === "mobileImage") {
        if (lastpart.mobileImage.includes("method-icons")) {
          const oldPath = path.join(process.cwd(), lastpart.mobileImage);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        lastpart.mobileImage = `/uploads/method-icons/${file.filename}`;
      }
    });

    await lastpart.save();
    res.json(lastpart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE: সব মুছুন (রিসেট)
router.delete("/", async (req, res) => {
  try {
    const lastpart = await LastPart.findOne();
    if (lastpart) {
      [lastpart.tabletImage, lastpart.mobileImage].forEach(img => {
        if (img.includes("method-icons")) {
          const filePath = path.join(process.cwd(), img);
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
      });
      await LastPart.deleteOne({});
    }
    res.json({ message: "Deleted!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;