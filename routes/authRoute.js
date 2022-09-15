const express = require("express");
const {
  login,
  signup,
  signupPolice,
  loginPolice,
} = require("../controllers/authControllers");

const router = express.Router();
//User authentication
router.post("/login", login);
router.post("/signup", signup);

//Police authentication
router.post("/police/login", loginPolice);
router.post("/police/signup", signupPolice);

module.exports = router;
