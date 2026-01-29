const fs = require("fs").promises; // Use promises for async/await
const path = require("path");

// Define upload directory (consistent with ImageUpload.Controller.js)
const uploadDir = path.join(__dirname, "..", "uploads");

// Export the deleteImage function
const deleteImage = async (req, res) => {
  try {
    const { filename } = req.body;

    // Validate input
    if (!filename) {
      return res.status(400).json({ error: "Filename is required" });
    }

    // Construct the full file path
    const filePath = path.join(uploadDir, filename);

    // Check if file exists
    try {
      await fs.access(filePath); // Throws if file doesn't exist
    } catch (err) {
      return res.status(404).json({ error: "File not found" });
    }

    // Delete the file
    await fs.unlink(filePath);

    // Respond with success
    res.status(200).json({ message: "Image deleted successfully" });
  } catch (err) {
    console.error("Image deletion error:", err);
    res.status(500).json({ error: "Failed to delete image", details: err.message });
  }
};





module.exports = { deleteImage };