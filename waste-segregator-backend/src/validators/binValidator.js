const { body, validationResult } = require("express-validator")
const { WASTE_CATEGORIES } = require("../config/constants")

// Validation rules for bin creation
const validateBinCreation = [
  body("binId").trim().isLength({ min: 2, max: 50 }).withMessage("Bin ID must be between 2 and 50 characters"),
  body("category")
    .isIn(Object.values(WASTE_CATEGORIES))
    .withMessage(`Category must be one of: ${Object.values(WASTE_CATEGORIES).join(", ")}`),
  body("location.latitude").isFloat({ min: -90, max: 90 }).withMessage("Latitude must be between -90 and 90"),
  body("location.longitude").isFloat({ min: -180, max: 180 }).withMessage("Longitude must be between -180 and 180"),
  body("location.address")
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage("Address must be between 5 and 500 characters"),
  body("capacity").isInt({ min: 1 }).withMessage("Capacity must be a positive integer"),
]

// Validation rules for bin update
const validateBinUpdate = [
  body("fillLevel").optional().isInt({ min: 0, max: 100 }).withMessage("Fill level must be between 0 and 100"),
  body("status").optional().isIn(["active", "inactive", "maintenance", "offline"]).withMessage("Invalid status"),
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
  validateBinCreation,
  validateBinUpdate,
  handleValidationErrors,
}
