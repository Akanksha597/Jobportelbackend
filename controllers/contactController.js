const Contact = require("../models/Contact");

const sendEmail = require("../config/email");

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

  exports.replyContact = async (req, res) => {
  try {
    const { subject, message } = req.body;

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    await sendEmail({
      to: contact.email,
      subject,
      html: `
        <h2>Hello ${contact.name},</h2>

        <p>${message}</p>

        <br/>

        <p>Regards,</p>
        <strong>Your Company Team</strong>
      `,
    });

    contact.replyMessage = message;
    contact.replyDate = new Date();
    contact.status = "Replied";

    await contact.save();

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to send email",
    });
  }
};