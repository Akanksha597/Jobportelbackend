const Organization = require("../models/Organization");

// ======================================================
// CREATE ORGANIZATION
// ======================================================

exports.createOrganization = async (req, res) => {
  try {
    const {
      organizationName,
      organizationShortCode,
      organizationWebsite,
    } = req.body;

    if (!organizationName || !organizationShortCode) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const existing = await Organization.findOne({
      organizationShortCode,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Shortcode already exists",
      });
    }

    // 🔥 CLOUDINARY ALREADY HANDLES FILE
    const logoUrl = req.file ? req.file.path : "";

    const organization = await Organization.create({
      organizationName,
      organizationShortCode,
      organizationWebsite,
      organizationLogo: logoUrl,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      organization,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};



// ======================================================
// GET ALL ORGANIZATIONS
// ======================================================

// ======================================================
// GET ALL ORGANIZATIONS
// ======================================================

exports.getAllOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find()
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalOrganizations: organizations.length,
      organizations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ======================================================
// GET SINGLE ORGANIZATION
// ======================================================

exports.getSingleOrganization = async (req, res) => {
  try {
    const organization = await Organization.findById(
      req.params.id
    ).populate("createdBy", "name email role");

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    res.status(200).json({
      success: true,
      organization,
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
// UPDATE ORGANIZATION
// ======================================================

exports.updateOrganization = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    // OWNER CHECK
    if (
      organization.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // 🔥 HANDLE CLOUDINARY FILE
    let logoUrl = organization.organizationLogo;

    if (req.file) {
      logoUrl = req.file.path; // Cloudinary URL
    }

    const updatedOrganization = await Organization.findByIdAndUpdate(
      req.params.id,
      {
        organizationName: req.body.organizationName,
        organizationShortCode: req.body.organizationShortCode,
        organizationWebsite: req.body.organizationWebsite,
        organizationLogo: logoUrl, 
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("createdBy", "name email role");

    res.status(200).json({
      success: true,
      message: "Organization updated successfully",
      organization: updatedOrganization,
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
// GET ALL ORGANIZATIONS (ADMIN ONLY)
// ======================================================

exports.getAllOrganizationsAdmin = async (req, res) => {
  try {
    const organizations = await Organization.find()
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalOrganizations: organizations.length,
      organizations,
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
// DELETE ORGANIZATION
// ======================================================
exports.deleteOrganization = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    const isAdmin = req.user.role === "admin";
    const isOwner =
      organization.createdBy.toString() === req.user._id.toString();

    // Admin can delete everything.
    // Others can delete only their own organization.
    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "Not Authorized",
      });
    }

    await organization.deleteOne();

    res.status(200).json({
      success: true,
      message: "Organization deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};