import { useState } from "react"
import { updatePatientOverrideMapping } from "../api/patients"

const OverrideMapping = () => {
  const [patientId, setPatientId] = useState("")
  const [rawMapping, setRawMapping] = useState("{}")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Attempt to parse the raw JSON string into an object.
      const parsedMapping = JSON.parse(rawMapping)
      // Update only the mapping_override field for the given patient.
      const result = await updatePatientOverrideMapping(
        patientId,
        parsedMapping
      )
      setMessage(result.message || "Override mapping updated successfully!")
    } catch (error) {
      console.error("Error overriding mapping:", error)
      const errMsg =
        (error.response && error.response.data && error.response.data.error) ||
        error.message
      setMessage("Error overriding mapping: " + errMsg)
    }
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Override Mapping for Patient</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ marginRight: "1rem" }}>Patient ID:</label>
          <input
            type="text"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            placeholder="Enter patient ID"
            style={{ padding: "0.5rem" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Override Mapping (JSON):
          </label>
          <textarea
            value={rawMapping}
            onChange={(e) => setRawMapping(e.target.value)}
            rows="10"
            cols="50"
            placeholder='e.g., {"patient": {"name": "CUSTOM_NAME", "address": "CUSTOM_ADDRESS"}}'
            style={{ padding: "0.5rem", fontFamily: "monospace" }}
          />
        </div>
        <button
          type="submit"
          style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
        >
          Submit Override
        </button>
      </form>
      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
    </div>
  )
}

export default OverrideMapping
