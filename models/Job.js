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

        locations: [
            {
                type: String,
                trim: true,
            },
        ],


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
            female: {
                type: Number,
                default: 0,
            },

            Transgender: {
                type: Number,
                default: 0,
            },
            OR: {
                type: Number,
                default: 0,
            },
            PWBD: {
                type: Number,
                default: 0,

            },
            ExServiced: {
                type: Number,
                default: 0,

            },

            obc: {
                type: Number,
                default: 0,
            },
            EWS: {
                type: Number,
                default: 0,
            }


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

        age: {
            minimum: {
                type: Number,
                default: 18,
            },
            maximum: {
                type: Number,
                default: 35,
            },
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
            female: {
                type: Number,
                default: 0,
            },

            Transgender: {
                type: Number,
                default: 0,
            },
            OR: {
                type: Number,
                default: 0,
            },
            PWBD: {
                type: Number,
                default: 0,

            },
            ExServiced: {
                type: Number,
                default: 0,

            },

            obc: {
                type: Number,
                default: 0,
            },
            Ews: {
                type: Number,
                default: 0,
            }

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
                "Draft",
                "Review",
                "Published",
                "Rejected",
                "Expired",
                "Inreview"
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
        // JOB POST VALIDITY
        // ======================================================

        jobPostValidEndDate: {
            type: Date,
            required: [true, "Job post valid end date is required"],
        },

        hashtags: [
            {
                type: String,
            },
        ],

        deleteRequested: {
            type: Boolean,
            default: false,
        },

        deleteRequestedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        deleteRequestDate: {
            type: Date,
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