const pool = require("../../db")

const getAllPatients = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM patients")
    res.json(result.rows)
  } catch (error) {
    console.error("Error retrieving patients:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

module.exports = getAllPatients
