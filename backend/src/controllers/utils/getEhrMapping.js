const pool = require("../../db")

const getEHRMapping = async (ehr_name) => {
  return await pool.query(
    "SELECT mapping FROM ehr_mappings WHERE ehr_name = $1",
    [ehr_name]
  )
}

module.exports = getEHRMapping
