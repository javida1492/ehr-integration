const createMapping = require("./createMapping")
const getMapping = require("./getMapping")
const updateMapping = require("./updateMapping")
const deleteMapping = require("./deleteMapping")

module.exports = {
  createMapping: createMapping.createMapping,
  getMapping: getMapping.getMapping,
  updateMapping: updateMapping.updateMapping,
  deleteMapping: deleteMapping.deleteMapping,
}
