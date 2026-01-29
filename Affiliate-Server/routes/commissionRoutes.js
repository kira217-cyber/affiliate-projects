// routes/commission.js
import express from "express";
import { uploadAny } from "../config/multer.js";
import Commission from "../models/Commission.js";
import fs from "fs";
import path from "path";

const router = express.Router();

// GET: ফ্রন্টএন্ডে দেখানোর জন্য (পাবলিক)
router.get("/", async (req, res) => {
  try {
    let data = await Commission.findOne();
    if (!data) {
      data = new Commission(); // ডিফল্ট ডাটা
      await data.save();
    }
    res.json(data);
  } catch (err) {
    console.error("GET Error:", err);
    res.status(500).json({ message: "সার্ভারে সমস্যা হয়েছে" });
  }
});

// GET: অ্যাডমিন প্যানেলে দেখানোর জন্য
router.get("/admin", async (req, res) => {
  try {
    const data = await Commission.findOne() || new Commission();
    res.json(data);
  } catch (err) {
    console.error("GET Admin Error:", err);
    res.status(500).json({ message: "সার্ভারে সমস্যা" });
  }
});

// POST: প্রথমবার তৈরি করা (যদি ডাটাবেস খালি থাকে)
router.post("/", uploadAny, async (req, res) => {
  try {
    // যদি আগে থেকে থাকে, তাহলে ব্লক করুন
    if (await Commission.findOne()) {
      return res.status(400).json({ message: "ইতিমধ্যে ডাটা আছে! PUT ব্যবহার করুন।" });
    }

    const { tableData, calcItems, ...rest } = req.body;
    const files = req.files || [];

    const parsedTable = tableData ? JSON.parse(tableData) : [];
    const parsedCalcItems = calcItems ? JSON.parse(calcItems) : [];

    // লেফট ইমেজ
    const leftImageFile = files.find(f => f.fieldname === "leftImage");
    if (leftImageFile) {
      rest.leftImage = `/uploads/method-icons/${leftImageFile.filename}`;
    }

    // ক্যালক আইকন
    parsedCalcItems.forEach((item, i) => {
      const file = files.find(f => f.fieldname === `calcIcon[${i}]`);
      if (file) {
        item.icon = `/uploads/method-icons/${file.filename}`;
      }
    });

    const newData = new Commission({
      ...rest,
      tableData: parsedTable,
      calcItems: parsedCalcItems
    });

    await newData.save();
    res.status(201).json({ message: "সফলভাবে তৈরি হয়েছে!", data: newData });
  } catch (err) {
    console.error("POST Error:", err);
    res.status(400).json({ message: err.message || "ডাটা তৈরি করা যায়নি" });
  }
});

// PUT: আপডেট করা (মূল কাজ – পুরানো ফাইল মুছে ফেলে)
router.put("/", uploadAny, async (req, res) => {
  try {
    const oldData = await Commission.findOne();
    const { tableData, calcItems, ...rest } = req.body;
    const files = req.files || [];

    const parsedTable = tableData ? JSON.parse(tableData) : [];
    const parsedCalcItems = calcItems ? JSON.parse(calcItems) : [];

    // পুরানো লেফট ইমেজ মুছুন
    const leftImageFile = files.find(f => f.fieldname === "leftImage");
    if (leftImageFile) {
      if (oldData?.leftImage && !oldData.leftImage.includes("http")) {
        const oldPath = path.join(process.cwd(), "uploads", "method-icons", path.basename(oldData.leftImage));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      rest.leftImage = `/uploads/method-icons/${leftImageFile.filename}`;
    }

    // পুরানো ক্যালক আইকন মুছুন
    parsedCalcItems.forEach((item, i) => {
      const file = files.find(f => f.fieldname === `calcIcon[${i}]`);
      if (file) {
        if (oldData?.calcItems[i]?.icon && !oldData.calcItems[i].icon.includes("http")) {
          const oldPath = path.join(process.cwd(), "uploads", "method-icons", path.basename(oldData.calcItems[i].icon));
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        item.icon = `/uploads/method-icons/${file.filename}`;
      }
    });

    const updated = await Commission.findOneAndUpdate(
      {},
      { ...rest, tableData: parsedTable, calcItems: parsedCalcItems },
      { upsert: true, new: true }
    );

    res.json({ message: "সফলভাবে আপডেট হয়েছে!", data: updated });
  } catch (err) {
    console.error("PUT Error:", err);
    res.status(400).json({ message: err.message || "আপডেট করা যায়নি" });
  }
});

// DELETE: পুরো কমিশন সেকশন মুছে ফেলা (ফাইল সহ)
router.delete("/", async (req, res) => {
  try {
    const data = await Commission.findOne();
    if (!data) {
      return res.status(404).json({ message: "কোনো ডাটা পাওয়া যায়নি" });
    }

    // লেফট ইমেজ মুছুন
    if (data.leftImage && !data.leftImage.includes("http")) {
      const leftPath = path.join(process.cwd(), "uploads", "method-icons", path.basename(data.leftImage));
      if (fs.existsSync(leftPath)) fs.unlinkSync(leftPath);
    }

    // ক্যালক আইকন মুছুন
    data.calcItems.forEach(item => {
      if (item.icon && !item.icon.includes("http")) {
        const iconPath = path.join(process.cwd(), "uploads", "method-icons", path.basename(item.icon));
        if (fs.existsSync(iconPath)) fs.unlinkSync(iconPath);
      }
    });

    await Commission.deleteOne({});
    res.json({ message: "সফলভাবে মুছে ফেলা হয়েছে!" });
  } catch (err) {
    console.error("DELETE Error:", err);
    res.status(500).json({ message: "মুছে ফেলা যায়নি" });
  }
});

export default router;