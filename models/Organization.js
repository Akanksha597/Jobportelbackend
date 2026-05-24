const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema(
  {
    organizationName: {
      type: String,
      required: true,
      trim: true,
    },

    organizationShortCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    organizationWebsite: {
      type: String,
      default: "",
    },

    organizationLogo: {
      type: String,
      default: "",
    },

    // OWNER USER
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Organization",
  organizationSchema
);