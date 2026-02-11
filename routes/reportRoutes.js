import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import cloudinary from "../config/cloudinary.js";
import {
  createReport,
  getReports,
  getReportById,
  updateReportStatus,
  addComment
} from "../controllers/reportController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================================
   Multer + Cloudinary Setup
================================ */
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "civicone_reports",
    allowed_formats: ["jpg", "jpeg", "png"],
  }
});

const upload = multer({ storage });

/* ================================
   Report Routes
================================ */

// Create new report (with image upload)
router.post("/", protect, upload.single("image"), createReport);

// Get all reports
router.get("/", getReports);

// Get single report
router.get("/:id", getReportById);

// Update status (admin only)
router.put("/:id/status", protect, adminOnly, updateReportStatus);

// Add comment to report
router.post("/:id/comment", protect, addComment);

export default router;
