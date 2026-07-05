const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    subject: {
      type: String,
      required: [true, "Subject is required"],
    },

    message: {
      type: String,
      required: [true, "Message is required"],
    },
    status: {
      type: String,
      default: "Pending",
    },

    replyMessage: String,

    replyDate: Date,
  
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Contact",
  contactSchema
);