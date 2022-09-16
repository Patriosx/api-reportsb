const getModelByName = require("../db/getModelByName");
const { createError, successResponse } = require("../helpers");
const mongoose = require("mongoose");
module.exports.test = (req, res, next) => {
  const Case = getModelByName("case");

  return Case.searchPendingCase()
    .then((cases) => {
      res.send({ cases });
    })
    .catch((err) => next(createError(500, err.message)));
  /*  
  SOLVE CASE
 return Case.solveCase(req.params.id)
    .then((caseData) => {
      res.send({ data: caseData });
    })
    .catch((err) => next(createError(500, err))); 
    */
};
module.exports.openNewCase = (req, res, next) => {
  const PoliceOfficers = getModelByName("policeOfficer");

  //search free agent
  PoliceOfficers.searchFreeAgent().then((freeAgents) => {
    const Case = getModelByName("case");
    if (freeAgents.length === 0) {
      //save case without agent until one is available
      return Case.openNewCase(req.body)
        .then((_case) => {
          const Bike = getModelByName("bike");
          Bike.addCaseToBike(_case.stolenBike, _case._id).catch((err) =>
            next(createError(500, err.message))
          );
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
          successResponse(res, 201, "case open successfully", data)
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
          Bike.addCaseToBike(_case.stolenBike, _case._id).catch((err) =>
            next(createError(500, err.message))
          );
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
          successResponse(res, 201, "case open successfully", data)
        )
        .catch((err) => next(createError(500, err)));
    }
  });
};
module.exports.getCases = (req, res, next) => {
  const Case = getModelByName("case");

  return Case.getCases()
    .then((data) =>
      successResponse(res, 200, "case recieved successfully", data)
    )
    .catch(() => next(createError(500, "failed to get cases")));
};
module.exports.solveCase = (req, res, next) => {
  const Case = getModelByName("case");
  //case solved
  return Case.solveCase(req.body.caseId)
    .then((caseData) => {
      const PoliceOfficers = getModelByName("policeOfficer");
      //free agent
      return PoliceOfficers.getPoliceOfficerById(caseData.assignedOfficer);
    })
    .then((policeOfficer) => {
      //search case inactive unsolved to assign this office
      return Case.searchPendingCase().then((caseData) => {
        const pendingCase = caseData[0];
        //Sessions & transacions
        let session = null;
        return mongoose.startSession().then((_session) => {
          session = _session;
          session.startTransaction();
          //if there was a pending case
          if (caseData.length !== 0) {
            pendingCase.assignedOfficer = policeOfficer._id;
            pendingCase.active = true;
            pendingCase.save({ session });
            //update officer not available
            policeOfficer.free = false;
            policeOfficer.save({ session });
          } else {
            policeOfficer.free = true;
            policeOfficer.save();
          }
          session.commitTransaction();
        });
      });
    })
    .then(() => successResponse(res, 200, "case solved"))
    .catch((err) => next(createError(500, err)));
};
module.exports.getCaseById = (req, res, next) => {
  const Case = getModelByName("case");

  return Case.getCaseById(req.params.id)
    .then((caseData) => {
      successResponse(res, 200, "case recieved", caseData);
    })
    .catch((err) => next(createError(500, err.message)));
};
module.exports.getCasesByUser = (req, res, next) => {
  const Case = getModelByName("case");
  return Case.getCasesByUser(req.params.id)
    .then((caseData) => {
      successResponse(res, 200, "case recieved successfully", caseData);
    })
    .catch((err) => next(createError(500, err.message)));
};
