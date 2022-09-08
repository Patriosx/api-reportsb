const express = require("express");
const {
  addStolenBike,
  removeStolenBike,
} = require("../controllers/bikeControllers");
const caseCtrol = require("../controllers/caseControllers");

const router = express.Router();

router.post("/stolen_bike", addStolenBike);
router.get("/recovery_bike/:id", removeStolenBike);

router.post("/new_case", caseCtrol.openNewCase);
router.get("/", caseCtrol.getCases);
router.get("/:id", caseCtrol.getCaseById);
router.get("/check/:id", caseCtrol.getCasesByUser);
router.get("/test/test", caseCtrol.test);
router.post("/solve", caseCtrol.solveCase);

module.exports = router;
