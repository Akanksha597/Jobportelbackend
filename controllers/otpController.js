const nodemailer = require("nodemailer");
const OTP = require("../models/Otp");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// ================= CREATE JWT =================

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

// ================= EMAIL TRANSPORTER =================

const transporter =
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user:
        process.env.EMAIL_USER,
      pass:
        process.env.EMAIL_PASS,
    },
  });

// ================= SEND OTP =================

exports.sendOTP = async (
  req,
  res
) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message:
          "Email is required",
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
          "Email already registered",
      });
    }

    const otp = Math.floor(
      100000 +
        Math.random() * 900000
    ).toString();

    await OTP.deleteMany({
      email,
    });

    await OTP.create({
      email,
      otp,
    });

    await transporter.sendMail({
      from:
        process.env.EMAIL_USER,
      to: email,
      subject:
        "Email Verification OTP",
      html: `
        <div style="font-family:Arial,sans-serif;padding:20px">
          <h2>Email Verification</h2>

          <p>
            Your OTP for account verification is:
          </p>

          <h1 style="color:#0f52ba">
            ${otp}
          </h1>

          <p>
            This OTP is valid for
            10 minutes.
          </p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message:
        "OTP sent successfully",
    });
  } catch (error) {
    console.error(
      "SEND OTP ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= VERIFY OTP & REGISTER =================

exports.verifyOtpAndRegister =
  async (req, res) => {
    try {
      const {
        name,
        email,
        password,
      
        mobileNumber,
        startDate,
        endDate,
        role,
        otp,
      } = req.body;

      if (
        !name ||
        !email ||
        !mobileNumber ||
        !password ||
      
        !otp
      ) {
        return res.status(400).json({
          success: false,
          message:
            "All fields are required",
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
            "User already exists",
        });
      }

      const otpRecord =
        await OTP.findOne({
          email,
        }).sort({
          createdAt: -1,
        });

      if (!otpRecord) {
        return res.status(400).json({
          success: false,
          message:
            "OTP expired or not found",
        });
      }

      if (
        otpRecord.otp !== otp
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid OTP",
        });
      }

      const user =
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

      await OTP.deleteMany({
        email,
      });

      const token =
        createToken(user._id);

      return res.status(201).json({
        success: true,
        message:
          "Registration Successful",
        token,
        user,
      });
    } catch (error) {
      console.error(
        "REGISTER ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
