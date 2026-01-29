// routes/slider.js
import express from "express";
import upload from "../config/multer.js";
import Slider from "../models/Slider.js";
import fs from "fs";
import path from "path";

const router = express.Router();

// GET: Public sliders
router.get("/", async (req, res) => {
  try {
    const sliders = await Slider.find({ isActive: true }).sort({ order: 1 });
    res.json(sliders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET: Admin all sliders
router.get("/admin", async (req, res) => {
  try {
    const sliders = await Slider.find().sort({ order: 1 });
    res.json(sliders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST: Create
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Image required" });
    const newSlider = new Slider({
      ...req.body,
      image: `/uploads/method-icons/${req.file.filename}`
    });
    await newSlider.save();
    res.status(201).json(newSlider);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT: Update
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (req.file) {
      updates.image = `/uploads/method-icons/${req.file.filename}`;
      const old = await Slider.findById(id);
      if (old?.image) {
        const oldPath = path.join(process.cwd(), old.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }
    const updated = await Slider.findByIdAndUpdate(id, updates, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const slider = await Slider.findById(id);
    if (slider?.image) {
      const imagePath = path.join(process.cwd(), slider.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }
    await Slider.findByIdAndDelete(id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;