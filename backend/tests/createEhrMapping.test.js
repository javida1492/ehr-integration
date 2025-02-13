const request = require("supertest")
const app = require("../src/app.js")
const pool = require("../src/db")

describe("POST /api/ehr-mappings", () => {
  const ehrName = "CreateTestEHR"
  const mappingData = { field1: "value1", field2: "value2" }

  afterAll(async () => {
    // Clean up the created mapping (if it still exists)
    await pool.query("DELETE FROM ehr_mappings WHERE ehr_name = $1", [ehrName])
    await pool.end()
  })

  it("should create a new mapping and return 201", async () => {
    const res = await request(app)
      .post("/api/ehr-mappings")
      .send({ ehr_name: ehrName, mapping: mappingData })
      .set("Accept", "application/json")

    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty("message", "Mapping created successfully")
    expect(res.body).toHaveProperty("mapping")
    expect(res.body.mapping.ehr_name).toEqual(ehrName)
    expect(res.body.mapping.mapping).toEqual(mappingData)
  })
})
