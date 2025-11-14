const { body, validationResult } = require("express-validator")

// Validation rules for feedback submission
const validateFeedbackSubmission = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email address"),
  body("subject").trim().isLength({ min: 3, max: 200 }).withMessage("Subject must be between 3 and 200 characters"),
  body("message").trim().isLength({ min: 10, max: 2000 }).withMessage("Message must be between 10 and 2000 characters"),
  body("rating").optional().isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
  body("category")
    .optional()
    .isIn(["general", "bug", "feature", "improvement", "other"])
    .withMessage("Invalid category"),
]

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    })
  }
  next()
}

module.exports = {
  validateFeedbackSubmission,
  handleValidationErrors,
}
