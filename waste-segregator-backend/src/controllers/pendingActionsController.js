const PendingAction = require("../models/PendingAction")
const logger = require("../config/logger")
const mongoose = require("mongoose")

exports.createAction = async (req, res, next) => {
  try {
    const { title, description, dueDate, priority, assignedTo } = req.body

    if (!title || !description || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "Title, description, and dueDate are required",
      })
    }

    const adminId = req.user?._id || new mongoose.Types.ObjectId()

    const action = new PendingAction({
      title,
      description,
      dueDate: new Date(dueDate),
      priority: priority || "medium",
      assignedTo: assignedTo || "General",
      createdBy: adminId,
    })

    await action.save()

    logger.info(`[ACTIONS] New pending action created: ${action._id}`)

    res.status(201).json({
      success: true,
      message: "Action created successfully",
      data: action,
    })
  } catch (error) {
    logger.error(`[ACTIONS] Create error: ${error.message}`)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.getActions = async (req, res, next) => {
  try {
    const { status, priority, limit = 20, skip = 0 } = req.query

    const query = {}
    if (status) query.status = status
    if (priority) query.priority = priority

    const actions = await PendingAction.find(query)
      .sort({ dueDate: 1, priority: -1 })
      .limit(Number(limit))
      .skip(Number(skip))

    const total = await PendingAction.countDocuments(query)

    res.status(200).json({
      success: true,
      data: {
        actions,
        pagination: { total, limit: Number(limit), skip: Number(skip) },
      },
    })
  } catch (error) {
    logger.error(`[ACTIONS] Get error: ${error.message}`)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.getActionsByDate = async (req, res, next) => {
  try {
    const { date } = req.params

    const startDate = new Date(date)
    startDate.setHours(0, 0, 0, 0)

    const endDate = new Date(date)
    endDate.setHours(23, 59, 59, 999)

    const actions = await PendingAction.find({
      dueDate: { $gte: startDate, $lte: endDate },
    }).sort({ priority: -1 })

    res.status(200).json({
      success: true,
      data: actions,
    })
  } catch (error) {
    logger.error(`[ACTIONS] Get by date error: ${error.message}`)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.updateAction = async (req, res, next) => {
  try {
    const { actionId } = req.params
    const { title, description, dueDate, priority, status, assignedTo } = req.body

    const action = await PendingAction.findByIdAndUpdate(
      actionId,
      {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        priority,
        status,
        assignedTo,
        completedAt: status === "completed" ? new Date() : null,
      },
      { new: true, runValidators: true },
    )

    if (!action) {
      return res.status(404).json({
        success: false,
        message: "Action not found",
      })
    }

    logger.info(`[ACTIONS] Action updated: ${actionId}`)

    res.status(200).json({
      success: true,
      message: "Action updated successfully",
      data: action,
    })
  } catch (error) {
    logger.error(`[ACTIONS] Update error: ${error.message}`)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.deleteAction = async (req, res, next) => {
  try {
    const { actionId } = req.params

    const action = await PendingAction.findByIdAndDelete(actionId)

    if (!action) {
      return res.status(404).json({
        success: false,
        message: "Action not found",
      })
    }

    logger.info(`[ACTIONS] Action deleted: ${actionId}`)

    res.status(200).json({
      success: true,
      message: "Action deleted successfully",
    })
  } catch (error) {
    logger.error(`[ACTIONS] Delete error: ${error.message}`)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
