const request = require("supertest")
const app = require("../src/app.js")
const pool = require("../src/db")

describe("GET /api/ehr-mappings/:ehr_name", () => {
  const ehrName = "GetTestEHR"
  const mappingData = { field1: "value1", field2: "value2" }

  beforeAll(async () => {
    // Insert a mapping to retrieve
    await pool.query(
      "INSERT INTO ehr_mappings (ehr_name, mapping) VALUES ($1, $2)",
      [ehrName, mappingData]
    )
  })

  afterAll(async () => {
    // Clean up the test record
    await pool.query("DELETE FROM ehr_mappings WHERE ehr_name = $1", [ehrName])
    await pool.end()
  })

  it("should return the mapping for the given ehr_name", async () => {
    const res = await request(app)
      .get(`/api/ehr-mappings/${ehrName}`)
      .set("Accept", "application/json")

    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty("ehr_name", ehrName)
    expect(res.body).toHaveProperty("mapping")
    expect(res.body.mapping).toEqual(mappingData)
  })

  it("should return 404 for a non-existent ehr_name", async () => {
    const res = await request(app)
      .get("/api/ehr-mappings/nonexistent")
      .set("Accept", "application/json")

    expect(res.statusCode).toEqual(404)
    expect(res.body).toHaveProperty("error", "Mapping not found")
  })
})
