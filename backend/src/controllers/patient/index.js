const createPatient = require("./createPatient")
const getPatient = require("./getPatient")
const updatePatient = require("./updatePatient")
const submitAnswer = require("./submitAnswer")
const getAnswers = require("./getAnswers")
const getAllPatients = require("./getAllPatients")
const deletePatient = require("./deletePatient")

module.exports = {
  createPatient: createPatient.createPatient,
  getPatient: getPatient.getPatient,
  updatePatient: updatePatient.updatePatient,
  submitAnswer: submitAnswer.submitAnswer,
  getAnswers: getAnswers.getAnswers,
  getAllPatients: getAllPatients.getAllPatients,
  deletePatient: deletePatient.deletePatient,
}
