import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import EHRMappingList from "./components/EhrMappingList"
import EHRMappingForm from "./components/EhrMappingForm"
import BulkPatientChanges from "./components/BulkPatientChanges"
import OverrideMapping from "./components/OverrideMapping"

function App() {
  return (
    <Router>
      <div>
        <nav style={{ margin: "1rem 0" }}>
          <Link to="/mappings">Manage EHR Mappings</Link> {" | "}
          <Link to="/bulk">Bulk Patient Changes</Link> {" | "}
          <Link to="/override">Override Mapping</Link>
        </nav>
        <Routes>
          <Route path="/mappings" element={<EHRMappingList />} />
          <Route
            path="/mappings/new"
            element={<EHRMappingForm isEdit={false} />}
          />
          <Route
            path="/mappings/edit/:ehrName"
            element={<EHRMappingForm isEdit={true} />}
          />
          <Route path="/bulk" element={<BulkPatientChanges />} />
          <Route path="/override" element={<OverrideMapping />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
