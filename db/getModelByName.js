const mongoose = require("mongoose");
require("../models/user");
require("../models/bike");

function getModelByName(name) {
  return mongoose.model(name);
}
module.exports = getModelByName;
