import axios from "axios"

const API_BASE = "/api/patients"

export const bulkUpdatePatients = async (provider, updateData) => {
  // You may design an endpoint to handle bulk updates, e.g., POST /api/patients/bulk
  const response = await axios.post(`${API_BASE}/bulk`, {
    provider,
    updateData,
  })
  return response.data
}

export const overrideMappingForPatient = async (patientId, newMapping) => {
  // For example, an endpoint like PUT /api/patients/:patientId/override-mapping
  const response = await axios.put(
    `${API_BASE}/${patientId}/override-mapping`,
    { newMapping }
  )
  return response.data
}
