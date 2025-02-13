// backend/src/controllers/ehrMappings/createMapping.js
const pool = require("../../db")

exports.createMapping = async (req, res) => {
  const { ehr_name, mapping } = req.body
  try {
    const result = await pool.query(
      `INSERT INTO ehr_mappings (ehr_name, mapping)
       VALUES ($1, $2)
       RETURNING *`,
      [ehr_name, mapping]
    )
    res.status(201).json({
      message: "Mapping created successfully",
      mapping: result.rows[0],
    })
  } catch (error) {
    console.error("Error creating mapping:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}
