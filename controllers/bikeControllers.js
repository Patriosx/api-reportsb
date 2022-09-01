const getModelByName = require("../db/getModelByName");
const { createError } = require("../helpers");

module.exports.addStolenBike = (req, res, next) => {
  const { body } = req;
  if (!body) return next(createError(500, "bike info not found"));

  const Bike = getModelByName("bike");

  return Bike.addStolenBike(body)
    .then(() => {
      res
        .status(201)
        .send({ success: true, message: "bike successfully added" });
    })
    .catch((err) => next(createError(500, err.message)));
};
module.exports.removeStolenBike = (req, res, next) => {
  const bikeId = req.params.id;
  if (!req.params) return next(createError(500, "id not recieved"));

  const Bike = getModelByName("bike");

  return Bike.removeStolenBike(bikeId)
    .then(() => {
      res
        .status(201)
        .send({ success: true, message: "bike successfully recovered" });
    })
    .catch((err) => next(createError(500, err.message)));
};
