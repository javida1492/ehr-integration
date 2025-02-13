// backend/src/app.js
const express = require("express")
const dotenv = require("dotenv")

dotenv.config()

const app = express()

// Middleware to parse JSON requests
app.use(express.json())

// Import routes
const patientRoutes = require("./routes/patientRoutes")
const ehrRoutes = require("./routes/ehrRoutes")

// Use the routes
app.use("/api/patients", patientRoutes)
app.use("/api/ehr", ehrRoutes)

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send("Something broke!")
})

// Export the app without starting the server
module.exports = app
