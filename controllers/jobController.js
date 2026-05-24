const Job = require("../models/Job");

// ======================================================
// CREATE JOB
// ======================================================

exports.createJob = async (req, res) => {
  try {
    const {
      postName,
    shortDescription,
      jobCategory,
      advertisementNumber,
      totalVacancy,
     categoryVacancy,

      releaseDate,
      startDate,
      endDate,

      qualification,

      minimumAge,
      maximumAge,

      applicationFees,

      applyOnlineLink,
      notificationLink,
      organizationWebsite,

      jobDescription,

      jobStatus,

      organization,
    } = req.body;

    // ======================================================
    // CREATE JOB
    // ======================================================

    const job = await Job.create({
      postName,
    shortDescription,
    jobCategory,
      advertisementNumber,
      totalVacancy,

      categoryVacancy,

      releaseDate,
      startDate,
      endDate,

      qualification,

      minimumAge,
      maximumAge,

      applicationFees,

      applyOnlineLink,
      notificationLink,
      organizationWebsite,

      jobDescription,

      jobStatus,

      organization,

      // LOGIN USER
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// GET ALL JOBS
// ======================================================

exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()

      .populate(
        "createdBy",
        "name email role"
      )

      .populate(
        "organization",
        "organizationName organizationShortCode organizationLogo"
      )

      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalJobs: jobs.length,
      jobs,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// GET MY JOBS
// ======================================================

exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      createdBy: req.user._id,
    })

      .populate(
        "createdBy",
        "name email role"
      )

      .populate(
        "organization",
        "organizationName organizationShortCode organizationLogo"
      );

    res.status(200).json({
      success: true,
      totalJobs: jobs.length,
      jobs,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// GET ALL JOBS FOR ALL ROLES
// ======================================================

exports.getMyAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("createdBy", "name email role")
      .populate(
        "organization",
        "organizationName organizationShortCode organizationLogo"
      )
      .sort({ createdAt: -1 });

    // ======================================================
    // JOB COUNT PER USER
    // ======================================================
    const userJobCount = {};

    jobs.forEach((job) => {
      const userId = job.createdBy?._id?.toString();

      if (userId) {
        userJobCount[userId] = (userJobCount[userId] || 0) + 1;
      }
    });

    // ======================================================
    // ATTACH COUNT TO createdBy
    // ======================================================
    const enrichedJobs = jobs.map((job) => {
      const userId = job.createdBy?._id?.toString();

      return {
        ...job._doc,
        createdBy: {
          ...job.createdBy?._doc,
          jobCount: userJobCount[userId] || 0,
        },
      };
    });

    res.status(200).json({
      success: true,
      totalJobs: jobs.length,
      jobs: enrichedJobs,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ======================================================
// GET SINGLE JOB
// ======================================================

exports.getSingleJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)

      .populate(
        "createdBy",
        "name email role"
      )

      .populate(
        "organization",
        "organizationName organizationShortCode organizationLogo"
      );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// UPDATE JOB
// ======================================================

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // ======================================================
    // ACCESS CHECK
    // ======================================================

    const isOwner =
      job.createdBy.toString() ===
      req.user._id.toString();

    const isModerator =
      req.user.role === "moderator";

    const isAdmin =
      req.user.role === "admin";

    if (
      !isOwner &&
      !isModerator &&
      !isAdmin
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // ======================================================
    // UPDATE
    // ======================================================

    const updatedJob =
      await Job.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    res.status(200).json({
      success: true,
      message:
        "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
};

// ======================================================
// DELETE JOB
// ======================================================

exports.deleteJob = async (req, res) => {
  try {
    // 1. AUTH CHECK
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    // 2. VALID JOB ID CHECK (IMPORTANT)
    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        message: "Job ID missing",
      });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // 3. SAFE CHECK FOR createdBy
    const createdById = job.createdBy
      ? job.createdBy.toString()
      : null;

    const userId = req.user._id.toString();
    const role = req.user.role;

    // 4. ROLE CHECK
    if (
      createdById !== userId &&
      role !== "admin" &&
      role !== "moderator" &&
      role !== "job_poster"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await job.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });

  } catch (error) {
    console.log("DELETE JOB ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};