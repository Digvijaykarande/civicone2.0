import express from "express";
import multer from "multer";
import path from "path";
import {
  createReport,
  getReports,
  getReportById,
  updateReportStatus
} from "../controllers/reportController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// multer setup
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "civicone_reports",
    allowed_formats: ["jpg", "jpeg", "png"],
  }
});

const upload = multer({ storage });


// routes
router.post("/", protect, upload.single("image"), createReport);
router.get("/", getReports);
router.get("/:id", getReportById);
router.put("/:id/status", protect, adminOnly, updateReportStatus);

export default router;
