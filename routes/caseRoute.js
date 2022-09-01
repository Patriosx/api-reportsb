const express = require("express");
const {
  addStolenBike,
  removeStolenBike,
} = require("../controllers/bikeControllers");

const router = express.Router();

router.post("/stolen_bike", addStolenBike);
router.get("/recovery_bike/:id", removeStolenBike);

module.exports = router;
