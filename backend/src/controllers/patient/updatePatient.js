// backend/src/controllers/patient/updatePatient.js
const pool = require("../../db")

const updatePatient = async (req, res) => {
  const { patient_id } = req.params
  const updateData = req.body

  // If no fields are provided, return an error.
  if (!updateData || Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: "No update data provided" })
  }

  // Build the SET clause dynamically for each provided key.
  // This will generate something like "name = $1, address = $2, ..."
  const keys = Object.keys(updateData)
  const setClauses = keys.map((key, index) => `${key} = $${index + 1}`)
  // Add the updated_at column to be updated automatically.
  setClauses.push("updated_at = CURRENT_TIMESTAMP")

  // The patient_id is added as the last parameter.
  const values = keys.map((key) => updateData[key])
  values.push(patient_id)

  // Construct the query string. The patient_id will be the last parameter.
  const query = `
    UPDATE patients
    SET ${setClauses.join(", ")}
    WHERE id = $${values.length}
    RETURNING *
  `

  try {
    const result = await pool.query(query, values)
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Patient not found" })
    }
    res.json({
      message: "Patient updated successfully",
      patient: result.rows[0],
    })
  } catch (error) {
    console.error("Error updating patient:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

module.exports = updatePatient
