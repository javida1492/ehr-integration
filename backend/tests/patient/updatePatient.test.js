const request = require("supertest")
const app = require("../../src/app")
const pool = require("../../src/db")

describe("PUT /api/patients/:patient_id", () => {
  let patientId // To store the created patient's ID
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

  beforeAll(async () => {
    // Create a new patient
    const createRes = await request(app)
      .post("/api/patients")
      .send(newPatient)
      .set("Accept", "application/json")

    expect(createRes.statusCode).toEqual(201)
    expect(createRes.body).toHaveProperty("patient_id")
    patientId = createRes.body.patient_id
  })

  it("should partially update an existing patient", async () => {
    // We only update the address and phone fields
    const partialUpdate = {
      address: "789 Updated Ave",
      phone: "555-9876",
    }

    const updateRes = await request(app)
      .put(`/api/patients/${patientId}`)
      .send(partialUpdate)
      .set("Accept", "application/json")

    expect(updateRes.statusCode).toEqual(200)
    // Verify that the updated fields are changed
    expect(updateRes.body.patient.address).toEqual(partialUpdate.address)
    expect(updateRes.body.patient.phone).toEqual(partialUpdate.phone)
    // Verify that the other fields remain unchanged (e.g., name remains the same)
    expect(updateRes.body.patient.name).toEqual(newPatient.name)
  })

  // Cleanup: Delete the patient after tests complete
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
