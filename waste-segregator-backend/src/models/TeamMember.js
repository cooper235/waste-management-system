const mongoose = require("mongoose")

const teamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"],
    },
    profileImage: {
      url: String,
      cloudinaryId: String,
    },
    department: {
      type: String,
      default: "Operations",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
      required: true,
    },
  },
  { timestamps: true },
)

teamMemberSchema.index({ isActive: 1 })
teamMemberSchema.index({ email: 1 })

module.exports = mongoose.model("TeamMember", teamMemberSchema)
