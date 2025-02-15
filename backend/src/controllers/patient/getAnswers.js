const pool = require("../../db")

const getAnswers = async (req, res) => {
  const { patient_id } = req.params
  try {
    const result = await pool.query(
      "SELECT question_id, answer, ehr_name, created_at, updated_at FROM patient_answers WHERE patient_id = $1",
      [patient_id]
    )
    res.json(result.rows)
  } catch (error) {
    console.error("Error retrieving answers:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

module.exports = getAnswers
