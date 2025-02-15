const pool = require("../../db")

const deletePatient = async (req, res) => {
  const { patient_id } = req.params
  try {
    const result = await pool.query(
      "DELETE FROM patients WHERE id = $1 RETURNING *",
      [patient_id]
    )
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Patient not found" })
    }
    res.json({
      message: "Patient deleted successfully",
      patient: result.rows[0],
    })
  } catch (error) {
    console.error("Error deleting patient:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

module.exports = deletePatient
