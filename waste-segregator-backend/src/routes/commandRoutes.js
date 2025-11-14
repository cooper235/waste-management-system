const express = require("express")
const { createCommand, getCommands, updateCommand, deleteCommand } = require("../controllers/commandController")
const router = express.Router()

// POST /commands - Create command
router.post("/", createCommand)

// GET /commands - Get commands
router.get("/", getCommands)

// PATCH /commands/:commandId - Update command
router.patch("/:commandId", updateCommand)

// DELETE /commands/:commandId - Delete command
router.delete("/:commandId", deleteCommand)

module.exports = router
