const getModelByName = require("../db/getModelByName");
const { createError } = require("../helpers");

module.exports.addPoliceOfficer = (req, res, next) => {
  const Department = getModelByName("department");
  const { departmentId, officerId } = req.body;
  return Department.addPoliceOfficer(departmentId, officerId)
    .then((data) => {
      res
        .status(200)
        .send({ success: true, message: "successfully added", data: data });
    })
    .catch((err) => next(createError(500, err.message)));
};
module.exports.createDepartment = (req, res, next) => {
  const Department = getModelByName("department");

  return Department.createDepartment(req.body)
    .then((department) => {
      res
        .status(200)
        .send({ success: true, message: "successfully", data: department });
    })
    .catch((err) => next(createError(500, err.message)));
};
module.exports.getDepartments = (req, res, next) => {
  const Department = getModelByName("department");

  return Department.getDepartments()
    .then((departments) => {
      res
        .status(200)
        .send({ success: true, message: "successfully", data: departments });
    })
    .catch((err) => next(createError(500, err.message)));
};
module.exports.transferPoliceOfficer = (req, res, next) => {
  const { newDepartmentId, policeOfficerId } = req.body;
  const Department = getModelByName("department");

  // return Department.transferPoliceOfficer(newDepartmentId, policeOfficerId);

  Department.removePoliceOfficer(policeOfficerId)
    .then(() => {
      Department.addPoliceOfficer(newDepartmentId, policeOfficerId)
        .then((data) =>
          res.status(200).send({ success: true, message: "successfully", data })
        )
        .catch((err) => next(createError(500, err.message)));
    })
    .catch((err) => next(createError(500, err.message)));
};
module.exports.removePoliceOfficer = (req, res, next) => {
  const { policeOfficerId } = req.body;
  const Department = getModelByName("department");

  return Department.removePoliceOfficer(policeOfficerId)
    .then((department) => {
      res
        .status(200)
        .send({ success: true, message: "successfully", data: department });
    })
    .catch((err) => next(createError(500, err.message)));
};
module.exports.cleanDepartment = (req, res, next) => {
  const Department = getModelByName("department");
  const { departmentId } = req.body;
  return Department.cleanDepartment(departmentId)
    .then((department) => {
      res
        .status(200)
        .send({ success: true, message: "successfully", data: department });
    })
    .catch((err) => next(createError(500, err.message)));
};
