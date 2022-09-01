const getModelByName = require("../db/getModelByName");
const { createError } = require("../helpers");

//Users
module.exports.login = (req, res, next) => {
  const { body } = req;
  //comprobar parametros
  if (!body.email) return next(createError(500, "email not provided"));
  if (!body.password) return next(createError(500, "password not provided"));

  const User = getModelByName("user");

  User.login(body.email, body.password)
    .then((data) => {
      //data = access_token
      res
        .cookie("access_token", data.access_token, { httpOnly: true })
        .status(200)
        .send({ success: true, data });
    })
    .catch((err) => next(createError(500, err.message)));
};
module.exports.signup = (req, res, next) => {
  const { body } = req;
  if (!body)
    return res
      .status(200)
      .send({ success: false, error: "user info not found" });

  const User = getModelByName("user");

  return User.signup(body)
    .then(() => {
      res
        .status(201)
        .send({ success: true, message: "successfully signed up" });
    })
    .catch((err) => next(createError(500, err.message)));
};
