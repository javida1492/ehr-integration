// backend/tests/createPatient.test.js
const request = require("supertest")
const app = require("../src/app.js")
const pool = require("../src/db")

describe("POST /api/patients", () => {
  it("should create a new patient and return 201 with a patient_id", async () => {
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

    const res = await request(app)
      .post("/api/patients")
      .send(newPatient)
      .set("Accept", "application/json")

    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty("patient_id")
    expect(typeof res.body.patient_id).toBe("string")
  })
})

afterAll(async () => {
  await pool.end()
})
