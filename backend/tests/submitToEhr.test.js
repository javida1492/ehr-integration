const request = require("supertest")
const app = require("../src/app")
const pool = require("../src/db")

describe("POST /api/ehr/submit", () => {
  let patientId
  const ehrName = "Athena"

  beforeAll(async () => {
    // Create a test patient
    const newPatient = {
      name: "Test Patient for EHR",
      gender: "Female",
      dob: "2000-01-01",
      address: "123 Test Ave",
      phone: "555-0001",
      email: "test.ehr@example.com",
      emergency_contact: "Emergency Contact",
      insurance_provider: "Test Insurance",
      insurance_policy_number: "INS123",
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
    patientId = createRes.body.patient_id

    // Submit an answer for the "name" question
    const answerPayload = {
      ehr_name: ehrName,
      question_id: "name", // Should map to Athena's "PATIENT_IDENT_NAME"
      answer: newPatient.name,
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
  })

  afterAll(async () => {
    // Cleanup: delete the test patient
    if (patientId) {
      const deleteRes = await request(app)
        .delete(`/api/patients/${patientId}`)
        .set("Accept", "application/json")
      expect(deleteRes.statusCode).toEqual(200)
    }
    await pool.end()
  })

  it("should submit patient data to EHR (Athena) and return a success response", async () => {
    const res = await request(app)
      .post("/api/ehr/submit")
      .send({ patient_id: patientId, ehr_name: ehrName })
      .set("Accept", "application/json")

    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty(
      "message",
      "Data submitted to EHR successfully"
    )
    expect(res.body).toHaveProperty("ehrResponse")
    // Verify that the simulated Athena adapter was called
    expect(res.body.ehrResponse).toHaveProperty(
      "message",
      "Simulated Athena response"
    )
    // Check that the payload mapping contains the expected key/value pair:
    // "PATIENT_IDENT_NAME" should be set to the patient's name.
    expect(res.body.ehrResponse).toHaveProperty("receivedData")
    expect(res.body.ehrResponse.receivedData).toHaveProperty(
      "PATIENT_IDENT_NAME",
      "Test Patient for EHR"
    )
  })
})
