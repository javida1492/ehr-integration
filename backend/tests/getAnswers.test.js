// backend/tests/getAnswers.test.js
const request = require("supertest")
const app = require("../src/app")
const pool = require("../src/db")

describe("GET /api/patients/:patient_id/answers", () => {
  it("should retrieve all answers for a patient", async () => {
    const newPatient = {
      name: "Bob Johnson",
      gender: "Male",
      dob: "1988-08-08",
      address: "456 Sample Rd",
      phone: "555-2222",
      email: "bob.johnson@example.com",
      emergency_contact: "Alice Johnson",
      insurance_provider: "Sample Insurance",
      insurance_policy_number: "S987654321",
      primary_care_physician: "Dr. Sample",
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

    // Submit an answer for the patient
    const answerPayload = {
      ehr_name: "Athena",
      question_id: "name",
      answer: "Bob Johnson",
    }

    await request(app)
      .post(`/api/patients/${patientId}/answers`)
      .send(answerPayload)
      .set("Accept", "application/json")

    // Retrieve the answers
    const res = await request(app)
      .get(`/api/patients/${patientId}/answers`)
      .set("Accept", "application/json")

    expect(res.statusCode).toEqual(200)
    expect(Array.isArray(res.body)).toBe(true)
    const answer = res.body.find((item) => item.question_id === "name")
    expect(answer).toBeDefined()
    expect(answer.answer).toEqual("Bob Johnson")
  })
})

// Close the database pool after all tests
afterAll(async () => {
  await pool.end()
})
