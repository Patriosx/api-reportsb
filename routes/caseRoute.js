const express = require("express");
const {
  addStolenBike,
  removeStolenBike,
} = require("../controllers/bikeControllers");
const {
  openNewCase,
  getCases,
  getCaseById,
  checkCase,
} = require("../controllers/caseControllers");

const router = express.Router();

router.post("/stolen_bike", addStolenBike);
router.get("/recovery_bike/:id", removeStolenBike);
router.post("/new_case", openNewCase);
router.get("/", getCases);
router.get("/:id", getCaseById);
router.get("/check/:id", checkCase);

module.exports = router;
