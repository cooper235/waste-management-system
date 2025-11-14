const express = require("express")
const { getWasteDataByDate, createWasteData, getWasteStats } = require("../controllers/wasteDataController")

const router = express.Router()

router.get("/date/:date", getWasteDataByDate)
router.post("/", createWasteData)
router.get("/stats/:date", getWasteStats)

module.exports = router
