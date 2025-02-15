// backend/src/routes/ehrMappingsRoutes.js
const express = require("express")
const router = express.Router()
const ehrMappingsController = require("../controllers/ehrMappings")

//Get all EHR mappings
router.get("/", ehrMappingsController.getAllMappings)

// Retrieve a specific mapping by EHR name
router.get("/:ehr_name", ehrMappingsController.getMapping)

// Create a new mapping
router.post("/", ehrMappingsController.createMapping)

// Update an existing mapping
router.put("/:ehr_name", ehrMappingsController.updateMapping)

// Delete a mapping (optional?)
router.delete("/:ehr_name", ehrMappingsController.deleteMapping)

module.exports = router
