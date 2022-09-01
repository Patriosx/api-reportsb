const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { isValidEmail } = require("../helpers");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const policeSchema = mongoose.Schema(
  {
    fullname: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    emailVerified: { type: Boolean, default: false },
    admin: { type: Boolean, default: false }, //director
  },
  { timestamps: true }
);

//Methods
policeSchema.statics.signup = signup;
policeSchema.statics.getpolices = getpolices;
policeSchema.statics.getpoliceById = getpoliceById;
policeSchema.statics.login = login;
policeSchema.statics.confirmAccount = confirmAccount;
policeSchema.statics.updatepolice = updatepolice;
policeSchema.statics.updatePassword = updatePassword;
policeSchema.statics.deleteAccount = deleteAccount;

module.exports = mongoose.model("police", policeSchema, "polices");

//Static methods
function signup(policeInfo) {
  //Validations
  if (!policeInfo.email || !isValidEmail(policeInfo.email))
    throw new Error("Email is not valid");
  if (!policeInfo.fullname) throw new Error("name is required");
  if (!policeInfo.password) throw new Error("password is required");

  return (
    this.findOne({ email: policeInfo.email })
      .then((police) => {
        if (police) throw new Error("police already exists");

        const newpolice = {
          email: policeInfo.email,
          fullname: policeInfo.fullname,
          password: bcrypt.hashSync(policeInfo.password),
          phone: policeInfo.phone,
          currentLocation: policeInfo.currentLocation,
          address: policeInfo.address,
        };

        return this.create(newpolice);
      })
      // .then((policeCreated) => sendConfirmationAccount(policeCreated))
      .then((police) => police)
  );
}
function updatepolice(policeId, body) {
  return this.findByIdAndUpdate(policeId, { $set: body }, { new: true }).then(
    (police) => police
  );
}
function sendConfirmationAccount(police) {
  let transporter = nodemailer.createTransport({
    host: /**/ process.env.SMTP_HOST /**/ /* "smtp.ionos.es"*/,
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
      police:
        /**/ process.env.SMTP_police /** "noreply@Movilidadelectrica.club"*/,
      pass: /**/ process.env.SMTP_KEY /**  "5X8A&DX3kYD$6Yoe4F;dr3"**/,
    },
  });
  //creamos token para enviar el email dentro
  const token = jwt.sign({ email: police.email }, process.env.SECRET_TOKEN);
  const urlConfirmation = `${process.env.API_GATEWAY_URL}/account/confirm/${token}`;

  //verificar transporter
  return transporter.sendMail({
    from: /**/ process.env.MAIL_ADMIN /**/ /*"desarrollo@click2luck.com"*/,
    to: police.email,
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

  return this.findOne({ email }).then((police) => {
    if (!police) throw new Error("police not found");
    if (police.emailVerified) throw new Error("police already verified");

    police.emailVerified = true;
    return police.save();
  });
}
function getpolices() {
  return this.find().then((polices) => polices);
}
function getpoliceById(_id) {
  return this.findById(_id).then((police) => {
    return {
      _id: police._id,
      email: police.email,
      emailVerified: police.emailVerified,
      isAdmin: police.isAdmin,
    };
  });
}
function login(emailInput, passwordInput) {
  //comprueba el formato del email
  if (!isValidEmail(emailInput)) throw new Error("email not valid");

  return this.findOne({ emailInput }).then((police) => {
    //validar email
    if (!police) throw new Error("incorrect credentials");
    if (!police.emailVerified) throw new Error("account not verified");

    //compara la contraseña:
    //el password entregado por el usuario con el password correspondiente al email que tenemos en la base de datos
    const isPasswordCorrect = bcrypt.compareSync(
      passwordInput,
      police.password
    );
    if (!isPasswordCorrect) throw new Error("incorrect credentials");
    const policeObj = {
      _id: police._id,
      email: police.email,
      policename: police.policename,
      isAdmin: police.isAdmin,
    };
    // const { password, isAdmin, ...otherDetails } = police._doc;//lo mismo que policeObj

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
function updatePassword(policeId, oldPassword, newPassword) {
  return this.findById(policeId).then((police) => {
    const isPasswordCorrect = bcrypt.compareSync(oldPassword, police.password);
    if (!isPasswordCorrect) throw new Error("incorrect credentials");

    police.password = bcrypt.hashSync(newPassword);
    police.save();
  });
}
function deleteAccount(policeId) {
  return this.findByIdAndDelete(policeId).then((police) => police);
}
