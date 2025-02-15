const pool = require("../../db")

const getPatientOverrideMapping = async (patient_id) => {
  // Query the patients table for the mapping_override column for this patient
  return await pool.query(
    "SELECT mapping_override FROM patients WHERE id = $1",
    [patient_id]
  )
}

module.exports = getPatientOverrideMapping
