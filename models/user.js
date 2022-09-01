const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { isValidEmail } = require("../helpers");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const UserSchema = mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
      lowercase: true,
      unique: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    currentLocation: { type: Object },
    address: { type: String },
    emailVerified: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    stolenBikes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "bike",
      },
    ],
  },
  { timestamps: true }
);

//Methods
UserSchema.statics.signup = signup;
UserSchema.statics.getUsers = getUsers;
UserSchema.statics.getUserById = getUserById;
UserSchema.statics.login = login;
UserSchema.statics.confirmAccount = confirmAccount;
UserSchema.statics.updateUser = updateUser;
UserSchema.statics.updatePassword = updatePassword;
UserSchema.statics.deleteAccount = deleteAccount;

//(modelo, esquema, tabla)
module.exports = mongoose.model("user", UserSchema, "users");

//Static methods
function signup(userInfo) {
  //Validations
  if (!userInfo.email || !isValidEmail(userInfo.email))
    throw new Error("Email is not valid");
  if (!userInfo.fullname) throw new Error("name is required");
  if (!userInfo.password) throw new Error("password is required");

  return (
    this.findOne({ email: userInfo.email })
      .then((user) => {
        if (user) throw new Error("user already exists");

        const newUser = {
          email: userInfo.email,
          fullname: userInfo.fullname,
          password: bcrypt.hashSync(userInfo.password),
          phone: userInfo.phone,
          currentLocation: userInfo.currentLocation,
          address: userInfo.address,
        };

        return this.create(newUser);
      })
      // .then((userCreated) => sendConfirmationAccount(userCreated))
      .then((user) => user)
  );
}
function updateUser(userId, body) {
  return this.findByIdAndUpdate(userId, { $set: body }, { new: true }).then(
    (user) => user
  );
}
function sendConfirmationAccount(user) {
  let transporter = nodemailer.createTransport({
    host: /**/ process.env.SMTP_HOST /**/ /* "smtp.ionos.es"*/,
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: /**/ process.env.SMTP_USER /** "noreply@Movilidadelectrica.club"*/,
      pass: /**/ process.env.SMTP_KEY /**  "5X8A&DX3kYD$6Yoe4F;dr3"**/,
    },
  });
  //creamos token para enviar el email dentro
  const token = jwt.sign({ email: user.email }, process.env.SECRET_TOKEN);
  const urlConfirmation = `${process.env.API_GATEWAY_URL}/account/confirm/${token}`;

  //verificar transporter
  return transporter.sendMail({
    from: /**/ process.env.MAIL_ADMIN /**/ /*"desarrollo@click2luck.com"*/,
    to: user.email,
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

  return this.findOne({ email }).then((user) => {
    if (!user) throw new Error("user not found");
    if (user.emailVerified) throw new Error("user already verified");

    user.emailVerified = true;
    return user.save();
  });
}
function getUsers() {
  return this.find().then((users) => users);
}
function getUserById(_id) {
  return this.findById(_id).then((user) => {
    return {
      _id: user._id,
      email: user.email,
      emailVerified: user.emailVerified,
      isAdmin: user.isAdmin,
    };
  });
}
function login(emailInput, passwordInput) {
  //comprueba el formato del email
  if (!isValidEmail(emailInput)) throw new Error("email not valid");

  return this.findOne({ emailInput }).then((user) => {
    //validar email
    if (!user) throw new Error("incorrect credentials");
    if (!user.emailVerified) throw new Error("account not verified");

    //compara la contraseña:
    //el password entregado por el usuario con el password correspondiente al email que tenemos en la base de datos
    const isPasswordCorrect = bcrypt.compareSync(passwordInput, user.password);
    if (!isPasswordCorrect) throw new Error("incorrect credentials");
    const userObj = {
      _id: user._id,
      email: user.email,
      username: user.username,
      isAdmin: user.isAdmin,
    };
    // const { password, isAdmin, ...otherDetails } = user._doc;//lo mismo que userObj

    //creamos un token jwt, que lleva el objeto con los datos del usuario firmado con una clave secreta
    const access_token = jwt.sign(
      Object.assign({}, userObj),
      process.env.SECRET_TOKEN,
      { expiresIn: 60 * 60 * 4 } //definido en segundos (4 horas)
    );

    //devolvemos token jwt firmado
    return { access_token };
  });
}
function updatePassword(userId, oldPassword, newPassword) {
  return this.findById(userId).then((user) => {
    const isPasswordCorrect = bcrypt.compareSync(oldPassword, user.password);
    if (!isPasswordCorrect) throw new Error("incorrect credentials");

    user.password = bcrypt.hashSync(newPassword);
    user.save();
  });
}
function deleteAccount(userId) {
  return this.findByIdAndDelete(userId).then((user) => user);
}
