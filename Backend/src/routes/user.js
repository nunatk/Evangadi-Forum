const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  checkUser
} = require("../controllers/userController");

const auth = require("../middleware/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/checkuser", auth, checkUser);

module.exports = router;
