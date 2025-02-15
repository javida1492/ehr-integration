const getPatientAnswers = require("./utils/getPatientAnswers")
const getEHRMapping = require("./utils/getEHRMapping")
const buildPayload = require("./utils/buildPayload")
const sendToEHRAdapter = require("./utils/sendToEhrAdapter")

exports.submitToEHR = async (req, res) => {
  const { patient_id, ehr_name } = req.body
  try {
    // Retrieve patient answers
    const answersRes = await getPatientAnswers(patient_id, ehr_name)
    if (answersRes.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "No answers found for this patient" })
    }

    // Retrieve the EHR mapping
    const mappingRes = await getEHRMapping(ehr_name)
    if (mappingRes.rowCount === 0) {
      return res.status(400).json({ error: "EHR mapping not found" })
    }

    const mapping = mappingRes.rows[0].mapping.patient
    const payload = buildPayload(answersRes.rows, mapping)

    // Send data to the appropriate EHR adapter
    let ehrResponse
    try {
      ehrResponse = await sendToEHRAdapter(ehr_name, payload)
    } catch (err) {
      return res.status(400).json({ error: err.message })
    }

    return res.json({
      message: "Data submitted to EHR successfully",
      ehrResponse,
    })
  } catch (error) {
    console.error("Error in submitToEHR:", error)
    return res.status(500).json({ error: "Failed to submit to EHR" })
  }
}
