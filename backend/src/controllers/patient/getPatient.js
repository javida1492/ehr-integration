const pool = require("../../db")

const getPatient = async (req, res) => {
  const { patient_id } = req.params
  try {
    const result = await pool.query("SELECT * FROM patients WHERE id = $1", [
      patient_id,
    ])
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Patient not found" })
    }
    res.json(result.rows[0])
  } catch (error) {
    console.error("Error retrieving patient:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

module.exports = getPatient
