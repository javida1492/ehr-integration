// backend/tests/getPatient.test.js
const request = require("supertest")
const app = require("../../src/app")
const pool = require("../../src/db")

describe("GET /api/patients/:patient_id", () => {
  it("should retrieve a patient by ID", async () => {
    const newPatient = {
      name: "Jane Doe",
      gender: "Female",
      dob: "1985-05-15",
      address: "456 Main St",
      phone: "555-5678",
      email: "jane.doe@example.com",
      emergency_contact: "John Doe",
      insurance_provider: "Beta Insurance",
      insurance_policy_number: "B987654321",
      primary_care_physician: "Dr. Brown",
      allergies: "Penicillin",
      current_medications: "Aspirin",
      medical_history: "Asthma",
      social_history: "Non-smoker",
      family_history: "Diabetes",
    }

    const createRes = await request(app)
      .post("/api/patients")
      .send(newPatient)
      .set("Accept", "application/json")

    const patientId = createRes.body.patient_id

    // Retrieve the patient by ID
    const res = await request(app)
      .get(`/api/patients/${patientId}`)
      .set("Accept", "application/json")

    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty("name", newPatient.name)

    // Delete the patient using the DELETE endpoint
    const deleteRes = await request(app)
      .delete(`/api/patients/${patientId}`)
      .set("Accept", "application/json")

    expect(deleteRes.statusCode).toEqual(200)
    expect(deleteRes.body).toHaveProperty(
      "message",
      "Patient deleted successfully"
    )

    // Attempt to retrieve the deleted patient, expecting a 404 error
    const getAfterDeleteRes = await request(app)
      .get(`/api/patients/${patientId}`)
      .set("Accept", "application/json")

    expect(getAfterDeleteRes.statusCode).toEqual(404)
  })
})

// Close the database pool after all tests
afterAll(async () => {
  await pool.end()
})
