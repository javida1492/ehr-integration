const pool = require("../../db")

exports.deleteMapping = async (req, res) => {
  const { ehr_name } = req.params
  try {
    const result = await pool.query(
      `DELETE FROM ehr_mappings WHERE ehr_name = $1 RETURNING *`,
      [ehr_name]
    )
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Mapping not found" })
    }
    res.json({
      message: "Mapping deleted successfully",
      mapping: result.rows[0],
    })
  } catch (error) {
    console.error("Error deleting mapping:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}
