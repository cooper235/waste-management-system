const express = require("express")
const {
  submitFeedback,
  getFeedback,
  reviewFeedback,
  getFeedbackStats,
  deleteFeedback,
} = require("../controllers/feedbackController")
const { validateFeedbackSubmission, handleValidationErrors } = require("../validators/feedbackValidator")
const router = express.Router()

// POST /feedback - Submit feedback (public, with validation)
router.post("/", validateFeedbackSubmission, handleValidationErrors, submitFeedback)

// GET /feedback - Get feedback
router.get("/", getFeedback)

// GET /feedback/stats - Feedback statistics
router.get("/stats", getFeedbackStats)

// PATCH /feedback/:feedbackId - Review feedback
router.patch("/:feedbackId", reviewFeedback)

// DELETE /feedback/:feedbackId - Delete feedback
router.delete("/:feedbackId", deleteFeedback)

module.exports = router
