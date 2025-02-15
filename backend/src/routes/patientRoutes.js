const express = require("express")
const router = express.Router()
const patientController = require("../controllers/patient")

// Patient CRUD endpoints
router.post("/", patientController.createPatient)
router.get("/:patient_id", patientController.getPatient)
router.get("/", patientController.getAllPatients)
router.put("/:patient_id", patientController.updatePatient)
router.delete("/:patient_id", patientController.deletePatient)

// Patient answers endpoints
router.post("/:patient_id/answers", patientController.submitAnswer)
router.get("/:patient_id/answers", patientController.getAnswers)

// Bulk patient update endpoint
const bulkUpdatePatients = require("../controllers/patient/bulkUpdatePatients")
router.post("/bulk-update", bulkUpdatePatients)

module.exports = router
