const express = require("express");

const router =
  express.Router();

const {
  createContact,
  getAllContacts,
  deleteContact,
} = require(
  "../controllers/contactController"
);

// Public
router.post(
  "/contact",
  createContact
);

// Admin
router.get(
  "/contacts",
  getAllContacts
);

router.delete(
  "/contacts/:id",
  deleteContact
);

module.exports = router;