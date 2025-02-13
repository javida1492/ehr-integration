const pool = require("../../db")

exports.createPatient = async (req, res) => {
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
      `INSERT INTO patients 
      (name, gender, dob, address, phone, email, emergency_contact, insurance_provider, insurance_policy_number, primary_care_physician, allergies, current_medications, medical_history, social_history, family_history)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING id`,
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
      ]
    )
    res.status(201).json({
      message: "Patient created successfully",
      patient_id: result.rows[0].id,
    })
  } catch (error) {
    console.error("Error creating patient:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}
