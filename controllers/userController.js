const getModelByName = require("../db/getModelByName");
const { createError } = require("../helpers");

module.exports.getUsers = (req, res, next) => {
  const User = getModelByName("user");
  return User.getUsers()
    .then((users) => {
      res
        .status(200)
        .send({ success: true, message: "successfully", data: users });
    })
    .catch((err) => next(createError(500, err.message)));
};

module.exports.getUserById = (req, res, next) => {
  const { body } = req;
  if (!body)
    return res.status(200).send({
      success: false,
      error: "user info not found",
      data: { user: null },
    });

  const User = getModelByName("user");

  return User.getUserById(body._id)
    .then((user) => {
      res.status(200).send({ success: true, data: { user } });
    })
    .catch((err) => next(createError(500, err.message)));
};

module.exports.confirmAccount = (req, res, next) => {
  const User = getModelByName("user");

  //le pasamos el token
  return User.confirmAccount(req.params.token)
    .then(() => {
      res
        .status(200)
        .send({ success: true, message: "account confirmed successfully" });
    })
    .catch((err) => next(createError(500, err.message)));
};

module.exports.getCurrentUser = (req, res, next) => {
  //busacmos req.user
  if (!req.user) return next(createError(500, "user not authorized"));

  const User = getModelByName("user");

  return User.getUserById(req.user._id)
    .then((user) => res.status(200).send({ success: true, data: { user } }))
    .catch((err) => next(createError(500, err.message)));
};

module.exports.updateUser = (req, res, next) => {
  if (!req.body) return next(createError(400, "user not provided"));
  const userId = req.params.id;
  const User = getModelByName("user");

  User.updateUser(userId, req.body)
    .then((user) => {
      if (!user) return next(createError(500, "user not found"));

      const { password, isAdmin, ...otherData } = user._doc;
      return res.status(201).send({ success: true, data: otherData });
    })
    .catch((err) => next(createError(500, err.message)));
};

module.exports.updatePassword = (req, res, next) => {
  const { newPassword, oldPassword } = req.body;
  if (!req.body) return next(createError(400, "password not provided"));

  const userId = req.params.id;
  const User = getModelByName("user");

  User.updatePassword(userId, oldPassword, newPassword)
    .then(() => {
      return res
        .status(201)
        .send({ success: true, message: "password updated" });
    })
    .catch((err) => next(createError(500, err.message)));
};

module.exports.deleteAccount = (req, res, next) => {
  const userId = req.params.id;

  const User = getModelByName("user");
  User.deleteAccount(userId)
    .then(() => {
      return res
        .status(201)
        .send({ success: true, message: "account deleted" });
    })
    .catch((err) => next(createError(500, err.message)));
};
module.exports.getBikesByUser = (req, res, next) => {
  const User = getModelByName("user");

  return User.getBikesByUser(req.params.id)
    .then((data) => {
      res.status(200).send({ success: true, data });
    })
    .catch((err) => next(createError(500, err.message)));
};
