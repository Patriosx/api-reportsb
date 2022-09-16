const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { isValidEmail } = require("../helpers");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const policeOfficerSchema = mongoose.Schema(
  {
    fullname: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    emailVerified: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false }, //director
    free: { type: Boolean, default: true }, //ready to take a case
    department: {
      type: mongoose.Types.ObjectId,
      ref: "department",
      default: null,
    },
  },
  { timestamps: true }
);

//Methods
policeOfficerSchema.statics.signup = signup;
policeOfficerSchema.statics.getPolice = getPolice;
policeOfficerSchema.statics.getPoliceOfficerById = getPoliceOfficerById;
policeOfficerSchema.statics.login = login;
policeOfficerSchema.statics.confirmAccount = confirmAccount;
policeOfficerSchema.statics.updatePoliceOfficer = updatePoliceOfficer;
policeOfficerSchema.statics.updatePassword = updatePassword;
policeOfficerSchema.statics.deleteAccount = deleteAccount;
policeOfficerSchema.statics.searchFreeAgent = searchFreeAgent;
policeOfficerSchema.statics.releasePoliceOfficerFromCase =
  releasePoliceOfficerFromCase;
policeOfficerSchema.statics.givePoliceOfficerToCase = givePoliceOfficerToCase;

module.exports = mongoose.model(
  "policeOfficer",
  policeOfficerSchema,
  "polices"
);

//Static methods
function signup(policeOfficerInfo) {
  //Validations
  if (!policeOfficerInfo.email || !isValidEmail(policeOfficerInfo.email))
    throw new Error("Email is not valid");
  if (!policeOfficerInfo.fullname) throw new Error("name is required");
  if (!policeOfficerInfo.password) throw new Error("password is required");
  if (!policeOfficerInfo.address) throw new Error("address is required");

  return this.findOne({ email: policeOfficerInfo.email })
    .then((policeOfficer) => {
      if (policeOfficer) throw new Error("policeOfficer already exists");

      const newOfficer = {
        email: policeOfficerInfo.email,
        fullname: policeOfficerInfo.fullname,
        password: bcrypt.hashSync(policeOfficerInfo.password),
        phone: policeOfficerInfo.phone,
        currentLocation: policeOfficerInfo.currentLocation,
        address: policeOfficerInfo.address,
      };

      return this.create(newOfficer);
    })
    .then((policeCreated) => sendConfirmationAccount(policeCreated))
    .then((policeOfficer) => policeOfficer);
}
function updatePoliceOfficer(policeOfficerId, body) {
  return this.findByIdAndUpdate(
    policeOfficerId,
    { $set: body },
    { new: true }
  ).then((policeOfficer) => policeOfficer);
}
function sendConfirmationAccount(policeOfficer) {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_KEY,
    },
  });
  //creamos token para enviar el email dentro
  const token = jwt.sign(
    { email: policeOfficer.email },
    process.env.SECRET_TOKEN
  );
  const urlConfirmation = `${process.env.API_GATEWAY_URL}/police/confirm/${token}`;

  //verificar transporter
  transporter.sendMail({
    from: process.env.MAIL_ADMIN,
    to: policeOfficer.email,
    subject: "Please confirm your email.",
    html: `<p>Confirm your email <a href="${urlConfirmation}">here<a/></p>`,
  });
  return policeOfficer;
}
function confirmAccount(token) {
  let email = null;

  try {
    const payload = jwt.verify(token, process.env.SECRET_TOKEN);
    email = payload.email;
  } catch (error) {
    throw new Error("invalid token");
  }

  return this.findOne({ email }).then((policeOfficer) => {
    if (!policeOfficer) throw new Error("policeOfficer not found");
    if (policeOfficer.emailVerified)
      throw new Error("policeOfficer already verified");

    policeOfficer.emailVerified = true;
    return policeOfficer.save();
  });
}
function getPolice() {
  return this.find();
}
function getPoliceOfficerById(id) {
  if (!id) throw new Error("officer Id required");
  return this.findById(id).then((officer) => {
    if (!officer) throw new Error("officer not found");
    return officer;
  });
}
function login(emailInput, passwordInput) {
  if (!emailInput) throw new Error("email is required");
  if (!passwordInput) throw new Error("password is required");
  //comprueba el formato del email
  if (!isValidEmail(emailInput)) throw new Error("email not valid");

  return this.findOne({ email: emailInput }).then((policeOfficer) => {
    //validations
    if (!policeOfficer) throw new Error("incorrect credentials");
    if (!policeOfficer.emailVerified) throw new Error("account not verified");

    const isPasswordCorrect = bcrypt.compareSync(
      passwordInput,
      policeOfficer.password
    );
    if (!isPasswordCorrect) throw new Error("incorrect credentials");
    const policeObj = {
      _id: policeOfficer._id,
      email: policeOfficer.email,
      name: policeOfficer.fullname,
      isAdmin: policeOfficer.isAdmin,
      department: policeOfficer.department,
    };

    const access_token = jwt.sign(
      Object.assign({}, policeObj),
      process.env.SECRET_TOKEN,
      { expiresIn: 60 * 60 * 4 }
    );

    //return token signed with a secret key
    return { access_token };
  });
}
function updatePassword(policeOfficerId, oldPassword, newPassword) {
  return this.findById(policeOfficerId).then((policeOfficer) => {
    if (!policeOfficer) throw new Error("officer not found");
    const isPasswordCorrect = bcrypt.compareSync(
      oldPassword,
      policeOfficer.password
    );
    if (!isPasswordCorrect) throw new Error("incorrect credentials");

    policeOfficer.password = bcrypt.hashSync(newPassword);
    policeOfficer.save();
  });
}
function deleteAccount(policeOfficerId) {
  return this.findByIdAndDelete(policeOfficerId).then((policeOfficer) => {
    if (!policeOfficer) throw new Error("officer not found");
    return policeOfficer;
  });
}
function searchFreeAgent() {
  return this.find({ free: { $eq: true } });
}
function releasePoliceOfficerFromCase(policeOfficerId) {
  if (!policeOfficerId) throw new Error("policeOfficerId required");
  return this.getPoliceOfficerById(policeOfficerId).then((policeOfficer) => {
    if (!policeOfficer) throw new Error("officer not found");
    policeOfficer.free = true;
    return policeOfficer.save();
  });
}
function givePoliceOfficerToCase(policeOfficerId) {
  if (!policeOfficerId) throw new Error("policeOfficer Id required");
  return this.getPoliceOfficerById(policeOfficerId).then((policeOfficer) => {
    if (!policeOfficer) throw new Error("officer not found");

    policeOfficer.free = false;
    return policeOfficer.save();
  });
}
