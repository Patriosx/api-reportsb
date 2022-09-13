const getModelByName = require("../db/getModelByName");
const { createError } = require("../helpers");

module.exports.addPoliceOfficer = (req, res, next) => {
  const { departmentId, officerId } = req.body;
  const Department = getModelByName("department");
  return Department.addPoliceOfficer(departmentId, officerId)
    .then(() => {
      res.status(200).send({ success: true, message: "successfully added" });
    })
    .catch((err) => next(createError(500, err.message)));
};
module.exports.createDepartment = (req, res, next) => {
  const Department = getModelByName("department");

  return Department.createDepartment(req.body)
    .then((department) => {
      res.status(200).send({
        success: true,
        message: " department successfully created",
        data: department,
      });
    })
    .catch((err) => next(createError(500, err.message)));
};
module.exports.getDepartments = (req, res, next) => {
  const Department = getModelByName("department");

  return Department.getDepartments()
    .then((departments) => {
      res.status(200).send({
        success: true,
        message: "departments received",
        data: departments,
      });
    })
    .catch((err) => next(createError(500, err.message)));
};
module.exports.removePoliceOfficer = (req, res, next) => {
  const { policeOfficerId } = req.body;
  const Department = getModelByName("department");

  return Department.removePoliceOfficer(policeOfficerId)
    .then((department) => {
      res.status(200).send({
        success: true,
        message: "officer successfully removed from department",
        data: department,
      });
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
