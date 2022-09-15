const express = require("express");
const userCtrol = require("../controllers/userController");

const { verifyPolice, verifyUser } = require("../middlewares");

const router = express.Router();

router.get("/users", verifyPolice, userCtrol.getUsers);
router.get("/:id", verifyPolice, userCtrol.getUserById);
router.get("/confirm/:token", userCtrol.confirmAccount);
router.patch("/update/:id", verifyUser, userCtrol.updateUser);
router.patch("/update/password/:id", verifyUser, userCtrol.updatePassword);
router.delete("/delete/:id", verifyUser, userCtrol.deleteAccount);

router.get("/users/bikes/:id", verifyUser, userCtrol.getBikesByUser);

module.exports = router;
