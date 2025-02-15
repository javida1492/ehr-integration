const pool = require("../../db")

const getPatientAnswers = async (patient_id, ehr_name) => {
  return await pool.query(
    "SELECT question_id, answer FROM patient_answers WHERE patient_id = $1 AND ehr_name = $2",
    [patient_id, ehr_name]
  )
}

module.exports = getPatientAnswers
