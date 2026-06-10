const Job = require("../models/Job");
const Organization = require("../models/Organization");
const RecentView = require("../models/RecentView");
// ======================================================
// CREATE JOB
// ======================================================

exports.createJob = async (req, res) => {
  try {
    const {
      postName,
      locations,
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
      jobPostValidEndDate,
      organization,

      // CUSTOM HASHTAGS
      hashtags: customHashtags,
    } = req.body;

    // ======================================================
    // GET ORGANIZATION
    // ======================================================

    const organizationData =
      await Organization.findById(organization);

    if (!organizationData) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    // ======================================================
    // AUTO GENERATED HASHTAGS
    // ======================================================

    const autoTags = [
      `#${organizationData.organizationName.replace(
        /\s+/g,
        ""
      )}`,

      `#${organizationData.organizationShortCode.replace(
        /\s+/g,
        ""
      )}`,

      `#${postName.replace(/\s+/g, "")}`,

      ...(qualification || []).map(
        (q) =>
          `#${q.replace(/\s+/g, "")}`
      ),
    ];

    // ======================================================
    // CUSTOM HASHTAGS FROM FRONTEND
    // ======================================================

    const extraTags = customHashtags
      ? customHashtags
          .split(",")
          .map((tag) =>
            tag.trim().startsWith("#")
              ? tag.trim()
              : `#${tag.trim()}`
          )
      : [];

    // ======================================================
    // FINAL HASHTAGS
    // ======================================================

    const hashtags = [
      ...new Set([
        ...autoTags,
        ...extraTags,
      ]),
    ];

    // ======================================================
    // APPEND HASHTAGS TO DESCRIPTION
    // ======================================================

    const finalDescription = `
      ${jobDescription}

      <br/><br/>

      ${hashtags.join(" ")}
    `;

    // ======================================================
    // CREATE JOB
    // ======================================================

    const job = await Job.create({
      postName,
      shortDescription,
      locations,
      jobCategory,

      advertisementNumber,

      totalVacancy,

      categoryVacancy,

      releaseDate,
      startDate,
      endDate,

      qualification,

      age: {
        minimum: minimumAge || 18,
        maximum: maximumAge || 35,
      },

      applicationFees,

      applyOnlineLink,
      notificationLink,
      organizationWebsite,

      // DESCRIPTION
      jobDescription: finalDescription,

      // SAVE HASHTAGS
      hashtags,

      jobStatus,

      organization,

      jobPostValidEndDate,

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

    // =========================
    // SAVE RECENT VIEW
    // =========================
    if (req.user) {
      await RecentView.findOneAndUpdate(
        {
          user: req.user._id,
          job: job._id,
        },
        {},
        {
          upsert: true,
          new: true,
        }
      );
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

    const role = req.user.role;
    const userId = req.user._id.toString();

    // ==========================================
    // ADMIN & MODERATOR CAN EDIT ALL JOBS
    // ==========================================
    if (
      role === "admin" ||
      role === "moderator"
    ) {
      const updatedJob =
        await Job.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
            runValidators: true,
          }
        );

      return res.status(200).json({
        success: true,
        message: "Job updated successfully",
        job: updatedJob,
      });
    }

    // ==========================================
    // JOB POSTER
    // ==========================================
    if (role === "job_poster") {

      // Only own job
      if (
        job.createdBy.toString() !== userId
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You can edit only your own jobs",
        });
      }

      // Only Draft or Inreview
      if (
        job.jobStatus !== "Draft" &&
        job.jobStatus !== "Inreview"
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You can edit only Draft or Inreview jobs",
        });
      }

      // Job Poster cannot change status
      delete req.body.jobStatus;

      const updatedJob =
        await Job.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
            runValidators: true,
          }
        );

      return res.status(200).json({
        success: true,
        message: "Job updated successfully",
        job: updatedJob,
      });
    }

    return res.status(403).json({
      success: false,
      message: "Not authorized",
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
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
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const userId = req.user._id.toString();
    const role = req.user.role;

    // ==========================================
    // ADMIN CAN DELETE ANY JOB
    // ==========================================
    if (role === "admin") {
      await job.deleteOne();

      return res.status(200).json({
        success: true,
        message: "Job deleted successfully",
      });
    }

    // ==========================================
    // MODERATOR DELETE ONLY DRAFT / INREVIEW
    // ==========================================
    if (role === "moderator") {
      if (
        job.jobStatus !== "draft" &&
        job.jobStatus !== "inreview"
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Moderator can delete only Draft or In Review jobs",
        });
      }

      await job.deleteOne();

      return res.status(200).json({
        success: true,
        message: "Job deleted successfully",
      });
    }

    // ==========================================
    // JOB POSTER DELETE ONLY OWN DRAFT / INREVIEW
    // ==========================================
    if (role === "job_poster") {
      if (job.createdBy.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: "Not authorized",
        });
      }

      if (
        job.jobStatus !== "draft" &&
        job.jobStatus !== "inreview"
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You can delete only Draft or In Review jobs",
        });
      }

      await job.deleteOne();

      return res.status(200).json({
        success: true,
        message: "Job deleted successfully",
      });
    }

    return res.status(403).json({
      success: false,
      message: "Not authorized",
    });

  } catch (error) {
    console.log("DELETE JOB ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// APPROVE DELETE JOB
// ======================================================

exports.approveDeleteJob =
  async (req, res) => {

    try {

      // Only moderator/admin
      if (
        req.user.role !== "admin" &&
        req.user.role !== "moderator"
      ) {
        return res.status(403).json({
          success: false,
          message: "Not authorized",
        });
      }

      const job = await Job.findById(
        req.params.id
      );

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found",
        });
      }

      await job.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Delete request approved and job deleted",
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
// GET DELETE REQUESTS
// ======================================================

exports.getDeleteRequests =
  async (req, res) => {

    try {

      const jobs = await Job.find({
        deleteRequested: true,
      })

        .populate(
          "createdBy",
          "name email role"
        )

        .populate(
          "organization",
          "organizationName organizationShortCode"
        )

        .sort({
          deleteRequestDate: -1,
        });

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
// REJECT DELETE REQUEST
// ======================================================

exports.rejectDeleteRequest =
  async (req, res) => {

    try {

      const job = await Job.findById(
        req.params.id
      );

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found",
        });
      }

      job.deleteRequested = false;

      job.deleteRequestedBy = null;

      job.deleteRequestDate = null;

      await job.save();

      res.status(200).json({
        success: true,
        message:
          "Delete request rejected successfully",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
};