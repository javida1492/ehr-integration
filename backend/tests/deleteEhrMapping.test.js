const request = require("supertest")
const app = require("../src/app.js")
const pool = require("../src/db")

describe("DELETE /api/ehr-mappings/:ehr_name", () => {
  const ehrName = "DeleteTestEHR"
  const mappingData = { field1: "value1", field2: "value2" }

  beforeEach(async () => {
    // Insert a mapping to delete for each test
    await pool.query(
      "INSERT INTO ehr_mappings (ehr_name, mapping) VALUES ($1, $2)",
      [ehrName, mappingData]
    )
  })

  afterEach(async () => {
    // Ensure the mapping is removed after each test
    await pool.query("DELETE FROM ehr_mappings WHERE ehr_name = $1", [ehrName])
  })

  afterAll(async () => {
    await pool.end()
  })

  it("should delete the mapping", async () => {
    const res = await request(app)
      .delete(`/api/ehr-mappings/${ehrName}`)
      .set("Accept", "application/json")

    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty("message", "Mapping deleted successfully")
    expect(res.body).toHaveProperty("mapping")
    expect(res.body.mapping.ehr_name).toEqual(ehrName)
  })

  it("should return 404 when deleting a non-existent mapping", async () => {
    // First, delete the mapping
    await pool.query("DELETE FROM ehr_mappings WHERE ehr_name = $1", [ehrName])

    const res = await request(app)
      .delete(`/api/ehr-mappings/${ehrName}`)
      .set("Accept", "application/json")

    expect(res.statusCode).toEqual(404)
    expect(res.body).toHaveProperty("error", "Mapping not found")
  })
})
