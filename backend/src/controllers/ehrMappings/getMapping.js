// backend/src/controllers/ehrMappings/getMapping.js
const pool = require("../../db")

exports.getMapping = async (req, res) => {
  const { ehr_name } = req.params
  try {
    const result = await pool.query(
      `SELECT * FROM ehr_mappings WHERE ehr_name = $1`,
      [ehr_name]
    )
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Mapping not found" })
    }
    res.json(result.rows[0])
  } catch (error) {
    console.error("Error retrieving mapping:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}
