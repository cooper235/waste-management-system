const express = require("express")
const {
  createAction,
  getActions,
  getActionsByDate,
  updateAction,
  deleteAction,
} = require("../controllers/pendingActionsController")

const router = express.Router()

router.post("/", createAction)
router.get("/", getActions)
router.get("/date/:date", getActionsByDate)
router.patch("/:actionId", updateAction)
router.delete("/:actionId", deleteAction)

module.exports = router
