const pool = require("../../db")

const updateMapping = async (req, res) => {
  const { ehr_name } = req.params
  const { mapping } = req.body
  try {
    const result = await pool.query(
      `UPDATE ehr_mappings
       SET mapping = $1,
           updated_at = CURRENT_TIMESTAMP,
           version = version + 1
       WHERE ehr_name = $2
       RETURNING *`,
      [mapping, ehr_name]
    )
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Mapping not found" })
    }
    res.json({
      message: "Mapping updated successfully",
      mapping: result.rows[0],
    })
  } catch (error) {
    console.error("Error updating mapping:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

module.exports = updateMapping
