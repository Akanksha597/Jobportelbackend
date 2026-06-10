const Contact = require("../models/Contact");

// ==============================
// CREATE CONTACT MESSAGE
// ==============================

exports.createContact = async (
  req,
  res
) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      message,
    } = req.body;

    if (
      !name ||
      !email ||
      !subject ||
      !message
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please fill all required fields",
      });
    }

    const contact =
      await Contact.create({
        name,
        email,
        phone,
        subject,
        message,
      });

    res.status(201).json({
      success: true,
      message:
        "Message sent successfully",
      data: contact,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Something went wrong",
    });
  }
};

// ==============================
// GET ALL CONTACTS
// ==============================

exports.getAllContacts =
  async (req, res) => {
    try {
      const contacts =
        await Contact.find().sort({
          createdAt: -1,
        });

      res.status(200).json({
        success: true,
        count: contacts.length,
        data: contacts,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Failed to fetch contacts",
      });
    }
  };

// ==============================
// DELETE CONTACT
// ==============================

exports.deleteContact =
  async (req, res) => {
    try {
      const contact =
        await Contact.findByIdAndDelete(
          req.params.id
        );

      if (!contact) {
        return res.status(404).json({
          success: false,
          message:
            "Contact not found",
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Contact deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Failed to delete contact",
      });
    }
  };