const request = require("supertest")
const app = require("../../src/app")
const pool = require("../../src/db")

describe("GET /api/patients/:patient_id/answers", () => {
  let patientId // Variable to store the created patient's ID

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

    // Create a new patient
    const createRes = await request(app)
      .post("/api/patients")
      .send(newPatient)
      .set("Accept", "application/json")

    expect(createRes.statusCode).toEqual(201)
    expect(createRes.body).toHaveProperty("patient_id")
    patientId = createRes.body.patient_id

    // Submit an answer for the patient
    const answerPayload = {
      ehr_name: "Athena",
      question_id: "name",
      answer: "Bob Johnson",
    }

    const answerRes = await request(app)
      .post(`/api/patients/${patientId}/answers`)
      .send(answerPayload)
      .set("Accept", "application/json")

    expect(answerRes.statusCode).toEqual(200)
    expect(answerRes.body).toHaveProperty(
      "message",
      "Answer saved successfully"
    )

    // Retrieve the answers for the patient
    const res = await request(app)
      .get(`/api/patients/${patientId}/answers`)
      .set("Accept", "application/json")

    expect(res.statusCode).toEqual(200)
    expect(Array.isArray(res.body)).toBe(true)
    const answer = res.body.find((item) => item.question_id === "name")
    expect(answer).toBeDefined()
    expect(answer.answer).toEqual("Bob Johnson")
  })

  // Cleanup: Delete the patient after the test completes
  afterAll(async () => {
    if (patientId) {
      const deleteRes = await request(app)
        .delete(`/api/patients/${patientId}`)
        .set("Accept", "application/json")
      expect(deleteRes.statusCode).toEqual(200)
    }
    // Close the database pool to prevent open handles
    await pool.end()
  })
})
