const pool = require("../db")
const { sendToAthena } = require("../adapters/athenaAdapter")
const { sendToAllscripts } = require("../adapters/allscriptsAdapter")

exports.submitToEHR = async (req, res) => {
  const { patient_id, ehr_name } = req.body

  try {
    // Retrieve patient answers for this EHR
    const answersRes = await pool.query(
      "SELECT question_id, answer FROM patient_answers WHERE patient_id = $1 AND ehr_name = $2",
      [patient_id, ehr_name]
    )

    if (answersRes.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "No answers found for this patient" })
    }

    // Retrieve the EHR mapping
    const mappingRes = await pool.query(
      "SELECT mapping FROM ehr_mappings WHERE ehr_name = $1",
      [ehr_name]
    )
    if (mappingRes.rowCount === 0) {
      return res.status(400).json({ error: "EHR mapping not found" })
    }

    const mapping = mappingRes.rows[0].mapping.patient
    const payload = {}
    answersRes.rows.forEach(({ question_id, answer }) => {
      if (mapping[question_id]) {
        payload[mapping[question_id]] = answer
      }
    })

    // Use the appropriate simulated adapter based on EHR
    let ehrResponse
    if (ehr_name === "Athena") {
      ehrResponse = await sendToAthena(payload)
    } else if (ehr_name === "Allscripts") {
      ehrResponse = await sendToAllscripts(payload)
    } else {
      return res.status(400).json({ error: "Unsupported EHR system" })
    }

    return res.json({
      message: "Data submitted to EHR successfully",
      ehrResponse,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Failed to submit to EHR" })
  }
}
