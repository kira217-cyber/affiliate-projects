// routes/tricker.js
import express from "express";
import Tricker from "../models/Tricker.js";
import { uploadAny } from "../config/multer.js";
import fs from "fs";
import path from "path";

const router = express.Router();

// GET: সব ছবি দেখান
router.get("/", async (req, res) => {
  try {
    const data = await Tricker.findOne();
    res.json(data || { images: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: প্রথমবার তৈরি (যদি না থাকে)
router.post("/", uploadAny, async (req, res) => {
  try {
    const existing = await Tricker.findOne();
    if (existing) {
      return res.status(400).json({ message: "Already exists! Use PUT to update." });
    }

    const images = req.files.map((file) => ({
      url: `/uploads/method-icons/${file.filename}`,
      alt: file.originalname,
    }));

    const newTricker = new Tricker({ images });
    await newTricker.save();
    res.json(newTricker);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT: নতুন ছবি যোগ করুন
router.put("/", uploadAny, async (req, res) => {
  try {
    let tricker = await Tricker.findOne();
    if (!tricker) {
      return res.status(404).json({ message: "No data! Use POST first." });
    }

    if (req.files.length > 0) {
      const newImages = req.files.map((file) => ({
        url: `/uploads/method-icons/${file.filename}`,
        alt: file.originalname,
      }));
      tricker.images.push(...newImages);
      await tricker.save();
    }

    res.json(tricker);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE: একটা ছবি মুছুন (by index)
router.delete("/:index", async (req, res) => {
  try {
    const tricker = await Tricker.findOne();
    if (!tricker) return res.status(404).json({ message: "No data" });

    const index = parseInt(req.params.index);
    if (index < 0 || index >= tricker.images.length) {
      return res.status(400).json({ message: "Invalid index" });
    }

    const removed = tricker.images.splice(index, 1)[0];
    const filePath = path.join(process.cwd(), "uploads", "method-icons", path.basename(removed.url));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await tricker.save();
    res.json({ message: "Deleted", removed });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE: সব মুছুন
router.delete("/", async (req, res) => {
  try {
    const tricker = await Tricker.findOne();
    if (!tricker) return res.status(404).json({ message: "No data" });

    tricker.images.forEach((img) => {
      const filePath = path.join(process.cwd(), "uploads", "method-icons", path.basename(img.url));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    await Tricker.deleteOne({});
    res.json({ message: "All deleted!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;