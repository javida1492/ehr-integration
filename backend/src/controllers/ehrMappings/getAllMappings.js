const pool = require("../../db")

const getAllMappings = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM ehr_mappings")
    res.json(result.rows)
  } catch (error) {
    console.error("Error retrieving mappings:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

module.exports = getAllMappings
