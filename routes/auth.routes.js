const express = require("express");
const router = express.Router();
const {
  createNewUser,
  updateUser,
  getUserProfile,
} = require("../controllers/user.controller");
const { login } = require("../controllers/auth.controller");
const loginLimiter = require("../middleware/loginLimiter");
const verifyToken = require("../middleware/verifyToken");

router.post("/signup", createNewUser);

router.post("/login", loginLimiter, login);

router.patch("/user/update/:id", verifyToken, updateUser);
router.get("/user/get/:id", verifyToken, getUserProfile);

module.exports = router;
