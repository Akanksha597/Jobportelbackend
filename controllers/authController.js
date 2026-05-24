const jwt = require("jsonwebtoken");
const User = require("../models/User");
const catchAsync = require("../utils/asyncErrorHandler");

// ================= TOKEN =================
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// ================= SIGNUP =================
exports.signup = catchAsync(async (req, res) => {
  const {
    name,
    email,
    password,
    confirmPassword,
    mobileNumber,
    role,
  } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Passwords do not match",
    });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "Email already exists",
    });
  }

  const newUser = await User.create({
    name,
    email,
    mobileNumber,
    password,
    confirmPassword,
    role: role || "user",
  });

  const token = createToken(newUser._id);

  res.status(201).json({
    success: true,
    token,
    user: newUser,
  });
});

// ================= LOGIN =================
exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email",
    });
  }

  const isMatch = await user.correctPassword(password, user.password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid password",
    });
  }

  const token = createToken(user._id);

  res.status(200).json({
    success: true,
    token,
    user,
  });
});

// ================= PROFILE =================
exports.getProfile = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    results: users.length,
    users,
  });
});

// ================= UPDATE PROFILE =================
exports.updateProfile = catchAsync(async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    user: updatedUser,
  });
});


// ================= GET SINGLE USER =================
exports.getSingleUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// ================= UPDATE USER =================
exports.updateUser = catchAsync(async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
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
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    user: updatedUser,
  });
});

// ================= DELETE USER =================
exports.deleteUser = catchAsync(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

// ================= LOGOUT =================
exports.logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out",
  });
};