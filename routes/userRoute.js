const express = require("express");
const userCtrol = require("../controllers/userController");

const {
  verifyAdmin,
  verifyPolice,
  verifyTokenWCookie,
  verifyUser,
} = require("../middlewares");

const router = express.Router();

router.get("/checkauthentication", verifyTokenWCookie, (req, res) => {
  res.send("User authenticated");
});

router.get("/users", verifyPolice, userCtrol.getUsers);
router.get("/confirm/:token", userCtrol.confirmAccount);
router.patch("/update/:id", verifyUser, userCtrol.updateUser);
router.patch("/change-password/:id", verifyUser, userCtrol.updatePassword);
router.delete("/delete/:id", verifyUser, userCtrol.deleteAccount);

router.get("/users/bikes/:id", verifyUser, userCtrol.getBikesByUser);

module.exports = router;
