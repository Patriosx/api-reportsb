const express = require("express");
const { verifyAdmin } = require("../middlewares");
const ctrols = require("../controllers/departmentControllers");
const router = express.Router();

router.post("/new_department", verifyAdmin, ctrols.createDepartment);
router.get("/", verifyAdmin, ctrols.getDepartments);
router.post("/add_police_officer", verifyAdmin, ctrols.addPoliceOfficer);
router.post("/remove_police_officer", verifyAdmin, ctrols.removePoliceOfficer);

module.exports = router;
