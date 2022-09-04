const mongoose = require("mongoose");
const PoliceOfficer = require("../models/policeOfficer");
const DepartmentSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },
    policeOfficerList: [
      { type: mongoose.Types.ObjectId, ref: "policeOfficer" },
    ],
  },
  { timestamps: true }
);
//Methods
DepartmentSchema.statics.addPoliceOfficer = addPoliceOfficer;
DepartmentSchema.statics.createDepartment = createDepartment;
DepartmentSchema.statics.getDepartments = getDepartments;
DepartmentSchema.statics.transferPoliceOfficer = transferPoliceOfficer;
DepartmentSchema.statics.removePoliceOfficer = removePoliceOfficer;

module.exports = mongoose.model("department", DepartmentSchema, "departments");

//Statics Methods
function addPoliceOfficer(departmentId, policeOfficerId) {
  if (!policeOfficerId) throw new Error("Officer Id required");
  if (!departmentId) throw new Error("Department Id required");

  return this.findById(departmentId).then((department) => {
    if (!department) throw new Error("Department not found");
    const exist = department.policeOfficerList.includes(policeOfficerId);
    if (exist) throw new Error("Police Officer is already in this department ");

    return PoliceOfficer.findById(policeOfficerId).then((policeOfficer) => {
      if (!policeOfficer) throw new Error("Police Officer not found");

      let session = null;

      return mongoose
        .startSession()
        .then((_session) => {
          session = _session;
          session.startTransaction();
          policeOfficer.department = department;
          policeOfficer.save({ session });

          department.policeOfficerList.push(policeOfficer);
          department.save({ session });
          session.commitTransaction();
        })
        .then(() => session.endSession())
        .catch(() => session.abortTransaction());
    });
  });
}
function createDepartment(departmentInfo) {
  if (!departmentInfo.name) throw new Error("name required");
  if (!departmentInfo.city) throw new Error("city required");
  const newDepartment = new this(departmentInfo);

  return newDepartment.save();
}
function getDepartments() {
  return this.find();
}
function transferPoliceOfficer(newDepartmentId, policeOfficerId) {
  if (!newDepartmentId) throw new Error("new DepartmentId required");
  //   if (!oldDepartmentId) throw new Error("old DepartmentId required");
  if (!policeOfficerId) throw new Error("policeOfficerId required");

  //
  removePoliceOfficer(policeOfficerId);
}
function removePoliceOfficer(policeOfficerId) {
  if (!policeOfficerId) throw new Error("policeOfficerId required");

  return PoliceOfficer.findById(policeOfficerId)
    .populate("department")
    .then((policeOfficer) => {
      //delete officer from department
      policeOfficer.department.policeOfficerList.pull(policeOfficerId);
      policeOfficer.department.save();

      //remove department from policeOfficer
      policeOfficer.department = null;
      policeOfficer.save();
    });
}
