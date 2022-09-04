const mongoose = require("mongoose");

const CaseSchema = mongoose.Schema(
  {
    assignedOfficer: { type: mongoose.Types.ObjectId, ref: "policeOfficer" },
    stolenBike: { type: mongoose.Types.ObjectId, ref: "bike" },
    active: { type: Boolean, default: false }, //status
    descriptionTheft: { type: String },
    date: { type: Date },
    locationTheft: { type: Object },
  },
  { timestamps: true }
);

CaseSchema.statics.openNewCase = openNewCase;

//modelo, schema, tablas
module.exports = mongoose.model("case", CaseSchema, "cases");

//Static Methods
function openNewCase(caseInfo) {
  return this.find(caseInfo);
}
