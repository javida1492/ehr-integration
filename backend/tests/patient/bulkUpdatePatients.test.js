const request = require("supertest")
const app = require("../../src/app")
const pool = require("../../src/db")

describe("POST /api/patients/bulk-update", () => {
  let testPatientIds = []

  beforeAll(async () => {
    // Create test patients with insurance_provider "Test Insurance"
    const patients = [
      {
        name: "Bulk Patient 1",
        gender: "Male",
        dob: "1990-01-01",
        address: "Old Address 1",
        phone: "555-0001",
        email: "bulk1@example.com",
        emergency_contact: "Contact 1",
        insurance_provider: "Test Insurance",
        insurance_policy_number: "T0001",
        primary_care_physician: "Dr. Bulk",
        allergies: "None",
        current_medications: "None",
        medical_history: "None",
        social_history: "None",
        family_history: "None",
      },
      {
        name: "Bulk Patient 2",
        gender: "Female",
        dob: "1991-01-01",
        address: "Old Address 2",
        phone: "555-0002",
        email: "bulk2@example.com",
        emergency_contact: "Contact 2",
        insurance_provider: "Test Insurance",
        insurance_policy_number: "T0002",
        primary_care_physician: "Dr. Bulk",
        allergies: "None",
        current_medications: "None",
        medical_history: "None",
        social_history: "None",
        family_history: "None",
      },
    ]

    for (const patient of patients) {
      const res = await request(app)
        .post("/api/patients")
        .send(patient)
        .set("Accept", "application/json")
      expect(res.statusCode).toEqual(201)
      expect(res.body).toHaveProperty("patient_id")
      testPatientIds.push(res.body.patient_id)
    }
  })

  afterAll(async () => {
    // Clean up: Delete test patients
    for (const patientId of testPatientIds) {
      await request(app)
        .delete(`/api/patients/${patientId}`)
        .set("Accept", "application/json")
    }
    await pool.end()
  })

  it("should update bulk patients for a given insurance provider", async () => {
    const filter = { insurance_provider: "Test Insurance" }
    const updateData = { address: "Updated Bulk Address" }

    const res = await request(app)
      .post("/api/patients/bulk-update")
      .send({ filter, updateData })
      .set("Accept", "application/json")

    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty("message", "Bulk update successful")
    expect(res.body).toHaveProperty("updatedPatients")

    // Verify that each updated patient has the new address.
    res.body.updatedPatients.forEach((patient) => {
      expect(patient.address).toEqual("Updated Bulk Address")
    })
  })
})
