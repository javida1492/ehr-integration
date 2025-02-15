const request = require("supertest")
const app = require("../../src/app.js")
const pool = require("../../src/db.js")

describe("POST /api/patients", () => {
  let patientId

  it("should create a new patient and return 201 with a patient_id", async () => {
    const newPatient = {
      name: "Test user",
      gender: "Male",
      dob: "1990-01-01",
      address: "123 Main St",
      phone: "555-1234",
      email: "test@example.com",
      emergency_contact: "Test User 2",
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

    patientId = res.body.patient_id
  })

  afterAll(async () => {
    if (patientId) {
      const deleteRes = await request(app)
        .delete(`/api/patients/${patientId}`)
        .set("Accept", "application/json")
      expect(deleteRes.statusCode).toEqual(200)
    }
    await pool.end()
  })
})
