const getModelByName = require("../db/getModelByName");
const { createError, successResponse } = require("../helpers");

module.exports.addPoliceOfficer = (req, res, next) => {
  const { departmentId, officerId } = req.body;
  const Department = getModelByName("department");
  return Department.addPoliceOfficer(departmentId, officerId)
    .then((department) => {
      successResponse(res, 200, "officer added successfully", department);
    })
    .catch((err) => next(createError(500, err.message)));
};
module.exports.createDepartment = (req, res, next) => {
  const Department = getModelByName("department");

  return Department.createDepartment(req.body)
    .then((department) => {
      successResponse(res, 201, "department created successfully", department);
    })
    .catch((err) => next(createError(500, err.message)));
};
module.exports.getDepartments = (req, res, next) => {
  const Department = getModelByName("department");

  return Department.getDepartments()
    .then((departments) => {
      successResponse(
        res,
        200,
        "departments received successfully",
        departments
      );
    })
    .catch((err) => next(createError(500, err.message)));
};
module.exports.removePoliceOfficer = (req, res, next) => {
  const { policeOfficerId } = req.body;
  const Department = getModelByName("department");

  return Department.removePoliceOfficer(policeOfficerId)
    .then((department) => {
      successResponse(
        res,
        200,
        "officer removed from department successfully",
        department
      );
    })
    .catch((err) => next(createError(500, err.message)));
};
module.exports.cleanDepartment = (req, res, next) => {
  const Department = getModelByName("department");
  const { departmentId } = req.body;
  return Department.cleanDepartment(departmentId)
    .then((department) => {
      successResponse(res, 200, "department cleaned successfully", department);
    })
    .catch((err) => next(createError(500, err.message)));
};
