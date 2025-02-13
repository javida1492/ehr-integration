const express = require("express")
const router = express.Router()
const ehrController = require("../controllers/ehrController")

// Endpoint to submit data to an EHR
router.post("/submit", ehrController.submitToEHR)

module.exports = router
