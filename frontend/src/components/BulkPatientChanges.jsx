import { useEffect, useState } from "react"
import { bulkUpdatePatients, getAllPatients } from "../api/patients"

const BulkPatientChanges = () => {
  const [patients, setPatients] = useState([])
  const [insuranceFilter, setInsuranceFilter] = useState("")
  const [filteredPatients, setFilteredPatients] = useState([])
  const [updateData, setUpdateData] = useState("")
  const [message, setMessage] = useState("")

  // Fetch all patients when the component mounts
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await getAllPatients()
        setPatients(data)
      } catch (error) {
        console.error("Error fetching patients:", error)
      }
    }
    fetchPatients()
  }, [])

  // Update filteredPatients whenever patients or the insurance filter changes
  useEffect(() => {
    const filtered = patients.filter(
      (patient) =>
        patient.insurance_provider &&
        patient.insurance_provider
          .toLowerCase()
          .includes(insuranceFilter.toLowerCase())
    )
    setFilteredPatients(filtered)
  }, [patients, insuranceFilter])

  // Handler for bulk update using the new endpoint
  const handleBulkUpdate = async () => {
    if (!updateData) {
      setMessage("Please enter update data in JSON format.")
      return
    }

    let parsedUpdateData
    try {
      parsedUpdateData = JSON.parse(updateData)
    } catch (error) {
      console.error("Error parsing JSON for update data:", error)
      setMessage("Invalid JSON for update data.")
      return
    }

    try {
      const result = await bulkUpdatePatients(
        { insurance_provider: insuranceFilter },
        parsedUpdateData
      )
      setMessage(
        `Bulk update successful: ${result.updatedPatients.length} record(s) updated.`
      )
      // Refresh the list if needed
      const refreshed = await getAllPatients()
      setPatients(refreshed)
    } catch (error) {
      console.error("Error in bulk update:", error)
      setMessage("Bulk update failed.")
    }
  }

  return (
    <div>
      <h2>Bulk Patient Changes</h2>
      <div>
        <label>Insurance Provider Filter: </label>
        <input
          type="text"
          value={insuranceFilter}
          onChange={(e) => setInsuranceFilter(e.target.value)}
          placeholder="Enter insurance provider..."
        />
      </div>
      <div>
        <h3>Filtered Patients:</h3>
        {filteredPatients.length === 0 ? (
          <p>No patients match the filter.</p>
        ) : (
          <ul>
            {filteredPatients.map((patient) => (
              <li key={patient.id}>
                <strong>{patient.name}</strong> – {patient.insurance_provider} –{" "}
                {patient.address}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <label>Update Data (JSON): </label>
        <textarea
          value={updateData}
          onChange={(e) => setUpdateData(e.target.value)}
          placeholder='e.g., {"address": "New Address"}'
          rows="5"
          cols="50"
        />
      </div>
      <button onClick={handleBulkUpdate}>Bulk Update Patients</button>
      {message && <p>{message}</p>}
    </div>
  )
}

export default BulkPatientChanges
