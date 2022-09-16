const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const User = require("./user");
const CaseSchema = mongoose.Schema(
  {
    assignedOfficer: {
      type: mongoose.Types.ObjectId,
      ref: "policeOfficer",
      default: null,
      unique: false,
    },
    stolenBike: {
      type: mongoose.Types.ObjectId,
      ref: "bike",
      required: true,
      unique: true,
    },
    active: { type: Boolean, default: false }, //status
    descriptionTheft: { type: String, required: true },
    dateTheft: { type: Date },
    locationTheft: { type: Object, required: true },
    solved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

CaseSchema.statics.openNewCase = openNewCase;
CaseSchema.statics.getCases = getCases;
CaseSchema.statics.notifyUser = notifyUser;
CaseSchema.statics.getCaseById = getCaseById;
CaseSchema.statics.getCasesByUser = getCasesByUser;
CaseSchema.statics.solveCase = solveCase;
CaseSchema.statics.searchPendingCase = searchPendingCase;
CaseSchema.statics.addPoliceOfficerToCase = addPoliceOfficerToCase;

//modelo, schema, tablas
module.exports = mongoose.model("case", CaseSchema, "cases");

//Static Methods
function openNewCase(caseInfo) {
  if (!caseInfo.descriptionTheft)
    throw new Error("description of Theft required");
  if (!caseInfo.locationTheft) throw new Error("location of Theft required");
  if (!caseInfo.dateTheft) throw new Error("date of Theft required");

  const newCase = new this(caseInfo);
  return newCase.save();
}
function getCases() {
  return this.find();
}
async function notifyUser(user) {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_KEY,
    },
  });
  const URL = `${process.env.API_GATEWAY_URL}/case`;
  const result = await this.getCasesByUser(user._id);

  const renderCases = result.map((caseId) => {
    if (caseId !== null)
      return ` <p>
        Go and check your case <a href="${URL}/${caseId}">${caseId}</a>
      </p>`;
  });

  //verificar transporter
  return transporter.sendMail({
    from: process.env.MAIL_ADMIN,
    to: user.email,
    subject: "Your case has changed.",
    html: `
    <h4>Hi ${user.fullname}
      ${renderCases}
    
    `,
  });
}
function getCaseById(caseId) {
  return this.findById(caseId).then((caseData) => {
    if (!caseData) throw new Error("Case not found");
    return caseData;
  });
}
function solveCase(caseId) {
  if (!caseId) throw new Error("case ID required");
  //case solved
  return this.findById(caseId).then((caseData) => {
    caseData.solved = true;
    caseData.active = false;
    return caseData.save();
  });
}
//get cases by user
function getCasesByUser(userId) {
  return User.findById(userId)
    .populate("stolenBikes")
    .then((user) => {
      if (!user) throw new Error("user not found");
      return user.stolenBikes.map((bike) => bike.case);
    });
}
function searchPendingCase() {
  return this.find({
    $and: [{ active: { $eq: false } }, { solved: { $eq: false } }],
  });
}
function addPoliceOfficerToCase(policeOfficerId, caseId) {
  return this.findById(caseId).then((caseData) => {
    if (!caseData) throw new Error("Case not found");

    caseData.assignedOfficer = policeOfficerId;
    return caseData.save();
  });
}
