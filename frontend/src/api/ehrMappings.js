import axios from "axios"

const API_BASE = "/api/ehr-mappings" // Vite proxy forwards these requests to your Express backend

export const getMapping = async (ehrName) => {
  console.log(ehrName)
  const response = await axios.get(`${API_BASE}/${encodeURIComponent(ehrName)}`)
  return response.data
}

export const getAllMappings = async () => {
  const response = await axios.get(API_BASE)
  return response.data
}

export const updateMapping = async (ehrName, mapping) => {
  const response = await axios.put(
    `${API_BASE}/${encodeURIComponent(ehrName)}`,
    { mapping }
  )
  return response.data
}

export const createMapping = async (ehrName, mapping) => {
  const response = await axios.post(API_BASE, { ehr_name: ehrName, mapping })
  return response.data
}

export const deleteMapping = async (ehrName) => {
  const response = await axios.delete(
    `${API_BASE}/${encodeURIComponent(ehrName)}`
  )
  return response.data
}
