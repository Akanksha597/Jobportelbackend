const RecentView = require("../models/RecentView");

// ======================================
// ADD RECENT VIEW
// ======================================

exports.addRecentView = async (
  req,
  res
) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID required",
      });
    }

    const existing =
      await RecentView.findOne({
        user: req.user._id,
        job: jobId,
      });

    // If already viewed update timestamp
    if (existing) {
      existing.updatedAt = Date.now();

      await existing.save();

      return res.status(200).json({
        success: true,
        message: "Recent view updated",
      });
    }

    // Create new record
    await RecentView.create({
      user: req.user._id,
      job: jobId,
    });

    res.status(201).json({
      success: true,
      message: "Recent view added",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// GET RECENT VIEWED JOBS
// ======================================

exports.getRecentViewedJobs =
  async (req, res) => {
    try {
      const jobs =
        await RecentView.find({
          user: req.user._id,
        })
          .populate({
            path: "job",
            populate: {
              path: "organization",
            },
          })
          .sort({
            updatedAt: -1,
          })
          .limit(10);

      res.status(200).json({
        success: true,
        jobs,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };