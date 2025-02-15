const { sendToAthena } = require("../../adapters/athenaAdapter")
const { sendToAllscripts } = require("../../adapters/allscriptsAdapter")

const sendToEHRAdapter = async (ehr_name, payload) => {
  if (ehr_name === "Athena") {
    return await sendToAthena(payload)
  } else if (ehr_name === "Allscripts") {
    return await sendToAllscripts(payload)
  } else {
    throw new Error("Unsupported EHR system")
  }
}

module.exports = sendToEHRAdapter
