const getModelByName = require("../db/getModelByName");
const { createError } = require("../helpers");

module.exports.openNewCase = (req, res, next) => {
  const { body } = req;

  const Case = getModelByName("case");

  return Case.openNewCase(body);
};
