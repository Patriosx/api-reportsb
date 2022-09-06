const getModelByName = require("../db/getModelByName");
const { createError } = require("../helpers");

module.exports.getPolice = (req, res, next) => {
  const Police = getModelByName("policeOfficer");
  return Police.getPolice()
    .then((policeOfficer) => {
      res
        .status(200)
        .send({ success: true, message: "successfully", data: policeOfficer });
    })
    .catch((err) => next(createError(500, err.message)));
};

module.exports.getPoliceOfficerById = (req, res, next) => {
  const { body } = req;
  if (!body)
    return res.status(200).send({
      success: false,
      error: "policeOfficer info not found",
      data: { policeOfficer: null },
    });

  const Police = getModelByName("policeOfficer");

  return Police.getPoliceOfficerById(body.id)
    .then((policeOfficer) => {
      res.status(200).send({ success: true, data: { policeOfficer } });
    })
    .catch((err) => next(createError(500, err.message)));
};

module.exports.confirmAccount = (req, res, next) => {
  const Police = getModelByName("policeOfficer");

  //le pasamos el token
  return Police.confirmAccount(req.params.token)
    .then(() => {
      res
        .status(200)
        .send({ success: true, message: "account confirmed successfully" });
    })
    .catch((err) => next(createError(500, err.message)));
};

module.exports.getCurrentPolice = (req, res, next) => {
  //busacmos req.policeOfficer
  if (!req.policeOfficer)
    return next(createError(500, "policeOfficer not authorized"));

  const Police = getModelByName("policeOfficer");

  return Police.getPoliceOfficerById(req.policeOfficer._id)
    .then((policeOfficer) =>
      res.status(200).send({ success: true, data: { policeOfficer } })
    )
    .catch((err) => next(createError(500, err.message)));
};

module.exports.updatePoliceOfficer = (req, res, next) => {
  if (!req.body) return next(createError(400, "policeOfficer not provided"));
  const policeOfficerId = req.params.id;
  const Police = getModelByName("policeOfficer");

  Police.updatePoliceOfficer(policeOfficerId, req.body)
    .then((policeOfficer) => {
      if (!policeOfficer)
        return next(createError(500, "policeOfficer not found"));

      const { password, isAdmin, ...otherData } = policeOfficer._doc;
      return res.status(201).send({ success: true, data: otherData });
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
      return res
        .status(201)
        .send({ success: true, message: "password updated" });
    })
    .catch((err) => next(createError(500, err.message)));
};

module.exports.deleteAccount = (req, res, next) => {
  const policeOfficerId = req.params.id;

  const Police = getModelByName("policeOfficer");
  Police.deleteAccount(policeOfficerId)
    .then(() => {
      return res
        .status(201)
        .send({ success: true, message: "account deleted" });
    })
    .catch((err) => next(createError(500, err.message)));
};
module.exports.searchFreeAgent = (req, res, next) => {
  const Police = getModelByName("policeOfficer");
  return Police.searchFreeAgent()
    .then((freeAgents) =>
      res.status(200).send({
        success: true,
        message: "free agent successfully recieved",
        freeAgents,
      })
    )
    .catch((err) => next(createError(500, "failed to get free agents")));
};
