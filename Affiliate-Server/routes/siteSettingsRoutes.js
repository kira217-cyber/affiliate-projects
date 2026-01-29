// routes/siteSettings.js
import express from "express";
import SiteSettings from "../models/SiteSettings.js";
import fs from "fs";
import path from "path";
import { uploadAny } from "../config/multer.js";

const router = express.Router();

// GET - Load from DB
router.get("/", async (req, res) => {
  try {
    const settings = await SiteSettings.getSettings();
    res.json({
      title: settings.title,
      favicon: settings.favicon, // /uploads/method-icons/favicon-123456.png
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT - Save to DB + uploads/method-icons/
router.put("/", uploadAny, async (req, res) => {
  try {
    const settings = await SiteSettings.getSettings();

    // Update title
    if (req.body.title) {
      settings.title = req.body.title.trim();
    }

    // Update favicon
    if (req.files?.length > 0) {
      const file = req.files[0];
      const ext = path.extname(file.originalname).toLowerCase();
      const newFileName = `favicon${ext}`;
      const newPath = `/uploads/method-icons/${newFileName}`;
      const oldFilePath = file.path; // uploads/method-icons/method-123456.png
      const newFilePath = path.join(process.cwd(), "uploads", "method-icons", newFileName);

      // Delete old favicon
      if (settings.favicon && settings.favicon !== "/uploads/method-icons/favicon.png") {
        const oldPath = path.join(process.cwd(), "uploads", "method-icons", path.basename(settings.favicon));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      // Rename file to favicon.png / favicon.ico
      fs.renameSync(oldFilePath, newFilePath);
      settings.favicon = newPath;
    }

    await settings.save();
    res.json({ message: "Saved to database!", data: settings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Save failed" });
  }
});

// DELETE - Reset
router.delete("/", async (req, res) => {
  try {
    const settings = await SiteSettings.getSettings();
    if (settings.favicon && settings.favicon !== "/uploads/method-icons/favicon.png") {
      const oldPath = path.join(process.cwd(), "uploads", "method-icons", path.basename(settings.favicon));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    settings.title = "Rajabaji - Best Online Casino";
    settings.favicon = "/uploads/method-icons/favicon.png";
    await settings.save();
    res.json({ message: "Reset successful!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;