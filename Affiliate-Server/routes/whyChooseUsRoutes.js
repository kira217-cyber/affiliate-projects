// routes/whyChooseUs.js
import express from "express";
import { uploadAny } from "../config/multer.js"; // Use uploadAny
import WhyChooseUs from "../models/WhyChooseUs.js";
import fs from "fs";
import path from "path";

const router = express.Router();

const uploadDir = "uploads/method-icons";

// GET: Frontend
router.get("/", async (req, res) => {
  try {
    let data = await WhyChooseUs.findOne();
    if (!data) {
      data = new WhyChooseUs({
        backgroundImage: "/uploads/method-icons/default-bg.jpg",
        heading: "কেন আমাদের?",
        subheading:
          "RAJABAJI সেরা অধিভুক্ত সহযোগিতা এবং সুবিশেষ গ্যারান্টি দেয়!",
        features: [],
      });
      await data.save();
    }
    res.json(data);
  } catch (err) {
    console.error("GET Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET: Admin
router.get("/admin", async (req, res) => {
  try {
    const data = (await WhyChooseUs.findOne()) || {
      heading: "কেন আমাদের?",
      subheading: "",
      backgroundImage: "",
      features: [],
    };
    res.json(data);
  } catch (err) {
    console.error("Admin GET Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST: First time
router.post("/", uploadAny, async (req, res) => {
  try {
    if (await WhyChooseUs.findOne()) {
      return res.status(400).json({ message: "Already exists. Use PUT." });
    }

    const { heading, subheading, features } = req.body;
    const parsedFeatures = JSON.parse(features || "[]");

    // Background Image
    const bgFile = req.files.find((f) => f.fieldname === "backgroundImage");
    const backgroundImage = bgFile
      ? `/uploads/method-icons/${bgFile.filename}`
      : "/uploads/method-icons/default-bg.jpg";

    // Icons with index
    const iconFiles = [];
    req.files.forEach((file) => {
      const match = file.fieldname.match(/^icons\[(\d+)\]$/);
      if (match) {
        const index = parseInt(match[1]);
        iconFiles[index] = file;
      }
    });

    parsedFeatures.forEach((f, i) => {
      f.icon = iconFiles[i]
        ? `/uploads/method-icons/${iconFiles[i].filename}`
        : "";
    });

    const newData = new WhyChooseUs({
      backgroundImage,
      heading: heading || "কেন আমাদের?",
      subheading: subheading || "",
      features: parsedFeatures,
    });

    await newData.save();
    res.status(201).json(newData);
  } catch (err) {
    console.error("POST Error:", err);
    res.status(400).json({ message: err.message });
  }
});

// PUT: Update
router.put("/", uploadAny, async (req, res) => {
  try {
    const { heading, subheading, features } = req.body;
    const parsedFeatures = JSON.parse(features || "[]");

    // Background Image
    const bgFile = req.files.find((f) => f.fieldname === "backgroundImage");
    let backgroundImage = undefined;
    if (bgFile) {
      backgroundImage = `/uploads/method-icons/${bgFile.filename}`;
    }

    // Icons with index
    const iconFiles = [];
    req.files.forEach((file) => {
      const match = file.fieldname.match(/^icons\[(\d+)\]$/);
      if (match) {
        const index = parseInt(match[1]);
        iconFiles[index] = file;
      }
    });

    const oldData = await WhyChooseUs.findOne();

    // Update features
    parsedFeatures.forEach((feat, i) => {
      if (iconFiles[i]) {
        feat.icon = `/uploads/method-icons/${iconFiles[i].filename}`;
      } else {
        const oldFeature = oldData?.features.find(
          (f) => f._id?.toString() === feat._id
        );
        feat.icon = oldFeature?.icon || "";
      }
    });

    const updateData = {
      heading: heading || "কেন আমাদের?",
      subheading: subheading || "",
      features: parsedFeatures,
    };

    if (backgroundImage) {
      updateData.backgroundImage = backgroundImage;
      if (oldData?.backgroundImage) {
        const oldPath = path.join(process.cwd(), oldData.backgroundImage);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    const data = await WhyChooseUs.findOneAndUpdate({}, updateData, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });

    res.json(data);
  } catch (err) {
    console.error("PUT Error:", err);
    res.status(400).json({ message: err.message });
  }
});

// DELETE
router.delete("/", async (req, res) => {
  try {
    const data = await WhyChooseUs.findOne();
    if (data) {
      if (data.backgroundImage) {
        const bgPath = path.join(process.cwd(), data.backgroundImage);
        if (fs.existsSync(bgPath)) fs.unlinkSync(bgPath);
      }
      data.features.forEach((feat) => {
        if (feat.icon) {
          const iconPath = path.join(process.cwd(), feat.icon);
          if (fs.existsSync(iconPath)) fs.unlinkSync(iconPath);
        }
      });
      await WhyChooseUs.deleteOne({});
    }
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE Error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
