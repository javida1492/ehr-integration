const request = require("supertest")
const app = require("../../src/app.js")
const pool = require("../../src/db.js")

describe("PUT /api/ehr-mappings/:ehr_name", () => {
  const ehrName = "UpdateTestEHR"
  const initialMapping = { field1: "value1", field2: "value2" }
  const updatedMapping = { field1: "updatedValue1", field2: "updatedValue2" }

  beforeAll(async () => {
    // Insert a mapping to update
    await pool.query(
      "INSERT INTO ehr_mappings (ehr_name, mapping) VALUES ($1, $2)",
      [ehrName, initialMapping]
    )
  })

  afterAll(async () => {
    // Clean up the test record
    await pool.query("DELETE FROM ehr_mappings WHERE ehr_name = $1", [ehrName])
    await pool.end()
  })

  it("should update the mapping", async () => {
    const res = await request(app)
      .put(`/api/ehr-mappings/${ehrName}`)
      .send({ mapping: updatedMapping })
      .set("Accept", "application/json")

    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty("message", "Mapping updated successfully")
    expect(res.body).toHaveProperty("mapping")
    expect(res.body.mapping.ehr_name).toEqual(ehrName)
    expect(res.body.mapping.mapping).toEqual(updatedMapping)
  })

  it("should return 404 when updating a non-existent mapping", async () => {
    const res = await request(app)
      .put("/api/ehr-mappings/nonexistent")
      .send({ mapping: updatedMapping })
      .set("Accept", "application/json")

    expect(res.statusCode).toEqual(404)
    expect(res.body).toHaveProperty("error", "Mapping not found")
  })
})
