// routes/navbar.js
import express from "express";
import upload from "../config/multer.js";
import Navbar from "../models/Navbar.js";
import fs from "fs";
import path from "path";

const router = express.Router();

// GET: Navbar ডেটা (ফ্রন্টএন্ড)
router.get("/", async (req, res) => {
  try {
    let navbar = await Navbar.findOne();
    if (!navbar) {
      // প্রথমবার ডিফল্ট ডেটা তৈরি করুন
      navbar = new Navbar({
        logo: "/uploads/navbar/default-logo.png", // আপনার ডিফল্ট লোগো
        links: [
          { name: "কেন আমাদের?", sectionId: "why-us" },
          { name: "কিভাবে এটা কাজ করে", sectionId: "how-it-works" },
          { name: "কমিশন পরিকাঠামো", sectionId: "commission" },
          { name: "যোগাযোগ করুন", sectionId: "contact" }
        ],
        registerButton: {
          text: "সদস্য সাইন ইন",
          link: "/register",
          bgColor: "#99FF47",
          textColor: "#000000"
        },
        loginButton: {
          text: "এখন আবেদন করুন!",
          link: "/login",
          bgColor: "#ffffff",
          textColor: "#000000",
          arrow: ">"
        }
      });
      await navbar.save();
    }
    res.json(navbar);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET: অ্যাডমিনের জন্য (এডিট ফর্মে লোড)
router.get("/admin", async (req, res) => {
  try {
    const navbar = await Navbar.findOne();
    res.json(navbar || {});
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST: নতুন Navbar তৈরি (যদি কোনো না থাকে)
router.post("/", upload.single("logo"), async (req, res) => {
  try {
    const existing = await Navbar.findOne();
    if (existing) {
      return res.status(400).json({ message: "Navbar already exists. Use PUT to update." });
    }

    const data = req.body;
    if (req.file) data.logo = `/uploads/navbar/${req.file.filename}`;

    const navbar = new Navbar(data);
    await navbar.save();
    res.status(201).json(navbar);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT: আপডেট (এটাই মূলত ব্যবহার হবে)
router.put("/", upload.single("logo"), async (req, res) => {
  try {
    const updates = req.body;

    // ছবি আপলোড হলে
    if (req.file) {
      updates.logo = `/uploads/method-icons/${req.file.filename}`;

      // পুরানো ছবি মুছে ফেলুন
      const old = await Navbar.findOne();
      if (old?.logo && old.logo !== updates.logo) {
        const oldPath = path.join(process.cwd(), old.logo);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    // JSON ফিল্ডগুলো পার্স করুন
    if (updates.links) updates.links = JSON.parse(updates.links);
    if (updates.registerButton) updates.registerButton = JSON.parse(updates.registerButton);
    if (updates.loginButton) updates.loginButton = JSON.parse(updates.loginButton);

    const navbar = await Navbar.findOneAndUpdate(
      {},
      updates,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json(navbar);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE: Navbar মুছে ফেলুন (সবকিছু রিসেট)
router.delete("/", async (req, res) => {
  try {
    const navbar = await Navbar.findOne();
    if (navbar?.logo) {
      const logoPath = path.join(process.cwd(), navbar.logo);
      if (fs.existsSync(logoPath)) fs.unlinkSync(logoPath);
    }
    await Navbar.deleteOne({});
    res.json({ message: "Navbar deleted. Default will be created on next GET." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;