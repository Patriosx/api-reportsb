const getModelByName = require("../db/getModelByName");
const { createError } = require("../helpers");

module.exports.openNewCase = (req, res, next) => {
  //search free agent
  const PoliceOfficers = getModelByName("policeOfficer");
  PoliceOfficers.searchFreeAgent().then((freeAgents) => {
    const Case = getModelByName("case");
    if (freeAgents.length === 0) {
      //save case without agent until one is available
      return Case.openNewCase(req.body)
        .then((data) =>
          res
            .status(201)
            .send({ success: true, message: "case open successfully", data })
        )
        .catch((err) => next(createError(500, err)));
    } else {
      //with free agent
      const officerSelected = freeAgents[0];
      return Case.openNewCase({
        ...req.body,
        assignedOfficer: officerSelected._id,
        active: true,
      })
        .then((_case) => {
          //update availability of officer
          officerSelected.free = false;
          officerSelected.save();
          return _case;
        })
        .then((_case) => {
          const Bike = getModelByName("bike");
          Bike.findById(_case.stolenBike).then((bike) => {
            //add caseID to bike
            bike.case = _case._id;
            bike.save();
          });
          return _case;
        })
        .then((_case) => {
          //send email
          const User = getModelByName("user");
          return User.findOne({
            stolenBikes: { $in: [_case.stolenBike] },
          }).then((user) => {
            Case.notifyUser(user);
            return _case;
          });
        })
        .then((data) =>
          res
            .status(201)
            .send({ success: true, message: "case open successfully", data })
        )
        .catch((err) => next(createError(500, err)));
    }
  });
};
module.exports.getCases = (req, res, next) => {
  const Case = getModelByName("case");

  return Case.getCases()
    .then((data) =>
      res
        .status(200)
        .send({ success: true, message: "cases recieved successfully", data })
    )
    .catch(() => next(createError(500, "failed to get cases")));
};
module.exports.solveCase = (req, res, next) => {};
module.exports.getCaseById = (req, res, next) => {
  const Case = getModelByName("case");

  return Case.getCaseById(req.params.id)
    .then((caseData) => {
      res
        .status(200)
        .send({ success: true, message: "case recieved", data: caseData });
    })
    .catch((err) => next(createError(500, err.message)));
};
module.exports.checkCase = (req, res, next) => {
  const Case = getModelByName("case");
  return Case.checkCase(req.params.id)
    .then((caseData) => {
      res
        .status(200)
        .send({
          success: true,
          message: "case recieved successfully",
          data: caseData,
        });
    })
    .catch((err) => next(createError(500, err.message)));
};
