const express = require("express")
const router = express.Router()
const patientController = require("../controllers/patient")

// Bulk patient update endpoint
router.post("/bulk-update", patientController.bulkUpdatePatients)

// Patient CRUD endpoints
router.post("/", patientController.createPatient)
router.get("/:patient_id", patientController.getPatient)
router.get("/", patientController.getAllPatients)
router.put("/:patient_id", patientController.updatePatient)
router.delete("/:patient_id", patientController.deletePatient)

// Patient answers endpoints
router.post("/:patient_id/answers", patientController.submitAnswer)
router.get("/:patient_id/answers", patientController.getAnswers)

module.exports = router
