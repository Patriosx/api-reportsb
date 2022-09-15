const express = require("express");
const {
  addStolenBike,
  removeStolenBike,
} = require("../controllers/bikeControllers");
const caseCtrol = require("../controllers/caseControllers");
const { verifyAdmin, verifyUser } = require("../middlewares");
const router = express.Router();

router.post("/stolen_bike/:id", verifyUser, addStolenBike);
router.get("/recovery_bike/:id", removeStolenBike);

router.post("/new_case", verifyUser, caseCtrol.openNewCase);
router.get("/", verifyAdmin, caseCtrol.getCases);
router.get("/:id", caseCtrol.getCaseById);
router.get("/check/:id", verifyUser, caseCtrol.getCasesByUser);
router.post("/solve", verifyAdmin, caseCtrol.solveCase);
router.get("/test/test", caseCtrol.test);

module.exports = router;
