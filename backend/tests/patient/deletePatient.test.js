const request = require("supertest")
const app = require("../../src/app")
const pool = require("../../src/db")

describe("DELETE /api/patients/:patient_id", () => {
  it("should delete a patient and return the deleted patient data", async () => {
    // Step 1: Create a new patient for deletion test
    const newPatient = {
      name: "Test Delete",
      gender: "Male",
      dob: "2000-01-01",
      address: "123 Test Lane",
      phone: "555-1111",
      email: "test.delete@example.com",
      emergency_contact: "Emergency Contact",
      insurance_provider: "Test Insurance",
      insurance_policy_number: "TEST123456",
      primary_care_physician: "Dr. Test",
      allergies: "None",
      current_medications: "None",
      medical_history: "None",
      social_history: "None",
      family_history: "None",
    }

    const createRes = await request(app)
      .post("/api/patients")
      .send(newPatient)
      .set("Accept", "application/json")

    expect(createRes.statusCode).toEqual(201)
    expect(createRes.body).toHaveProperty("patient_id")
    const patientId = createRes.body.patient_id

    // Step 2: Delete the patient using the DELETE endpoint
    const deleteRes = await request(app)
      .delete(`/api/patients/${patientId}`)
      .set("Accept", "application/json")

    expect(deleteRes.statusCode).toEqual(200)
    expect(deleteRes.body).toHaveProperty(
      "message",
      "Patient deleted successfully"
    )
    expect(deleteRes.body).toHaveProperty("patient")
    expect(deleteRes.body.patient).toHaveProperty("id", patientId)

    // Step 3: Attempt to retrieve the deleted patient
    const getRes = await request(app)
      .get(`/api/patients/${patientId}`)
      .set("Accept", "application/json")

    // Expect a 404 response because the patient has been deleted
    expect(getRes.statusCode).toEqual(404)
  })
})

// Ensure the database connection is closed after tests finish
afterAll(async () => {
  await pool.end()
})
