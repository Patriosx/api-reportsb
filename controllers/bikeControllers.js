const getModelByName = require("../db/getModelByName");
const { createError, successResponse } = require("../helpers");

//user report a stolen bike
module.exports.addStolenBike = (req, res, next) => {
  const { body } = req;
  if (!body) return next(createError(500, "bike info not found"));

  const Bike = getModelByName("bike");

  return Bike.addStolenBike(body)
    .then((bike) => {
      successResponse(res, 201, "bike reported successfully", bike);
    })
    .catch((err) => next(createError(500, err.message)));
};
module.exports.removeStolenBike = (req, res, next) => {
  const bikeId = req.params.id;
  if (!req.params) return next(createError(500, "id not recieved"));

  const Bike = getModelByName("bike");

  return Bike.removeStolenBike(bikeId)
    .then((bike) => {
      successResponse(res, 200, "bike removed successfully", bike);
    })
    .catch((err) => next(createError(500, err.message)));
};
//search bikes filtered a term
module.exports.searchBike = (req, res, next) => {
  const Bike = getModelByName("bike");

  return Bike.searchBike(req.params.term)
    .then((bikes) => {
      successResponse(res, 200, "bikes found", bikes);
    })
    .catch((err) => next(createError(500, err.message)));
};
module.exports.getBikes = (req, res, next) => {
  const Bike = getModelByName("bike");

  return Bike.getBikes()
    .then((bikes) => {
      successResponse(res, 200, "bikes recieved successfully", bikes);
    })
    .catch((err) => next(createError(500, err.message)));
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
      successResponse(res, 200, "bikes received", bikes);
    })
    .catch((err) => next(createError(500, err.message)));
};
