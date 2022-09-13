const getModelByName = require("../db/getModelByName");
const { createError } = require("../helpers");

//user report a stolen bike
module.exports.addStolenBike = (req, res, next) => {
  const { body } = req;
  if (!body) return next(createError(500, "bike info not found"));

  const Bike = getModelByName("bike");

  return Bike.addStolenBike(body)
    .then((bike) => {
      res.status(201).send({
        success: true,
        message: "bike successfully added",
        data: bike,
      });
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
//search bikes filtered a term
module.exports.searchBike = (req, res, next) => {
  const Bike = getModelByName("bike");

  return Bike.searchBike(req.params.term)
    .then((bikes) => {
      res
        .status(200)
        .send({ success: true, message: "bikes found", data: bikes });
    })
    .catch((err) => next(createError(500, err.message)));
};
module.exports.getBikes = (req, res, next) => {
  const Bike = getModelByName("bike");

  return Bike.getBikes().then((bikes) => {
    res.status(200).send({
      success: true,
      message: "bikes recieved successfully",
      data: bikes,
    });
  });
};
//return ths bike and the department responsible for the case
module.exports.departmentResposible = (req, res, next) => {
  const Bike = getModelByName("bike");

  return Bike.departmentResposible(req.params.term)
    .then((bikes) => {
      return bikes.map((bike) => {
        if (bike.case && bike.case.assignedOfficer) {
          const { brand, model, license, color, type, desc, owner } = bike;

          const PoliceOfficer = getModelByName("policeOfficer");
          return PoliceOfficer.findById(bike.case.assignedOfficer)
            .populate("department")
            .then((policeOfficer) => {
              const { name, city } = policeOfficer.department;
              return {
                bike: {
                  ID: bike._id,
                  brand,
                  model,
                  license,
                  color,
                  type,
                  desc,
                  owner,
                },
                department: { ID: policeOfficer.department._id, name, city },
              };
            });
        }
      });
    })
    .then((bikes) => {
      return Promise.all(bikes);
    })
    .then((bikes) => {
      res
        .status(200)
        .send({ success: true, message: "data received", data: bikes });
    })
    .catch((err) => next(createError(500, err.message)));
};
