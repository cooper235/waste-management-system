const express = require("express")
const multer = require("multer")
const { getAllImages, uploadImage, verifyImage, getBinImages, deleteImage } = require("../controllers/imageController")

const router = express.Router()

// Configure multer for file uploads (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    // Additional file filter
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Only image files are allowed"))
    }
  },
})

// GET /images - Get all images
router.get("/", getAllImages)

// POST /images/upload - Upload image
router.post("/upload", upload.single("image"), uploadImage)

// PATCH /images/:imageId/verify - Verify image
router.patch("/:imageId/verify", verifyImage)

// GET /images/:binId - Get images for a bin
router.get("/:binId", getBinImages)

// DELETE /images/:imageId - Delete image
router.delete("/:imageId", deleteImage)

module.exports = router
