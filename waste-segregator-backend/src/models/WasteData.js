const mongoose = require("mongoose")

const wasteDataSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, "Date is required"],
      index: true,
    },
    binId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bin",
      required: [true, "Bin ID is required"],
    },
    wasteAmount: {
      type: Number,
      required: [true, "Waste amount is required"],
      min: 0,
    },
    category: {
      type: String,
      enum: ["dry", "wet", "plastic", "metal"],
      required: true,
    },
    notes: String,
  },
  { timestamps: true },
)

wasteDataSchema.index({ date: 1, binId: 1 })
wasteDataSchema.index({ date: 1, category: 1 })

module.exports = mongoose.model("WasteData", wasteDataSchema)
