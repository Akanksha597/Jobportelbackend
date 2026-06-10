const express = require("express");

const router = express.Router();

const {
  addRecentView,
  getRecentViewedJobs,
} = require("../controllers/RecentviewController");

const {
  protectRoute,
} = require("../middleware/protectRoute");

// Add Recent View
router.post(
  "/add",
  protectRoute,
  addRecentView
);

// Get Recent Views
router.get(
  "/recent-jobs",
  protectRoute,
  getRecentViewedJobs
);

module.exports = router;