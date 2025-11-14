const TeamMember = require("../models/TeamMember")
const cloudUploadService = require("../services/cloudUploadService")
const logger = require("../config/logger")

exports.createTeamMember = async (req, res, next) => {
  try {
    const { name, role, email, department } = req.body

    if (!name || !role || !email) {
      return res.status(400).json({
        success: false,
        message: "Name, role, and email are required",
      })
    }

    const member = new TeamMember({
      name,
      role,
      email,
      department: department || "Operations",
      createdBy: req.user?._id || null,
    })

    await member.save()

    logger.info(`[TEAM] New team member created: ${member._id}`)

    res.status(201).json({
      success: true,
      message: "Team member created successfully",
      data: member,
    })
  } catch (error) {
    logger.error(`[TEAM] Create error: ${error.message}`)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.getTeamMembers = async (req, res, next) => {
  try {
    const { isActive = true } = req.query

    const members = await TeamMember.find({ isActive }).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      data: members,
    })
  } catch (error) {
    logger.error(`[TEAM] Get error: ${error.message}`)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.updateTeamMember = async (req, res, next) => {
  try {
    const { memberId } = req.params
    const { name, role, email, department, isActive } = req.body

    const member = await TeamMember.findByIdAndUpdate(
      memberId,
      { name, role, email, department, isActive },
      { new: true, runValidators: true },
    )

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      })
    }

    logger.info(`[TEAM] Team member updated: ${memberId}`)

    res.status(200).json({
      success: true,
      message: "Team member updated successfully",
      data: member,
    })
  } catch (error) {
    logger.error(`[TEAM] Update error: ${error.message}`)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.deleteTeamMember = async (req, res, next) => {
  try {
    const { memberId } = req.params

    const member = await TeamMember.findByIdAndDelete(memberId)

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      })
    }

    // Delete image from Cloudinary if exists
    if (member.profileImage?.cloudinaryId) {
      try {
        await cloudUploadService.deleteImage(member.profileImage.cloudinaryId)
      } catch (error) {
        logger.warn(`[TEAM] Failed to delete image: ${error.message}`)
      }
    }

    logger.info(`[TEAM] Team member deleted: ${memberId}`)

    res.status(200).json({
      success: true,
      message: "Team member deleted successfully",
    })
  } catch (error) {
    logger.error(`[TEAM] Delete error: ${error.message}`)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.uploadTeamMemberImage = async (req, res, next) => {
  try {
    const { memberId } = req.params

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      })
    }

    const member = await TeamMember.findById(memberId)
    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      })
    }

    // Delete old image if exists
    if (member.profileImage?.cloudinaryId) {
      try {
        await cloudUploadService.deleteImage(member.profileImage.cloudinaryId)
      } catch (error) {
        logger.warn(`[TEAM] Failed to delete old image: ${error.message}`)
      }
    }

    // Upload new image
    const result = await cloudUploadService.uploadImage(req.file.buffer, `team-${memberId}`, "waste-segregator/team")

    member.profileImage = {
      url: result.secure_url,
      cloudinaryId: result.public_id,
    }

    await member.save()

    logger.info(`[TEAM] Team member image uploaded: ${memberId}`)

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: member,
    })
  } catch (error) {
    logger.error(`[TEAM] Upload image error: ${error.message}`)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
