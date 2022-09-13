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
UserSchema.statics.getBikesByUser = getBikesByUser;

//(model, schema, table)
module.exports = mongoose.model("user", UserSchema, "users");

//Static methods
function signup(userInfo) {
  //Validations
  if (!userInfo.email || !isValidEmail(userInfo.email))
    throw new Error("Email is not valid");
  if (!userInfo.fullname) throw new Error("name is required");
  if (!userInfo.password) throw new Error("password is required");

  return this.findOne({ email: userInfo.email })
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
    .then((userCreated) => sendConfirmationAccount(userCreated))
    .then((user) => user);
}
function updateUser(userId, body) {
  return this.findByIdAndUpdate(userId, { $set: body }, { new: true }).then(
    (user) => user
  );
}
//user need to confirm account to be able to login
function sendConfirmationAccount(user) {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_KEY,
    },
  });
  //create a token to send the email inside
  const token = jwt.sign({ email: user.email }, process.env.SECRET_TOKEN);
  const urlConfirmation = `${process.env.API_GATEWAY_URL}/account/confirm/${token}`;

  //verify transporter
  transporter.sendMail({
    from: process.env.MAIL_ADMIN,
    to: user.email,
    subject: "Please confirm your email.",
    html: `<p>Confirm your email <a href="${urlConfirmation}">here<a/></p>`,
  });
  return user;
}
function confirmAccount(token) {
  let email = null;

  try {
    //verify token with the email inside
    const payload = jwt.verify(token, process.env.SECRET_TOKEN);
    email = payload.email;
  } catch (error) {
    throw new Error("invalid token");
  }

  //search the user by email received inside the token
  return this.findOne({ email }).then((user) => {
    if (!user) throw new Error("user not found");
    if (user.emailVerified) throw new Error("user already verified");

    user.emailVerified = true;
    return user.save();
  });
}
function getUsers() {
  return this.find();
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
  //check email format
  if (!isValidEmail(emailInput)) throw new Error("email not valid");

  return this.findOne({ emailInput }).then((user) => {
    //input validations
    if (!user) throw new Error("incorrect credentials");
    if (!user.emailVerified) throw new Error("account not verified");

    //compare password:
    //the password given by the user with the password corresponding to the email we have in the database
    const isPasswordCorrect = bcrypt.compareSync(passwordInput, user.password);
    if (!isPasswordCorrect) throw new Error("incorrect credentials");
    const userObj = {
      _id: user._id,
      email: user.email,
      username: user.username,
      isAdmin: user.isAdmin,
    };
    // const { password, isAdmin, ...otherDetails } = user._doc;//same as userObj

    //create a token jwt, object with the user data signed with a secret key
    const access_token = jwt.sign(
      Object.assign({}, userObj),
      process.env.SECRET_TOKEN,
      { expiresIn: 60 * 60 * 4 } //defined in seconds (4 hours)
    );

    //return token jwt signed
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
function getBikesByUser(userId) {
  return this.findById(userId).populate("stolenBikes");
}
