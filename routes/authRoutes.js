const express = require("express");

const rateLimit = require("express-rate-limit");

const {
  signup,
  login,
  logout,
  getProfile,
  updateProfile,
  getSingleUser,
  updateUser,
  deleteUser,
  resetPassword,
  forgotPassword,
  resetPasswordByOtp,
  
} = require("../controllers/authController");

const {
  sendOTP,
  verifyOtpAndRegister,
} = require(
  "../controllers/otpController"
);
const {
  protectRoute,
  restrictTo,
} = require("../middleware/protectRoute");

const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

// AUTH

router.post("/signup", signup);

router.post(
  "/login",
  limiter,
  login
);

router.post("/logout", logout);

// PROFILE

router.get(
  "/profile",
  protectRoute,
  getProfile
);

router.put(
  "/update-profile",
  protectRoute,
  updateProfile
);

// SINGLE USER

router.get(
  "/profile/:id",
  protectRoute,
  getSingleUser
);

// UPDATE USER

router.put(
  "/profile/:id",
  protectRoute,
  updateUser
);

// DELETE USER

router.delete(
  "/profile/:id",
  protectRoute,
  deleteUser
);

// RESET PASSWORD

router.put(
  "/reset-password/:id",
  protectRoute,
  resetPassword
);

router.post(
  "/forgot-password",
  forgotPassword
);

router.post(
  "/reset-password",
  resetPasswordByOtp
);

// DASHBOARD

router.get(
  "/user-dashboard",
  protectRoute,
  restrictTo(
    "user",
    "admin",
    "moderator"
  ),
  (req, res) => {
    res.json({
      success: true,
      message:
        "User Dashboard",
    });
  }
);

router.post(
  "/send-otp",
  sendOTP
);

router.post(
  "/verify-otp-register",
  verifyOtpAndRegister
);

module.exports = router;