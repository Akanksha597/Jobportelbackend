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
// GET SINGLE JOB
// ======================================================

router.get(
  "/:id",

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


router.delete(
  "/request-delete/:id",
  protectRoute,
  jobController.deleteJob
);

router.get(
  "/delete-requests",
  protectRoute,
  restrictTo("moderator", "admin"),
  jobController.getDeleteRequests
);

router.delete(
  "/approve-delete/:id",
  protectRoute,
  restrictTo("moderator", "admin"),
  jobController.approveDeleteJob
);

router.put(
  "/reject-delete/:id",
  protectRoute,
  restrictTo("moderator", "admin"),
  jobController.rejectDeleteRequest
);

module.exports = router;

