const express = require("express")
const dotenv = require("dotenv")

dotenv.config()

const app = express()

app.use(express.json())

const patientRoutes = require("./routes/patientRoutes")
const ehrRoutes = require("./routes/ehrRoutes")
const ehrMappingsRoutes = require("./routes/ehrMappingsRoutes")

app.use("/api/patients", patientRoutes)
app.use("/api/ehr", ehrRoutes)
app.use("/api/ehr-mappings", ehrMappingsRoutes)

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send("Something broke!")
})

module.exports = app
