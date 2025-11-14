const express = require("express")
const {
  createMaintenance,
  getMaintenanceLogs,
  updateMaintenance,
  deleteMaintenance,
} = require("../controllers/maintenanceController")
const router = express.Router()

// POST /maintenance - Create maintenance log
router.post("/", createMaintenance)

// GET /maintenance - Get maintenance logs
router.get("/", getMaintenanceLogs)

// PATCH /maintenance/:maintenanceId - Update maintenance log
router.patch("/:maintenanceId", updateMaintenance)

// DELETE /maintenance/:maintenanceId - Delete maintenance log
router.delete("/:maintenanceId", deleteMaintenance)

module.exports = router
