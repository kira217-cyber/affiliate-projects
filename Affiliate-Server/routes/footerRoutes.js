// routes/footer.js
import express from "express";
import Footer from "../models/Footer.js";
import { uploadAny } from "../config/multer.js";
import fs from "fs";
import path from "path";

const router = express.Router();

// GET: সব ডাটা (ডিফল্ট যদি না থাকে)
router.get("/", async (req, res) => {
  try {
    let footer = await Footer.findOne();

    if (!footer) {
      footer = {
        logo: "https://i.ibb.co.com/Q7Cms1cc/Footer-Logo.png",
        tagline: "Rajabaji Trusted Casino – Best Online Cricket Betting App",
        paymentMethods: [
          { name: "bKash", image: "https://i.ibb.co.com/x8S78ZCf/300px-BKash.png" },
          { name: "Nagad", image: "https://i.ibb.co.com/M5SfXszD/image-42525-1643965434.png" },
          { name: "Rocket", image: "https://i.ibb.co.com/TMww2j2s/5932889762496fc0e8aacd507f50aba0.png" },
        ],
        socialLinks: [
          { platform: "facebook", url: "https://facebook.com" },
          { platform: "instagram", url: "https://instagram.com" },
          { platform: "youtube", url: "https://youtube.com" },
          { platform: "twitter", url: "https://twitter.com" },
        ],
        copyright: "Copyright © 2025 Rajabaji. All Rights Reserved.",
      };
    }

    res.json(footer);
  } catch (err) {
    console.error("GET Footer Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// POST: প্রথমবার তৈরি করুন
router.post("/", uploadAny, async (req, res) => {
  try {
    const existing = await Footer.findOne();
    if (existing) {
      return res.status(400).json({ message: "Footer already exists! Use PUT to update." });
    }

    const data = {
      tagline: req.body.tagline || "Rajabaji Trusted Casino – Best Online Cricket Betting App",
      copyright: req.body.copyright || "Copyright © 2025 Rajabaji. All Rights Reserved.",
      paymentMethods: req.body.paymentMethods ? JSON.parse(req.body.paymentMethods) : [
        { name: "bKash" },
        { name: "Nagad" },
        { name: "Rocket" },
      ],
      socialLinks: req.body.socialLinks ? JSON.parse(req.body.socialLinks) : [
        { platform: "facebook", url: "#" },
        { platform: "instagram", url: "#" },
        { platform: "youtube", url: "#" },
        { platform: "twitter", url: "#" },
      ],
    };

    // ছবি সেভ
    req.files?.forEach(file => {
      if (file.fieldname === "logo") {
        data.logo = `/uploads/method-icons/${file.filename}`;
      }
      if (file.fieldname.startsWith("payment_")) {
        const index = parseInt(file.fieldname.split("_")[1]);
        if (data.paymentMethods[index]) {
          data.paymentMethods[index].image = `/uploads/method-icons/${file.filename}`;
        }
      }
    });

    const newFooter = new Footer(data);
    await newFooter.save();

    res.status(201).json({ message: "Footer Created!", data: newFooter });
  } catch (err) {
    console.error("POST Footer Error:", err);
    res.status(500).json({ message: "Failed to create footer" });
  }
});

// PUT: আপডেট করুন
router.put("/", uploadAny, async (req, res) => {
  try {
    let footer = await Footer.findOne();
    if (!footer) {
      return res.status(404).json({ message: "Footer not found! Use POST first." });
    }

    // টেক্সট আপডেট
    footer.tagline = req.body.tagline || footer.tagline;
    footer.copyright = req.body.copyright || footer.copyright;
    footer.paymentMethods = req.body.paymentMethods
      ? JSON.parse(req.body.paymentMethods)
      : footer.paymentMethods;
    footer.socialLinks = req.body.socialLinks
      ? JSON.parse(req.body.socialLinks)
      : footer.socialLinks;

    // ছবি আপডেট + পুরানো মুছুন
    req.files?.forEach(file => {
      if (file.fieldname === "logo") {
        // পুরানো লোগো মুছুন
        if (footer.logo && footer.logo.includes("method-icons")) {
          const oldPath = path.join(process.cwd(), footer.logo);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        footer.logo = `/uploads/method-icons/${file.filename}`;
      }

      if (file.fieldname.startsWith("payment_")) {
        const index = parseInt(file.fieldname.split("_")[1]);
        if (footer.paymentMethods[index]) {
          // পুরানো পেমেন্ট ছবি মুছুন
          if (footer.paymentMethods[index].image?.includes("method-icons")) {
            const oldPath = path.join(process.cwd(), footer.paymentMethods[index].image);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
          }
          footer.paymentMethods[index].image = `/uploads/method-icons/${file.filename}`;
        }
      }
    });

    await footer.save();
    res.json({ message: "Footer Updated!", data: footer });
  } catch (err) {
    console.error("PUT Footer Error:", err);
    res.status(500).json({ message: "Failed to update footer" });
  }
});

// DELETE: সব মুছে ফেলুন + ফাইল মুছুন
router.delete("/", async (req, res) => {
  try {
    const footer = await Footer.findOne();
    if (!footer) {
      return res.status(404).json({ message: "Footer not found!" });
    }

    // সব ছবি মুছুন
    if (footer.logo?.includes("method-icons")) {
      const logoPath = path.join(process.cwd(), footer.logo);
      if (fs.existsSync(logoPath)) fs.unlinkSync(logoPath);
    }

    footer.paymentMethods.forEach(method => {
      if (method.image?.includes("method-icons")) {
        const imgPath = path.join(process.cwd(), method.image);
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      }
    });

    await Footer.deleteOne({});
    res.json({ message: "Footer Deleted Successfully!" });
  } catch (err) {
    console.error("DELETE Footer Error:", err);
    res.status(500).json({ message: "Failed to delete footer" });
  }
});

export default router;