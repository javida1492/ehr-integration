const pool = require("../../db")

const submitAnswer = async (req, res) => {
  const { patient_id } = req.params
  const { ehr_name, question_id, answer } = req.body

  try {
    await pool.query(
      `INSERT INTO patient_answers (patient_id, question_id, answer, ehr_name)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (patient_id, question_id)
       DO UPDATE SET answer = EXCLUDED.answer, updated_at = CURRENT_TIMESTAMP`,
      [patient_id, question_id, answer, ehr_name]
    )

    res.json({ message: "Answer saved successfully" })
  } catch (error) {
    console.error("Error submitting answer:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

module.exports = submitAnswer
