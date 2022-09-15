const getModelByName = require("../db/getModelByName");
const { createError, successResponse } = require("../helpers");

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
  //validations
  if (!body.email) return next(createError(500, "email not provided"));
  if (!body.fullname) return next(createError(500, "name not provided"));
  if (!body.phone) return next(createError(500, "phone not provided"));
  if (!body.password) return next(createError(500, "password not provided"));

  const User = getModelByName("user");

  return User.signup(body)
    .then((user) => {
      const userData = {
        id: user._id,
        username: user.fullname,
      };
      successResponse(res, 201, "successfully signed up", userData);
    })
    .catch((err) => next(createError(500, err.message)));
};

//Police
module.exports.loginPolice = (req, res, next) => {
  const { body } = req;
  //comprobar parametros
  if (!body.email) return next(createError(500, "email not provided"));
  if (!body.password) return next(createError(500, "password not provided"));

  const Police = getModelByName("policeOfficer");

  Police.login(body.email, body.password)
    .then((data) => {
      //data = access_token
      res
        .cookie("access_token", data.access_token, { httpOnly: true })
        .status(200)
        .send({ success: true, data });
    })
    .catch((err) => next(createError(500, err.message)));
};
module.exports.signupPolice = (req, res, next) => {
  const { body } = req;
  if (!body)
    return res
      .status(200)
      .send({ success: false, error: "policeOfficer info not found" });

  const Police = getModelByName("policeOfficer");
  return Police.signup(body)
    .then((data) => {
      successResponse(res, 201, "successfully signed up", data);
    })
    .catch((err) => next(createError(500, err.message)));
};
