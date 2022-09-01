const express = require("express");
const userCtrol = require("../controllers/userController");
const { auth, verifyTokenWCookie, verifyUser } = require("../middlewares");

const router = express.Router();

router.get("/checkauthentication", verifyTokenWCookie, (req, res) => {
  res.send("User authenticated");
});

router.get("/users", userCtrol.getUsers);
router.get("/confirm/:token", userCtrol.confirmAccount);
router.patch("/update/:id", verifyUser, userCtrol.updateUser);
router.patch("/change-password/:id", verifyUser, userCtrol.updatePassword);
router.delete("/delete/:id", verifyUser, userCtrol.deleteAccount);
//comprueba el token pasandolo por headers
router.post("/current-user", auth, userCtrol.getCurrentUser);

module.exports = router;
