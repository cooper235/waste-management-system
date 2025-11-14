const express = require("express")
const {
  createWorker,
  getWorkers,
  updateWorker,
  assignBins,
  getWorkerStats,
  deleteWorker,
} = require("../controllers/workerController")
const router = express.Router()

// POST /workers - Create worker
router.post("/", createWorker)

// GET /workers - Get workers
router.get("/", getWorkers)

// GET /workers/:workerId/stats - Get worker statistics
router.get("/:workerId/stats", getWorkerStats)

// PATCH /workers/:workerId - Update worker
router.patch("/:workerId", updateWorker)

// PATCH /workers/:workerId/assign-bins - Assign bins to worker
router.patch("/:workerId/assign-bins", assignBins)

// DELETE /workers/:workerId - Delete worker
router.delete("/:workerId", deleteWorker)

module.exports = router
