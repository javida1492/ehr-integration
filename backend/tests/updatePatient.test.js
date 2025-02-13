// backend/tests/updatePatient.test.js
const request = require("supertest")
const app = require("../src/app")
const pool = require("../src/db")

describe("PUT /api/patients/:patient_id", () => {
  it("should update an existing patient", async () => {
    const newPatient = {
      name: "John Doe",
      gender: "Male",
      dob: "1990-01-01",
      address: "123 Main St",
      phone: "555-1234",
      email: "john.doe@example.com",
      emergency_contact: "Jane Doe",
      insurance_provider: "Acme Insurance",
      insurance_policy_number: "A123456789",
      primary_care_physician: "Dr. Smith",
      allergies: "None",
      current_medications: "None",
      medical_history: "None",
      social_history: "Non-smoker",
      family_history: "No significant history",
    }

    const createRes = await request(app)
      .post("/api/patients")
      .send(newPatient)
      .set("Accept", "application/json")

    const patientId = createRes.body.patient_id

    const updatedPatient = {
      name: "John Doe Updated",
      gender: "Male",
      dob: "1990-01-01",
      address: "789 Updated Ave",
      phone: "555-9876",
      email: "john.updated@example.com",
      emergency_contact: "Jane Updated",
      insurance_provider: "Updated Insurance",
      insurance_policy_number: "U123456789",
      primary_care_physician: "Dr. Updated",
      allergies: "None",
      current_medications: "None",
      medical_history: "None",
      social_history: "Non-smoker",
      family_history: "No significant history",
    }

    const updateRes = await request(app)
      .put(`/api/patients/${patientId}`)
      .send(updatedPatient)
      .set("Accept", "application/json")

    expect(updateRes.statusCode).toEqual(200)
    expect(updateRes.body).toHaveProperty("patient")
    expect(updateRes.body.patient).toHaveProperty(
      "address",
      updatedPatient.address
    )
  })
})

// Close the database pool after all tests
afterAll(async () => {
  await pool.end()
})
