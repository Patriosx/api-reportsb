const getModelByName = require("../db/getModelByName");
const { createError } = require("../helpers");

module.exports.getPolices = (req, res, next) => {
  const Police = getModelByName("police");
  return Police.getPolices()
    .then((polices) => {
      res
        .status(200)
        .send({ success: true, message: "successfully", data: polices });
    })
    .catch((err) => next(createError(500, err.message)));
};

module.exports.getPoliceById = (req, res, next) => {
  const { body } = req;
  if (!body)
    return res.status(200).send({
      success: false,
      error: "police info not found",
      data: { police: null },
    });

  const Police = getModelByName("police");

  return Police.getPoliceById(body._id)
    .then((police) => {
      res.status(200).send({ success: true, data: { police } });
    })
    .catch((err) => next(createError(500, err.message)));
};

module.exports.confirmAccount = (req, res, next) => {
  const Police = getModelByName("police");

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
  //busacmos req.police
  if (!req.police) return next(createError(500, "police not authorized"));

  const Police = getModelByName("police");

  return Police.getPoliceById(req.police._id)
    .then((police) => res.status(200).send({ success: true, data: { police } }))
    .catch((err) => next(createError(500, err.message)));
};

module.exports.updatePolice = (req, res, next) => {
  if (!req.body) return next(createError(400, "police not provided"));
  const policeId = req.params.id;
  const Police = getModelByName("police");

  Police.updatePolice(policeId, req.body)
    .then((police) => {
      if (!police) return next(createError(500, "police not found"));

      const { password, isAdmin, ...otherData } = police._doc;
      return res.status(201).send({ success: true, data: otherData });
    })
    .catch((err) => next(createError(500, err.message)));
};

module.exports.updatePassword = (req, res, next) => {
  const { newPassword, oldPassword } = req.body;
  if (!req.body) return next(createError(400, "password not provided"));

  const policeId = req.params.id;
  const Police = getModelByName("police");

  Police.updatePassword(policeId, oldPassword, newPassword)
    .then(() => {
      return res
        .status(201)
        .send({ success: true, message: "password updated" });
    })
    .catch((err) => next(createError(500, err.message)));
};

module.exports.deleteAccount = (req, res, next) => {
  const policeId = req.params.id;

  const Police = getModelByName("police");
  Police.deleteAccount(policeId)
    .then(() => {
      return res
        .status(201)
        .send({ success: true, message: "account deleted" });
    })
    .catch((err) => next(createError(500, err.message)));
};
