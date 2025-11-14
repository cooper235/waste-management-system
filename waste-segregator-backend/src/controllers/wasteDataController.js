const WasteData = require("../models/WasteData")
const logger = require("../config/logger")

exports.getWasteDataByDate = async (req, res, next) => {
  try {
    const { date } = req.params

    const startDate = new Date(date)
    startDate.setHours(0, 0, 0, 0)

    const endDate = new Date(date)
    endDate.setHours(23, 59, 59, 999)

    const wasteData = await WasteData.find({
      date: { $gte: startDate, $lte: endDate },
    }).populate("binId")

    const totalWaste = wasteData.reduce((sum, item) => sum + item.wasteAmount, 0)

    res.status(200).json({
      success: true,
      data: {
        wasteData,
        totalWaste,
        count: wasteData.length,
      },
    })
  } catch (error) {
    logger.error(`[WASTE] Get by date error: ${error.message}`)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.createWasteData = async (req, res, next) => {
  try {
    const { date, binId, wasteAmount, category, notes } = req.body

    if (!date || !binId || wasteAmount === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: "date, binId, wasteAmount, and category are required",
      })
    }

    const wasteData = new WasteData({
      date: new Date(date),
      binId,
      wasteAmount,
      category,
      notes,
    })

    await wasteData.save()

    logger.info(`[WASTE] Waste data created: ${wasteData._id}`)

    res.status(201).json({
      success: true,
      message: "Waste data created successfully",
      data: wasteData,
    })
  } catch (error) {
    logger.error(`[WASTE] Create error: ${error.message}`)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.getWasteStats = async (req, res, next) => {
  try {
    const { date } = req.params

    const startDate = new Date(date)
    startDate.setHours(0, 0, 0, 0)

    const endDate = new Date(date)
    endDate.setHours(23, 59, 59, 999)

    const stats = await WasteData.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$wasteAmount" },
          count: { $sum: 1 },
        },
      },
    ])

    res.status(200).json({
      success: true,
      data: stats,
    })
  } catch (error) {
    logger.error(`[WASTE] Stats error: ${error.message}`)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
