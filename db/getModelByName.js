const mongoose = require("mongoose");
require("../models/user");
require("../models/bike");
require("../models/policeOfficer");
require("../models/case");
require("../models/department");

function getModelByName(name) {
  return mongoose.model(name);
}
module.exports = getModelByName;
