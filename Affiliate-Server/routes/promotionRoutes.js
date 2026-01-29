// routes/promotion.js
import express from "express";
import Promotion from "../models/Promotion.js";
import { uploadAny } from "../config/multer.js"; // ← আপনার uploadAny ঠিক এভাবেই
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// __dirname এর বিকল্প (ES6 module এ __dirname থাকে না)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// প্রমোশনের জন্য আলাদা ফোল্ডার
const promoDir = path.join(__dirname, "..", "uploads", "method-icons");
if (!fs.existsSync(promoDir)) {
  fs.mkdirSync(promoDir, { recursive: true });
}

const router = express.Router();

// GET all active promotions
router.get("/", async (req, res) => {
  try {
    const promotions = await Promotion.find({ isActive: true }).sort({
      createdAt: -1,
    });

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const formatted = promotions.map((p) => ({
      ...p.toObject(),
      image: `${baseUrl}/uploads/method-icons/${path.basename(p.image)}`,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("GET /api/promotions error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// GET single promotion by ID (for PromotionDetails page)
router.get("/:id", async (req, res) => {
  try {
    const promo = await Promotion.findById(req.params.id);
    if (!promo || !promo.isActive) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const formatted = {
      ...promo.toObject(),
      image: `${baseUrl}/uploads/method-icons/${path.basename(promo.image)}`,
    };

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// CREATE Promotion
router.post("/", uploadAny, async (req, res) => {
  try {
    const imageFile = req.files?.find((f) => f.fieldname === "image");
    if (!imageFile) {
      return res.status(400).json({ message: "Image is required!" });
    }

    // ফাইলকে method-icons থেকে promotions ফোল্ডারে মুভ
    const oldPath = imageFile.path;
    const ext = path.extname(imageFile.originalname);
    const newFilename = `promo-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${ext}`;
    const newPath = path.join(promoDir, newFilename);

    fs.renameSync(oldPath, newPath);

    const newPromo = new Promotion({
      image: `/uploads/method-icons/${newFilename}`,
      title_en: req.body.title_en,
      title_bn: req.body.title_bn,
      description_en: req.body.description_en,
      description_bn: req.body.description_bn,
      category: req.body.category || "All",
      footer_en: req.body.footer_en || "",
      footer_bn: req.body.footer_bn || "",
    });

    await newPromo.save();
    res.status(201).json(newPromo);
  } catch (err) {
    console.error("POST /api/promotions error:", err);
    res
      .status(400)
      .json({ message: err.message || "Failed to create promotion" });
  }
});

// UPDATE Promotion
router.put("/:id", uploadAny, async (req, res) => {
  try {
    const updateData = { ...req.body };
    const imageFile = req.files?.find((f) => f.fieldname === "image");

    if (imageFile) {
      // পুরানো ছবি ডিলিট
      const oldPromo = await Promotion.findById(req.params.id);
      if (oldPromo?.image) {
        const oldFullPath = path.join(__dirname, "..", oldPromo.image);
        if (fs.existsSync(oldFullPath)) fs.unlinkSync(oldFullPath);
      }

      // নতুন ছবি মুভ
      const ext = path.extname(imageFile.originalname);
      const newFilename = `promo-${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${ext}`;
      const newPath = path.join(promoDir, newFilename);
      fs.renameSync(imageFile.path, newPath);

      updateData.image = `/uploads/method-icons/${newFilename}`;
    }

    const updated = await Promotion.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
      }
    );
    res.json(updated);
  } catch (err) {
    console.error("PUT /api/promotions error:", err);
    res.status(400).json({ message: err.message || "Failed to update" });
  }
});

// DELETE Promotion
router.delete("/:id", async (req, res) => {
  try {
    const promo = await Promotion.findById(req.params.id);
    if (!promo) return res.status(404).json({ message: "Promotion not found" });

    // ছবি ডিলিট
    if (promo.image) {
      const imgPath = path.join(__dirname, "..", promo.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await Promotion.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: "Promotion deleted successfully" });
  } catch (err) {
    console.error("DELETE /api/promotions error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
