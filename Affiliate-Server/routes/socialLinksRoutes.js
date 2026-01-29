import express from "express";
import SocialLink from "../models/SocialLinks.js";
import { uploadAny } from "../config/multer.js";
import path from "path";
import fs from "fs";

const router = express.Router();
const uploadDir = "uploads/method-icons";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// GET all links
router.get("/", async (req, res) => {
  try {
    const links = await SocialLink.find().sort({ _id: 1 });
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const formatted = links.map(l => ({
      ...l.toObject(),
      icon: `${baseUrl}/uploads/method-icons/${path.basename(l.icon)}`,
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE
router.post("/", uploadAny, async (req, res) => {
  const file = req.files?.find(f => f.fieldname === "icon");
  if (!file) return res.status(400).json({ message: "Icon required" });

  const ext = path.extname(file.originalname);
  const filename = `icon-${Date.now()}${ext}`;
  const filepath = path.join(uploadDir, filename);
  fs.renameSync(file.path, filepath);

  const newLink = new SocialLink({
    name: req.body.name,
    url: req.body.url,
    icon: `/uploads/method-icons/${filename}`,
  });

  await newLink.save();
  res.status(201).json(newLink);
});

// UPDATE
router.put("/:id", uploadAny, async (req, res) => {
  const link = await SocialLink.findById(req.params.id);
  const file = req.files?.find(f => f.fieldname === "icon");

  if (file) {
    // Delete old icon
    if (link.icon) {
      const oldPath = path.join("uploads", "method-icons", path.basename(link.icon));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    const ext = path.extname(file.originalname);
    const filename = `icon-${Date.now()}${ext}`;
    const filepath = path.join(uploadDir, filename);
    fs.renameSync(file.path, filepath);
    link.icon = `/uploads/method-icons/${filename}`;
  }

  link.name = req.body.name || link.name;
  link.url = req.body.url || link.url;

  await link.save();
  res.json(link);
});

// DELETE
router.delete("/:id", async (req, res) => {
  const link = await SocialLink.findById(req.params.id);
  if (link.icon) {
    const iconPath = path.join("uploads", "social-icons", path.basename(link.icon));
    if (fs.existsSync(iconPath)) fs.unlinkSync(iconPath);
  }
  await link.deleteOne();
  res.json({ message: "Deleted" });
});

export default router;