const express = require("express");
const { verifyAdmin, verifyUser, verifyPolice } = require("../middlewares");
const ctrols = require("../controllers/departmentControllers");
const router = express.Router();

router.post("/new_department", verifyAdmin, ctrols.createDepartment);
router.get("/", verifyAdmin, ctrols.getDepartments);
router.post("/add_police_officer", ctrols.addPoliceOfficer);
router.post("/remove_police_officer", ctrols.removePoliceOfficer);
router.post("/clean", verifyAdmin, ctrols.cleanDepartment);

module.exports = router;
