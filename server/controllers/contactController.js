const mongoose = require('mongoose');
const Contact = require('../models/Contact');

// GET all contacts
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contacts',
      error: error.message,
    });
  }
};

// CREATE contact
exports.createContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and phone are required',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    const newContact = new Contact({
      name,
      email,
      phone,
      message: message || '',
    });

    await newContact.save();

    res.status(201).json({
      success: true,
      message: 'Contact created successfully',
      data: newContact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating contact',
      error: error.message,
    });
  }
};

// DELETE contact
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid contact ID',
      });
    }

    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found',
      });
    }

    res.json({
      success: true,
      message: 'Contact deleted successfully',
      data: deletedContact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting contact',
      error: error.message,
    });
  }
};
