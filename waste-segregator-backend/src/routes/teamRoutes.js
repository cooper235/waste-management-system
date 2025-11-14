const express = require("express")
const multer = require("multer")
const {
  createTeamMember,
  getTeamMembers,
  updateTeamMember,
  deleteTeamMember,
  uploadTeamMemberImage,
} = require("../controllers/teamController")

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } })

router.post("/", createTeamMember)
router.get("/", getTeamMembers)
router.patch("/:memberId", updateTeamMember)
router.delete("/:memberId", deleteTeamMember)
router.post("/:memberId/upload-image", upload.single("image"), uploadTeamMemberImage)

module.exports = router
