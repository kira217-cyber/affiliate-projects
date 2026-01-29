import express from "express";
import Category from "../models/Category.js";
import { uploadAny } from "../config/multer.js";
import fs from "fs";
import path from "path";

const router = express.Router();

// GET all
router.get("/", async (req, res) => {
  try {
    const cats = await Category.find().sort({ createdAt: -1 });
    res.json({ success: true, data: cats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST - Add
router.post("/add", uploadAny, async (req, res) => {
  try {
    const { categoryName, providerId } = req.body;
    const files = req.files;

    const mainImage = files.find(f => f.fieldname === "mainImage");
    const iconImage = files.find(f => f.fieldname === "iconImage");

    if (!mainImage || !iconImage) return res.status(400).json({ success: false, message: "Both images required" });

    const newCat = new Category({
      categoryName,
      providerId,
      mainImage: `/uploads/method-icons/${mainImage.filename}`,
      iconImage: `/uploads/method-icons/${iconImage.filename}`,
    });

    await newCat.save();
    res.status(201).json({ success: true, data: newCat });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ success: false, message: "Category name already exists" });
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT - Update
router.put("/:id", uploadAny, async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ success: false, message: "Not found" });

    const { categoryName, providerId } = req.body;
    const files = req.files;

    const updates = { categoryName, providerId };

    if (files.find(f => f.fieldname === "mainImage")) {
      if (cat.mainImage) fs.unlinkSync(path.join("uploads/method-icons", path.basename(cat.mainImage)));
      updates.mainImage = `/uploads/method-icons/${files.find(f => f.fieldname === "mainImage").filename}`;
    }
    if (files.find(f => f.fieldname === "iconImage")) {
      if (cat.iconImage) fs.unlinkSync(path.join("uploads/method-icons", path.basename(cat.iconImage)));
      updates.iconImage = `/uploads/method-icons/${files.find(f => f.fieldname === "iconImage").filename}`;
    }

    const updated = await Category.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (cat) {
      if (cat.mainImage) fs.unlinkSync(path.join("uploads/method-icons", path.basename(cat.mainImage)));
      if (cat.iconImage) fs.unlinkSync(path.join("uploads/method-icons", path.basename(cat.iconImage)));
      await cat.deleteOne();
    }
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;