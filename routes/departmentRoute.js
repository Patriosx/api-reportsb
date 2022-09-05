const express = require("express");

const ctrols = require("../controllers/departmentControllers");
const router = express.Router();

router.post("/new_department", ctrols.createDepartment);
router.get("/", ctrols.getDepartments);
router.post("/add_police_officer", ctrols.addPoliceOfficer);
router.post("/transfer", ctrols.transferPoliceOfficer);
router.post("/remove_police_officer", ctrols.removePoliceOfficer);
router.post("/clean", ctrols.cleanDepartment);

module.exports = router;
