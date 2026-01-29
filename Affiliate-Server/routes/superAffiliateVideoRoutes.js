// routes/superAffiliateVideo.js
import express from "express";
import SuperAffiliateVideo from "../models/SuperAffiliateVideo.js";

const router = express.Router();

// GET - Load all videos
router.get("/", async (req, res) => {
  try {
    let data = await SuperAffiliateVideo.findOne();
    if (!data) {
      data = await SuperAffiliateVideo.create({ videos: [] });
    }
    res.json(data.videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - Add new video URL
router.post("/", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || !url.includes("http")) {
      return res.status(400).json({ message: "Valid URL required!" });
    }

    let data = await SuperAffiliateVideo.findOne();
    if (!data) data = await SuperAffiliateVideo.create({ videos: [] });

    data.videos.push({ url: url.trim() });
    await data.save();

    res.json({ message: "Video URL added!", videos: data.videos });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT - Update video URL by index
router.put("/:index", async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    const { url } = req.body;
    if (!url || !url.includes("http")) {
      return res.status(400).json({ message: "Valid URL required!" });
    }

    const data = await SuperAffiliateVideo.findOne();
    if (!data || index >= data.videos.length) {
      return res.status(404).json({ message: "Video not found" });
    }

    data.videos[index].url = url.trim();
    await data.save();

    res.json({ message: "Video URL updated!", videos: data.videos });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE - Delete video by index
router.delete("/:index", async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    const data = await SuperAffiliateVideo.findOne();
    if (!data || index >= data.videos.length) {
      return res.status(404).json({ message: "Video not found" });
    }

    data.videos.splice(index, 1);
    await data.save();

    res.json({ message: "Video URL deleted!", videos: data.videos });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;