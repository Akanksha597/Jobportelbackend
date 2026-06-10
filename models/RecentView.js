const mongoose = require("mongoose");

const recentViewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate records
recentViewSchema.index(
  {
    user: 1,
    job: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "RecentView",
  recentViewSchema
);