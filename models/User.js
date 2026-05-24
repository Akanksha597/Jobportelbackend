// ======================================================
// models/User.js
// CLEAN & PRODUCTION READY VERSION
// ======================================================

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Invalid email"],
    },

    mobileNumber: {
      type: String,
      default: "",
    },

    higherEducation: {
      type: String,
      default: "",
    },

    // 👑 ROLE SYSTEM
    role: {
      type: String,
      enum: ["user", "admin", "moderator", "job_poster"],
      default: "user",
    },
    // ORGANIZATION RELATION
organization: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Organization",
},

    // 🔐 PASSWORD (ONLY THIS IS STORED)
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },

    // 🔁 PASSWORD RESET
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
  
);



// ======================================================
// 🔐 HASH PASSWORD BEFORE SAVE
// ======================================================
// userSchema.pre("save", async function () {
//   if (!this.isModified("password")) return;

//   this.password = await bcrypt.hash(this.password, 12);
// });
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

// ======================================================
// 🔑 COMPARE PASSWORD (LOGIN CHECK)
// ======================================================
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};





// ======================================================
// 🔁 CREATE PASSWORD RESET TOKEN
// ======================================================
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 min

  return resetToken;
};





// ======================================================
// EXPORT MODEL
// ======================================================
module.exports = mongoose.model("User", userSchema);