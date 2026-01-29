// config/multer.js
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads/method-icons";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `method-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb(new Error("Only images (jpeg, jpg, png, webp) are allowed"));
  },
});

// Export both: upload.any() for dynamic fields + upload.fields() for backward compatibility
export const uploadAny = upload.any(); // For icons[0], icons[1], etc.
export const uploadFields = upload.fields([
  { name: "backgroundImage", maxCount: 1 },
  { name: "icons", maxCount: 30 }, // Optional: for old format
]);


export default upload;
