const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        // ======================================================
        // BASIC JOB DETAILS
        // ======================================================

        postName: {
            type: String,
            required: [true, "Post name is required"],
            trim: true,
        },
        jobCategory: {
            type: String,
            required: [true, "Job category is required"],
            trim: true,
        },

        advertisementNumber: {
            type: String,
            required: [true, "Advertisement number is required"],
            trim: true,
        },

        totalVacancy: {
            type: Number,
            required: [true, "Total vacancy required"],
        },

        ShortDescription: {
            type: String,
            default: "",
        },

        // ======================================================
        // CATEGORY VACANCY
        // ======================================================

        categoryVacancy: {
            general: {
                type: Number,
                default: 0,
            },

            sc: {
                type: Number,
                default: 0,
            },

            st: {
                type: Number,
                default: 0,
            },

            nt: {
                type: Number,
                default: 0,
            },

            obc: {
                type: Number,
                default: 0,
            },

            ews: {
                type: Number,
                default: 0,
            },
        },

        // ======================================================
        // IMPORTANT DATES
        // ======================================================

        releaseDate: {
            type: Date,
        },

        startDate: {
            type: Date,
        },

        endDate: {
            type: Date,
        },

        publishDate: {
            type: Date,
            default: Date.now,
        },

        // ======================================================
        // QUALIFICATION
        // ======================================================

        qualification: [
            {
                type: String,
            },
        ],

        // ======================================================
        // AGE LIMIT
        // ======================================================

        minimumAge: {
            type: Number,
            default: 18,
        },

        maximumAge: {
            type: Number,
            default: 35,
        },

        // ======================================================
        // APPLICATION FEES
        // ======================================================

        applicationFees: {
            general: {
                type: Number,
                default: 0,
            },

            sc: {
                type: Number,
                default: 0,
            },

            st: {
                type: Number,
                default: 0,
            },

            nt: {
                type: Number,
                default: 0,
            },

            obc: {
                type: Number,
                default: 0,
            },
        },

        // ======================================================
        // LINKS
        // ======================================================

        applyOnlineLink: {
            type: String,
            default: "",
        },

        notificationLink: {
            type: String,
            default: "",
        },

        organizationWebsite: {
            type: String,
            default: "",
        },

        // ======================================================
        // DESCRIPTION
        // ======================================================

        jobDescription: {
            type: String,
            required: [true, "Job description required"],
        },

        // ======================================================
        // STATUS
        // ======================================================

        jobStatus: {
            type: String,
            enum: [
                "Review",
                "Published",
                "Rejected",
                "Expired",
            ],
            default: "Draft",
        },

        // ======================================================
        // ORGANIZATION RELATION
        // ======================================================

        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
        },

        // ======================================================
        // CREATED BY
        // ======================================================

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

module.exports = mongoose.model("Job", jobSchema);