import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getAllMappings, deleteMapping } from "../api/ehrMappings"

const buttonStyle = {
  padding: "0.5rem 1rem",
  backgroundColor: "#007acc",
  color: "#fff",
  textDecoration: "none",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  marginRight: "0.5rem",
}

const EHRMappingList = () => {
  const [mappings, setMappings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Function to fetch all mappings from the backend
  const fetchMappings = async () => {
    try {
      const data = await getAllMappings()
      setMappings(data)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching mappings:", err)
      setError("Failed to fetch mappings.")
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMappings()
  }, [])

  const handleDelete = async (ehrName) => {
    if (
      window.confirm(
        `Are you sure you want to delete the mapping for ${ehrName}?`
      )
    ) {
      try {
        await deleteMapping(ehrName)
        fetchMappings()
      } catch (err) {
        console.error("Error deleting mapping:", err)
        setError("Failed to delete mapping.")
      }
    }
  }

  if (loading) return <p>Loading mappings...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h2>EHR Mappings</h2>
      <Link to="/mappings/new">Create New Mapping</Link>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {mappings.map((mapping) => (
          <li
            key={mapping.ehr_name}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <h3>{mapping.ehr_name}</h3>
            <p>
              <strong>Version:</strong> {mapping.version || 1}
            </p>
            <div>
              <strong>Mapping Details:</strong>
              <pre style={{ background: "#000", padding: "1rem" }}>
                {JSON.stringify(mapping.mapping, null, 2)}
              </pre>
            </div>
            <div>
              <Link
                to={`/mappings/edit/${encodeURIComponent(mapping.ehr_name)}`}
                style={buttonStyle}
              >
                Edit
              </Link>
              <button
                style={buttonStyle}
                onClick={() => handleDelete(mapping.ehr_name)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default EHRMappingList
