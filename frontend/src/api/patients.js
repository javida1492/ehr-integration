import axios from "axios"

const API_BASE = "/api/patients"

export const getAllPatients = async () => {
  const response = await axios.get(API_BASE)
  return response.data
}

export const updatePatient = async (patientId, updateData) => {
  const response = await axios.put(`${API_BASE}/${patientId}`, updateData)
  return response.data
}

export const bulkUpdatePatients = async (filter, updateData) => {
  const response = await axios.post(`${API_BASE}/bulk-update`, {
    filter,
    updateData,
  })
  return response.data
}

export const updatePatientOverrideMapping = async (patientId, newMapping) => {
  const response = await updatePatient(patientId, {
    mapping_override: newMapping,
  })
  return response
}
