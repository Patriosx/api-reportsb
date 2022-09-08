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

  return (
    this.findOne({ email: policeOfficerInfo.email })
      .then((policeOfficer) => {
        if (policeOfficer) throw new Error("policeOfficer already exists");

        const newpolice = {
          email: policeOfficerInfo.email,
          fullname: policeOfficerInfo.fullname,
          password: bcrypt.hashSync(policeOfficerInfo.password),
          phone: policeOfficerInfo.phone,
          currentLocation: policeOfficerInfo.currentLocation,
          address: policeOfficerInfo.address,
        };

        return this.create(newpolice);
      })
      // .then((policeCreated) => sendConfirmationAccount(policeCreated))
      .then((policeOfficer) => policeOfficer)
  );
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
    host: /**/ process.env.SMTP_HOST /**/ /* "smtp.ionos.es"*/,
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
      policeOfficer:
        /**/ process.env.SMTP_police /** "noreply@Movilidadelectrica.club"*/,
      pass: /**/ process.env.SMTP_KEY /**  "5X8A&DX3kYD$6Yoe4F;dr3"**/,
    },
  });
  //creamos token para enviar el email dentro
  const token = jwt.sign(
    { email: policeOfficer.email },
    process.env.SECRET_TOKEN
  );
  const urlConfirmation = `${process.env.API_GATEWAY_URL}/account/confirm/${token}`;

  //verificar transporter
  return transporter.sendMail({
    from: /**/ process.env.MAIL_ADMIN /**/ /*"desarrollo@click2luck.com"*/,
    to: policeOfficer.email,
    subject: "Please confirm your email.",
    html: `<p>Confirm your email <a href="${urlConfirmation}">here<a/></p>`,
  });
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
  return this.find().then((policeOfficers) => policeOfficers);
}
function getPoliceOfficerById(id) {
  return this.findById(id).then((policeOfficer) => policeOfficer);
}
function login(emailInput, passwordInput) {
  //comprueba el formato del email
  if (!isValidEmail(emailInput)) throw new Error("email not valid");

  return this.findOne({ emailInput }).then((policeOfficer) => {
    //validar email
    if (!policeOfficer) throw new Error("incorrect credentials");
    if (!policeOfficer.emailVerified) throw new Error("account not verified");

    //compara la contraseña:
    //el password entregado por el usuario con el password correspondiente al email que tenemos en la base de datos
    const isPasswordCorrect = bcrypt.compareSync(
      passwordInput,
      policeOfficer.password
    );
    if (!isPasswordCorrect) throw new Error("incorrect credentials");
    const policeObj = {
      _id: policeOfficer._id,
      email: policeOfficer.email,
      policename: policeOfficer.policename,
      isAdmin: policeOfficer.isAdmin,
    };
    // const { password, isAdmin, ...otherDetails } = policeOfficer._doc;//lo mismo que policeObj

    //creamos un token jwt, que lleva el objeto con los datos del usuario firmado con una clave secreta
    const access_token = jwt.sign(
      Object.assign({}, policeObj),
      process.env.SECRET_TOKEN,
      { expiresIn: 60 * 60 * 4 } //definido en segundos (4 horas)
    );

    //devolvemos token jwt firmado
    return { access_token };
  });
}
function updatePassword(policeOfficerId, oldPassword, newPassword) {
  return this.findById(policeOfficerId).then((policeOfficer) => {
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
  return this.findByIdAndDelete(policeOfficerId).then(
    (policeOfficer) => policeOfficer
  );
}
function searchFreeAgent() {
  return this.find({ free: { $eq: true } });
}
function releasePoliceOfficerFromCase(policeOfficerId) {
  if (!policeOfficerId) throw new Error("policeOfficerId required");
  return this.getPoliceOfficerById(policeOfficerId).then((policeOfficer) => {
    if (!policeOfficer) return next(createError(500, "police not found"));
    policeOfficer.free = true;
    return policeOfficer.save();
  });
}
function givePoliceOfficerToCase(policeOfficerId) {
  if (!policeOfficerId) throw new Error("policeOfficer Id required");
  return this.getPoliceOfficerById(policeOfficerId).then((policeOfficer) => {
    if (!policeOfficer) return next(createError(500, "police not found"));
    policeOfficer.free = false;
    return policeOfficer.save();
  });
}
