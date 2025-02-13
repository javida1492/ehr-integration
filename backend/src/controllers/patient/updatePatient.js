const pool = require("../../db")

exports.updatePatient = async (req, res) => {
  const { patient_id } = req.params
  const {
    name,
    gender,
    dob,
    address,
    phone,
    email,
    emergency_contact,
    insurance_provider,
    insurance_policy_number,
    primary_care_physician,
    allergies,
    current_medications,
    medical_history,
    social_history,
    family_history,
  } = req.body

  try {
    const result = await pool.query(
      `UPDATE patients
       SET name = $1,
           gender = $2,
           dob = $3,
           address = $4,
           phone = $5,
           email = $6,
           emergency_contact = $7,
           insurance_provider = $8,
           insurance_policy_number = $9,
           primary_care_physician = $10,
           allergies = $11,
           current_medications = $12,
           medical_history = $13,
           social_history = $14,
           family_history = $15,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $16
       RETURNING *`,
      [
        name,
        gender,
        dob,
        address,
        phone,
        email,
        emergency_contact,
        insurance_provider,
        insurance_policy_number,
        primary_care_physician,
        allergies,
        current_medications,
        medical_history,
        social_history,
        family_history,
        patient_id,
      ]
    )

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
