const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const User = require("./user");
const CaseSchema = mongoose.Schema(
  {
    assignedOfficer: {
      type: mongoose.Types.ObjectId,
      ref: "policeOfficer",
      default: null,
      // unique: true,
    },
    stolenBike: {
      type: mongoose.Types.ObjectId,
      ref: "bike",
      required: true,
      // unique: true,
    },
    active: { type: Boolean, default: false }, //status
    descriptionTheft: { type: String, required: true },
    dateTheft: { type: Date },
    locationTheft: { type: Object, required: true },
    resolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

CaseSchema.statics.openNewCase = openNewCase;
CaseSchema.statics.getCases = getCases;
CaseSchema.statics.notifyUser = notifyUser;
CaseSchema.statics.getCaseById = getCaseById;
CaseSchema.statics.checkCase = checkCase;

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
function notifyUser(user) {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_KEY,
    },
  });
  const result = this.checkCase(user._id);
  console.log(result);
  const URL = `${process.env.API_GATEWAY_URL}/case/${"caseID"}`;
  //verificar transporter
  return transporter.sendMail({
    from: process.env.MAIL_ADMIN,
    to: user.email,
    subject: "Your case has changed.",
    html: `
    <h4>Hi ${user.fullname}

    <p>Go and check your case <a href="${URL}">HERE</a></p>
    `,
  });
}
function getCaseById(caseId) {
  return this.findById(caseId);
}
function solveCase(caseInfo) {
  //free agent
  //case solved
}
function checkCase(userId) {
  return User.findById(userId)
    .populate("stolenBikes")
    .then((user) => {
      return user.stolenBikes.map((bike) => bike.case);
    });
}
