const express = require("express");
const {
  addStolenBike,
  removeStolenBike,
} = require("../controllers/bikeControllers");
const { openNewCase } = require("../controllers/caseControllers");

const router = express.Router();

router.post("/stolen_bike", addStolenBike);
router.get("/recovery_bike/:id", removeStolenBike);
router.post("/new_case", openNewCase);

module.exports = router;
