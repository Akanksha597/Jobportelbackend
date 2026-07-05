const express = require("express");

const router =
  express.Router();

const {
  createContact,
  getAllContacts,
  deleteContact,
  replyContact,
} = require(
  "../controllers/contactController"
);

// Public
router.post(
  "/contact",
  createContact
);
router.post("/reply/:id", replyContact);
// Admin
router.get(
  "/",
  getAllContacts
);

router.delete(
  "/contacts/:id",
  deleteContact
);

module.exports = router;