const pool = require("../../db")

const bulkUpdatePatients = async (req, res) => {
  // We expect a payload like:
  // {
  //   filter: { insurance_provider: "Acme Insurance" },
  //   updateData: { address: "New Address", phone: "New Phone" }
  // }
  const { filter, updateData } = req.body

  if (!filter || !updateData) {
    return res.status(400).json({ error: "Missing filter or updateData" })
  }

  // For this example, we only support filtering by insurance_provider
  const insuranceProvider = filter.insurance_provider
  if (!insuranceProvider) {
    return res
      .status(400)
      .json({ error: "Filter must include insurance_provider" })
  }

  const keys = Object.keys(updateData)
  if (keys.length === 0) {
    return res.status(400).json({ error: "No update data provided" })
  }

  // Build the SET clause dynamically.
  const setClauses = keys.map((key, i) => `${key} = $${i + 1}`).join(", ")
  const values = keys.map((key) => updateData[key])

  // Append the filter value
  const query = `
    UPDATE patients 
    SET ${setClauses}, updated_at = CURRENT_TIMESTAMP
    WHERE insurance_provider = $${keys.length + 1}
    RETURNING *
  `
  values.push(insuranceProvider)

  try {
    const result = await pool.query(query, values)
    res.json({
      message: "Bulk update successful",
      updatedPatients: result.rows,
    })
  } catch (error) {
    console.error("Error in bulk update:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

module.exports = bulkUpdatePatients
