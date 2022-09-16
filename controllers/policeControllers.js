const getModelByName = require("../db/getModelByName");
const { createError, successResponse } = require("../helpers");

module.exports.getPolice = (req, res, next) => {
  const Police = getModelByName("policeOfficer");
  return Police.getPolice()
    .then((policeOfficer) => {
      successResponse(res, 200, "police received successfully", policeOfficer);
    })
    .catch((err) => next(createError(500, err.message)));
};

module.exports.getPoliceOfficerById = (req, res, next) => {
  const { body } = req;

  const Police = getModelByName("policeOfficer");

  return Police.getPoliceOfficerById(body.id)
    .then((policeOfficer) => {
      successResponse(res, 200, "officer received successfully", policeOfficer);
    })
    .catch((err) => next(createError(500, err.message)));
};

module.exports.confirmAccount = (req, res, next) => {
  const Police = getModelByName("policeOfficer");

  //le pasamos el token
  return Police.confirmAccount(req.params.token)
    .then(() => {
      successResponse(res, 200, "account confirmed successfully");
    })
    .catch((err) => next(createError(500, err.message)));
};

module.exports.updatePoliceOfficer = (req, res, next) => {
  if (!req.body) return next(createError(400, "police officer not provided"));
  const policeOfficerId = req.params.id;
  const Police = getModelByName("policeOfficer");

  Police.updatePoliceOfficer(policeOfficerId, req.body)
    .then((policeOfficer) => {
      if (!policeOfficer)
        return next(createError(500, "policeOfficer not found"));

      const { password, isAdmin, ...otherData } = policeOfficer._doc;
      successResponse(res, 201, "account confirmed successfully", otherData);
    })
    .catch((err) => next(createError(500, err.message)));
};

module.exports.updatePassword = (req, res, next) => {
  const { newPassword, oldPassword } = req.body;
  if (!req.body) return next(createError(400, "password not provided"));

  const policeOfficerId = req.params.id;
  const Police = getModelByName("policeOfficer");

  Police.updatePassword(policeOfficerId, oldPassword, newPassword)
    .then(() => {
      successResponse(res, 201, "password updated");
    })
    .catch((err) => next(createError(500, err.message)));
};

module.exports.deleteAccount = (req, res, next) => {
  const policeOfficerId = req.params.id;

  const Police = getModelByName("policeOfficer");
  Police.deleteAccount(policeOfficerId)
    .then(() => {
      successResponse(res, 200, "account deleted");
    })
    .catch((err) => next(createError(500, err.message)));
};
module.exports.searchFreeAgent = (req, res, next) => {
  const Police = getModelByName("policeOfficer");
  return Police.searchFreeAgent()
    .then((freeAgents) => {
      successResponse(
        res,
        200,
        "free agents recieved successfully",
        freeAgents
      );
    })
    .catch(() => next(createError(500, "failed to get free agents")));
};
module.exports.releasePoliceOfficerFromCase = (req, res, next) => {
  const Police = getModelByName("policeOfficer");
  //free agent
  return Police.releasePoliceOfficerFromCase(req.body.policeOfficerId)
    .then(() => {
      successResponse(res, 200, "police released from case successfully");
    })
    .catch((err) => next(createError(500, err.message)));
};

//search case available: active=false, solved=false
