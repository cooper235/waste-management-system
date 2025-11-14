const express = require("express");
const {
  getAllBins,
  getBinById,
  createBin,
  updateBin,
  deleteBin,
} = require("../controllers/binController");
const {
  validateBinCreation,
  validateBinUpdate,
  handleValidationErrors,
} = require("../validators/binValidator");
const upload = require("../config/multer");
const { cloudinary } = require("../config/cloudinary");
const Bin = require("../models/Bin");

const router = express.Router();

// Bin routes
router.get("/", getAllBins);
router.get("/:id", getBinById);
router.post("/", validateBinCreation, handleValidationErrors, createBin);
router.put("/:id", validateBinUpdate, handleValidationErrors, updateBin);
router.delete("/:id", deleteBin);

// Helper to find bin by _id or binId
async function findBinByIdOrBinId(id) {
  return await Bin.findOne({ $or: [{ _id: id }, { binId: id }] });
}

// Image upload route
router.post("/:id/upload", (req, res, next) => {
  upload.single("image")(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });

    try {
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });
      const bin = await findBinByIdOrBinId(req.params.id);
      if (!bin) return res.status(404).json({ error: "Bin not found" });

      const imageData = {
        url: req.file.path,
        public_id: req.file.filename,
        uploadedAt: new Date(),
      };

      bin.images.push(imageData);
      await bin.save();
      res.status(201).json(imageData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  });
});

// Image delete route
router.delete("/:binId/images/:imageId", async (req, res) => {
  try {
    const { binId, imageId } = req.params;
    const bin = await findBinByIdOrBinId(binId);
    if (!bin) return res.status(404).json({ error: "Bin not found" });

    const image = bin.images.id(imageId);
    if (!image) return res.status(404).json({ error: "Image not found" });

    await cloudinary.uploader.destroy(image.public_id);
    image.remove();
    await bin.save();
    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
