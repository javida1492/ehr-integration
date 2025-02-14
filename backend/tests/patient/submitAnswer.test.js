// backend/tests/submitAnswer.test.js
const request = require("supertest")
const app = require("../../src/app")
const pool = require("../../src/db")

describe("POST /api/patients/:patient_id/answers", () => {
  let patientId // Declare a variable to store the created patient ID

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

    // Create a new patient
    const createRes = await request(app)
      .post("/api/patients")
      .send(newPatient)
      .set("Accept", "application/json")

    expect(createRes.statusCode).toEqual(201)
    expect(createRes.body).toHaveProperty("patient_id")
    patientId = createRes.body.patient_id

    // Define the answer payload based on your mapping (question_id "name" maps to Athena's "PATIENT_IDENT_NAME")
    const answerPayload = {
      ehr_name: "Athena",
      question_id: "name",
      answer: "Alice Smith",
    }

    // Submit the patient answer
    const res = await request(app)
      .post(`/api/patients/${patientId}/answers`)
      .send(answerPayload)
      .set("Accept", "application/json")

    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty("message", "Answer saved successfully")
  })

  // Cleanup: delete the patient after tests complete
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
