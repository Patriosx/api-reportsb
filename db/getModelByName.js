const mongoose = require("mongoose");
require("../models/user");
require("../models/bike");
require("../models/police");

function getModelByName(name) {
  return mongoose.model(name);
}
module.exports = getModelByName;
