// backend/tests/submitAnswer.test.js
const request = require("supertest")
const app = require("../src/app")
const pool = require("../src/db")

describe("POST /api/patients/:patient_id/answers", () => {
  it("should submit or update a patient answer", async () => {
    const newPatient = {
      name: "Alice Smith",
      gender: "Female",
      dob: "1992-02-02",
      address: "321 Test Blvd",
      phone: "555-1111",
      email: "alice.smith@example.com",
      emergency_contact: "Bob Smith",
      insurance_provider: "Test Insurance",
      insurance_policy_number: "T123456789",
      primary_care_physician: "Dr. Test",
      allergies: "None",
      current_medications: "None",
      medical_history: "None",
      social_history: "Non-smoker",
      family_history: "None",
    }

    const createRes = await request(app)
      .post("/api/patients")
      .send(newPatient)
      .set("Accept", "application/json")

    const patientId = createRes.body.patient_id

    const answerPayload = {
      ehr_name: "Athena",
      question_id: "name", // Based on your mapping, this maps to "PATIENT_IDENT_NAME" for Athena
      answer: "Alice Smith",
    }

    const res = await request(app)
      .post(`/api/patients/${patientId}/answers`)
      .send(answerPayload)
      .set("Accept", "application/json")

    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty("message", "Answer saved successfully")
  })
})

// Close the database pool after all tests
afterAll(async () => {
  await pool.end()
})
