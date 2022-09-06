const express = require("express");
const policeCtrl = require("../controllers/policeControllers");

const router = express.Router();

router.get("/", policeCtrl.getPolice);
router.post("/officer", policeCtrl.getPoliceOfficerById);
router.get("/free_agents", policeCtrl.searchFreeAgent);

module.exports = router;
