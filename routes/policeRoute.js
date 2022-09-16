const express = require("express");
const policeCtrl = require("../controllers/policeControllers");
const bikeCtrl = require("../controllers/bikeControllers");
const { verifyAdmin, verifyPolice } = require("../middlewares");
const router = express.Router();

//Police actions
router.get("/", verifyAdmin, policeCtrl.getPolice);
router.post("/officer", verifyAdmin, policeCtrl.getPoliceOfficerById);
router.get("/free_agents", policeCtrl.searchFreeAgent);
router.post("/release", policeCtrl.releasePoliceOfficerFromCase);
router.get("/confirm/:token", policeCtrl.confirmAccount);
//Police actions with bikes
router.get("/search/:term", verifyPolice, bikeCtrl.searchBike);
router.get("/get_bikes", verifyPolice, bikeCtrl.getBikes);
router.get("/:term", bikeCtrl.departmentResposible);

module.exports = router;
