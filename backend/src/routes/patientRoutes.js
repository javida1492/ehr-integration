const express = require("express")
const router = express.Router()
const patientController = require("../controllers/patient")

// Patient CRUD endpoints
router.post("/", patientController.createPatient)
router.get("/:patient_id", patientController.getPatient)
router.put("/:patient_id", patientController.updatePatient)

// New endpoint to get all patients
router.get("/", patientController.getAllPatients)

// Patient answers endpoints
router.post("/:patient_id/answers", patientController.submitAnswer)
router.get("/:patient_id/answers", patientController.getAnswers)

module.exports = router
