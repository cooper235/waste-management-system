const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()
const { verifyAdminCredentials } = require("../middlewares/adminAuth")
const { generateAccessToken } = require("../utils/jwtUtils")

// Define SystemSetting Schema and Model directly here
const systemSettingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

const SystemSetting = mongoose.model("SystemSetting", systemSettingSchema);

// Admin Login (Development Mode - Hardcoded Credentials)
router.post("/login", (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      })
    }

    if (verifyAdminCredentials(email, password)) {
      const accessToken = generateAccessToken(email)
      return res.status(200).json({
        success: true,
        message: "Admin login successful",
        data: {
          accessToken,
          admin: {
            email,
            role: "admin",
          },
        },
      })
    }

    res.status(401).json({
      success: false,
      message: "Invalid admin credentials",
    })
  } catch (error) {
    console.error("[ERROR] Admin login error:", error.message)
    res.status(500).json({
      success: false,
      message: "Admin login failed",
    })
  }
})

// Update and get camera feed URL
router.post("/settings/camera-feed", async (req, res) => {
  try {
    const { cameraFeedUrl } = req.body;

    if (!cameraFeedUrl) {
      return res.status(400).json({
        success: false,
        message: "Camera feed URL is required",
      });
    }

    await SystemSetting.findOneAndUpdate(
      { key: "cameraFeedUrl" },
      { value: cameraFeedUrl },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      message: "Camera feed URL updated successfully",
    });
  } catch (error) {
    console.error("[ERROR] Update camera feed error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update camera feed URL",
    });
  }
});

module.exports = router
