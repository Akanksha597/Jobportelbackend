const express = require("express");
const upload = require("../middleware/upload");
const router = express.Router();

const organizationController = require(
  "../controllers/organizationController"
);

const {
  protectRoute,
  restrictTo,
} = require("../middleware/protectRoute");

// CREATE
router.post(
  "/create",
  protectRoute,
  restrictTo("admin", "job_poster"),
  upload.single("organizationLogo"), // IMPORTANT
  organizationController.createOrganization
);
// GET ALL
router.get(
  "/",
  protectRoute,
  organizationController.getAllOrganizations
);

// UPDATE
router.put(
  "/:id",
  protectRoute,
  restrictTo("admin", "job_poster" , "moderator"),
  upload.single("organizationLogo"),
  organizationController.updateOrganization
);

// DELETE
router.delete(
  "/:id",
  protectRoute,
  restrictTo("admin", "job_poster" ,"moderator"),
  organizationController.deleteOrganization
);

// GET SINGLE ORGANIZATION
router.get(
  "/:id",
  protectRoute,
  organizationController.getSingleOrganization
);

// GET ALL ORGANIZATIONS FOR ADMIN
router.get(
  "/admin/all",
  protectRoute,
  restrictTo("admin", "moderator"),
  organizationController.getAllOrganizationsAdmin
);

module.exports = router;