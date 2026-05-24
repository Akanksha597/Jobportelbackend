const express = require("express");

const router = express.Router();

const jobController = require("../controllers/jobController");

// 👇 YOUR MIDDLEWARE
const {
  protectRoute,
  restrictTo,
} = require("../middleware/protectRoute");

// ======================================================
// CREATE JOB
// ======================================================

router.post(
  "/create",
  protectRoute,

  jobController.createJob
);

// ======================================================
// GET ALL JOBS
// ======================================================

router.get(
  "/",
  jobController.getAllJobs
);

// ======================================================
// GET MY JOBS
// ======================================================

router.get(
  "/my-jobs",
  protectRoute,

  jobController.getMyJobs
);

// ======================================================
// GET ALL JOBS FOR ALL ROLES
// ======================================================

router.get(
  "/all-jobs",
  protectRoute,

  jobController.getMyAllJobs
);

// ======================================================
// DELETE JOB
// ======================================================

router.delete(
  "/:id",
  protectRoute,

  jobController.deleteJob
);

// ======================================================
// GET SINGLE JOB
// ======================================================

router.get(
  "/:id",
  protectRoute,
  jobController.getSingleJob
);
// ======================================================
// UPDATE JOB
// ======================================================

router.put(
  "/:id",
  protectRoute,
  jobController.updateJob
);

module.exports = router;

