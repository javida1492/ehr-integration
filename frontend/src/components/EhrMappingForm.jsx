import { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { useParams } from "react-router-dom"
import { getMapping, updateMapping, createMapping } from "../api/ehrMappings"

const EHRMappingForm = ({ isEdit }) => {
  const { ehrName } = useParams()
  const [ehrNameState, setEhrNameState] = useState(ehrName || "")

  const [rawMapping, setRawMapping] = useState(
    JSON.stringify({ patient: {} }, null, 2)
  )
  const [message, setMessage] = useState("")

  // When in edit mode, fetch the current mapping
  useEffect(() => {
    if (isEdit && ehrName) {
      getMapping(ehrName)
        .then((data) => {
          setEhrNameState(data.ehr_name)
          // Set the raw mapping text based on fetched mapping
          setRawMapping(JSON.stringify(data.mapping, null, 2))
        })
        .catch((err) => {
          console.error("Error fetching mapping:", err)
          setMessage("Error fetching mapping")
        })
    }
  }, [isEdit, ehrName])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Try to parse the rawMapping text
      const parsedMapping = JSON.parse(rawMapping)
      let result
      if (isEdit) {
        result = await updateMapping(ehrNameState, parsedMapping)
      } else {
        result = await createMapping(ehrNameState, parsedMapping)
      }
      setMessage(result.message)
    } catch (error) {
      console.error("Error updating mapping:", error)
      setMessage("Error updating mapping: Invalid JSON")
    }
  }

  return (
    <div>
      <h2>{isEdit ? "Edit" : "Create"} EHR Mapping</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>EHR Name:</label>
          <input
            type="text"
            value={ehrNameState}
            onChange={(e) => setEhrNameState(e.target.value)}
            disabled={isEdit} // In edit mode, don't allow changing the EHR name
          />
        </div>
        <div>
          <label>Mapping (JSON):</label>
          <textarea
            value={rawMapping}
            onChange={(e) => setRawMapping(e.target.value)}
            rows="10"
            cols="50"
          />
        </div>
        <button type="submit">{isEdit ? "Update" : "Create"}</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}

EHRMappingForm.propTypes = {
  isEdit: PropTypes.bool,
}

EHRMappingForm.defaultProps = {
  isEdit: true,
}

export default EHRMappingForm
