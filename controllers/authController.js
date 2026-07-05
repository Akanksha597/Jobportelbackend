const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const catchAsync = require("../utils/asyncErrorHandler");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
// ================= TOKEN =================

const createToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn:
        process.env.JWT_EXPIRES_IN,
    }
  );
};

// ================= SIGNUP =================

exports.signup = catchAsync(
  async (req, res) => {
    const {
      name,
      email,
      password,
      confirmPassword,
      mobileNumber,
      startDate,
      endDate,
      role,
    } = req.body;

    if (
      !name ||
      !email ||
      !password
    
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required",
      });
    }

    if (
      password 
   
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Passwords do not match",
      });
    }

    const existingUser =
      await User.findOne({
        email,
      });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "Email already exists",
      });
    }

    const newUser =
      await User.create({
        name,
        email,
        mobileNumber,
        password,
        startDate,
        endDate,
        role:
          role || "user",
      });

    const token = createToken(
      newUser._id
    );

    res.status(201).json({
      success: true,
      token,
      user: newUser,
    });
  }
);

// ================= LOGIN =================

exports.login = catchAsync(
  async (req, res) => {
    const { email, password } =
      req.body;

    const user =
      await User.findOne({
        email,
      }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email",
      });
    }

    const isMatch =
      await user.correctPassword(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid password",
      });
    }

    const token = createToken(
      user._id
    );

    res.status(200).json({
      success: true,
      token,
      user,
    });
  }
);

// ================= GET PROFILE =================

exports.getProfile = catchAsync(
  async (req, res) => {
    const users =
      await User.find();

    res.status(200).json({
      success: true,
      results: users.length,
      users,
    });
  }
);

// ================= UPDATE PROFILE =================

exports.updateProfile =
  catchAsync(async (req, res) => {
    const updatedUser =
      await User.findByIdAndUpdate(
        req.user.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  });

// ================= GET SINGLE USER =================

exports.getSingleUser =
  catchAsync(async (req, res) => {
    const user =
      await User.findById(
        req.params.id
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  });

// ================= UPDATE USER =================

exports.updateUser = catchAsync(
  async (req, res) => {
    const updatedUser =
      await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  }
);

// ================= DELETE USER =================

exports.deleteUser = catchAsync(
  async (req, res) => {
    const user =
      await User.findByIdAndDelete(
        req.params.id
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "User deleted successfully",
    });
  }
);


exports.forgotPassword = catchAsync(
  async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.otp = otp;
    user.otpExpires =
      Date.now() + 10 * 60 * 1000;

    await user.save({
      validateBeforeSave: false,
    });

    const transporter =
      nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <h2>Password Reset OTP</h2>
        <h1>${otp}</h1>
        <p>Valid for 10 minutes.</p>
      `,
    });

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  }
);

exports.resetPasswordByOtp =
  catchAsync(async (req, res) => {
    const {
      email,
      otp,
      newPassword,
      confirmPassword,
    } = req.body;

    if (
      newPassword !== confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Passwords do not match",
      });
    }

    const user =
      await User.findOne({
        email,
        otp,
        otpExpires: {
          $gt: Date.now(),
        },
      });

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid or expired OTP",
      });
    }

    user.password = newPassword;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Password reset successfully",
    });
  });

// ================= RESET PASSWORD =================

exports.resetPassword =
  catchAsync(async (req, res) => {
    const { password } =
      req.body;

    const user =
      await User.findById(
        req.params.id
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message:
          "Password is required",
      });
    }

    user.password = password;

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Password updated successfully",
    });
  });

// ================= LOGOUT =================

exports.logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out",
  });
};

exports.updateEndDate = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        endDate: req.body.endDate || null,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "End date updated successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};