const express = require("express");
const router = express.Router();

const {
  login,
  signup,
  sendotp,
  changePassword,
} = require("../controllers/Auth");

const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/ResetPassword");

const { auth } = require("../middlewares/auth");

router.post("/login", login);

router.post("/signup", signup);

router.post("/sendotp", sendotp);

//change password
router.post("/changePassword", auth, changePassword);

//reset password
router.post("/reset-password-token", auth, resetPasswordToken);

router.post("/reset-password", auth, resetPassword);

module.exports = router;
