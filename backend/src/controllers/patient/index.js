const createPatient = require("./createPatient")
const getPatient = require("./getPatient")
const updatePatient = require("./updatePatient")
const submitAnswer = require("./submitAnswer")
const getAnswers = require("./getAnswers")
const getAllPatients = require("./getAllPatients")
const deletePatient = require("./deletePatient")
const bulkUpdatePatients = require("./bulkUpdatePatients")

module.exports = {
  createPatient,
  getPatient,
  updatePatient,
  submitAnswer,
  getAnswers,
  getAllPatients,
  deletePatient,
  bulkUpdatePatients,
}
