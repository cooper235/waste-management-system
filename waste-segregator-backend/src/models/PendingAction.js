const mongoose = require("mongoose")

const pendingActionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
      index: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
      index: true,
    },
    assignedTo: {
      type: String,
      default: "General",
    },
    completedAt: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
      required: false,
    },
  },
  { timestamps: true },
)

pendingActionSchema.index({ dueDate: 1, status: 1 })
pendingActionSchema.index({ status: 1, priority: -1 })

module.exports = mongoose.model("PendingAction", pendingActionSchema)
