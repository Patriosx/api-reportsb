const express = require("express");
const {
  login,
  signup,
  signupPolice,
  loginPolice,
} = require("../controllers/authControllers");

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);

router.post("/police/login", loginPolice);
router.post("/police/signup", signupPolice);

module.exports = router;
