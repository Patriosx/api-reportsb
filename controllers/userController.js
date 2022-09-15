const getModelByName = require("../db/getModelByName");
const { createError, successResponse } = require("../helpers");

module.exports.getUsers = (req, res, next) => {
  const User = getModelByName("user");
  return User.getUsers()
    .then((users) => {
      successResponse(res, 200, "users received", users);
    })
    .catch((err) => next(createError(500, err.message)));
};
module.exports.getUserById = (req, res, next) => {
  const User = getModelByName("user");

  return User.getUserById(req.params.id)
    .then((user) => {
      successResponse(res, 200, "user received", user);
    })
    .catch((err) => next(createError(500, err.message)));
};
module.exports.confirmAccount = (req, res, next) => {
  const User = getModelByName("user");

  //le pasamos el token
  return User.confirmAccount(req.params.token)
    .then(() => {
      successResponse(res, 200, "account confirmed successfully");
    })
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
      successResponse(res, 201, "user updated successfully", otherData);
    })
    .catch((err) => next(createError(500, err.message)));
};
module.exports.updatePassword = (req, res, next) => {
  const { newPassword, oldPassword } = req.body;
  if (!newPassword) return next(createError(400, "new password not provided"));
  if (!oldPassword)
    return next(createError(400, "current password not provided"));

  const userId = req.params.id;
  const User = getModelByName("user");

  User.updatePassword(userId, oldPassword, newPassword)
    .then((user) => {
      successResponse(res, 201, "password updated", user);
    })
    .catch((err) => next(createError(500, err.message)));
};
module.exports.deleteAccount = (req, res, next) => {
  const userId = req.params.id;

  const User = getModelByName("user");
  User.deleteAccount(userId)
    .then((user) => {
      successResponse(res, 201, "account deleted", user);
    })
    .catch((err) => next(createError(500, err.message)));
};
module.exports.getBikesByUser = (req, res, next) => {
  const User = getModelByName("user");

  return User.getBikesByUser(req.params.id)
    .then((data) => {
      successResponse(res, 200, "bikes received successfully", data);
    })
    .catch((err) => next(createError(500, err.message)));
};
