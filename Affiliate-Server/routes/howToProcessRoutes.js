// routes/howToProcess.js
import express from "express";
import { uploadFields } from "../config/multer.js";
import { uploadAny } from "../config/multer.js"; // এটা যোগ করুন
import HowToProcess from "../models/HowToProcess.js";
import fs from "fs";
import path from "path";

const router = express.Router();

// GET: ফ্রন্টএন্ড
router.get("/", async (req, res) => {
  try {
    let data = await HowToProcess.findOne();
    if (!data) {
      data = new HowToProcess({
        mainHeading: "কিভাবে এটা কাজ করে",
        buttonText: "আমাদের অংশীদার হয়ে উঠুন",
        steps: [
          {
            title: "আমাদের অ্যাফিলিয়েট হয়ে উঠুন",
            desc: "কয়েকটি সহজ ক্লিকের মাধ্যমে, আপনি আমাদের অ্যাফিলিয়েট পার্টনার হিসেবে নিবন্ধিত হবেন।",
            icon: "https://cdn-icons-png.flaticon.com/512/1055/1055646.png"
          },
          {
            title: "প্রচার করুন RAJABAJI",
            desc: "বন্ধুদের আমন্ত্রণ করুন এবং RAJABAJI প্রমোট করুন আপনার সোশ্যাল মিডিয়াতে।",
            icon: "https://cdn-icons-png.flaticon.com/512/1828/1828817.png"
          },
          {
            title: "উপার্জন শুরু করুন",
            desc: "আপনার আমন্ত্রণ লিঙ্কের মাধ্যমে নতুন সদস্য যোগ হলে ৫০% পর্যন্ত রাজস্ব ভাগ পান।",
            icon: "https://cdn-icons-png.flaticon.com/512/929/929473.png"
          }
        ]
      });
      await data.save();
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET: অ্যাডমিন
router.get("/admin", async (req, res) => {
  try {
    const data = await HowToProcess.findOne() || { mainHeading: "", buttonText: "", steps: [] };
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST: প্রথমবার
router.post("/", uploadFields, async (req, res) => {
  try {
    if (await HowToProcess.findOne()) {
      return res.status(400).json({ message: "Already exists. Use PUT." });
    }

    const { mainHeading, buttonText, steps } = req.body;
    const parsedSteps = JSON.parse(steps || "[]");
    const iconFiles = req.files?.icons || [];

    parsedSteps.forEach((step, i) => {
      if (iconFiles[i]) {
        step.icon = `/uploads/method-icons/${iconFiles[i].filename}`;
      }
    });

    const newData = new HowToProcess({
      mainHeading: mainHeading || "কিভাবে এটা কাজ করে",
      buttonText: buttonText || "আমাদের অংশীদার হয়ে উঠুন",
      steps: parsedSteps
    });

    await newData.save();
    res.status(201).json(newData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// PUT রাউট
router.put("/", uploadAny, async (req, res) => {  // uploadFields → uploadAny
  try {
    const { mainHeading, buttonText, steps } = req.body;
    const parsedSteps = JSON.parse(steps || "[]");
    const files = req.files || []; // সব ফাইল এখানে

    parsedSteps.forEach((step, i) => {
      // icons[0], icons[1] থেকে ফাইল খুঁজে নিন
      const file = files.find(f => f.fieldname === `icons[${i}]`);
      if (file) {
        if (step.icon && !step.icon.includes("http")) {
          const oldPath = path.join(process.cwd(), step.icon);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        step.icon = `/uploads/method-icons/${file.filename}`;
      }
    });

    const updated = await HowToProcess.findOneAndUpdate(
      {},
      { mainHeading, buttonText, steps: parsedSteps },
      { upsert: true, new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("PUT Error:", err);
    res.status(400).json({ message: err.message });
  }
});

// DELETE
router.delete("/", async (req, res) => {
  try {
    const data = await HowToProcess.findOne();
    if (data) {
      data.steps.forEach(step => {
        if (step.icon && !step.icon.includes("http")) {
          const iconPath = path.join(process.cwd(), step.icon);
          if (fs.existsSync(iconPath)) fs.unlinkSync(iconPath);
        }
      });
      await HowToProcess.deleteOne({});
    }
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;