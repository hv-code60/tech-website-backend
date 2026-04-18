const { validationResult } = require("express-validator");
const Contact = require("../models/Contact");
const { sendContactEmails } = require("../services/emailService");

/**
 * Handle HOME PAGE "Send your query" form
 * Fields: fullName, email, phone, companyName, serviceNeeded, estimatedBudget, projectDetails
 */
const submitHomeForm = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed. Please check your inputs.",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }

  try {
    const { fullName, email, phone, companyName, serviceNeeded, estimatedBudget, projectDetails } = req.body;

    const contact = await Contact.create({
      formSource: "home",
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      companyName: companyName?.trim() || null,
      serviceNeeded: serviceNeeded || null,
      estimatedBudget: estimatedBudget || null,
      projectDetails: projectDetails.trim(),
      ipAddress: req.ip,
    });

    const emailResults = await sendContactEmails({
      fullName: contact.fullName,
      email: contact.email,
      phone: contact.phone,
      companyName: contact.companyName,
      serviceNeeded: contact.serviceNeeded,
      estimatedBudget: contact.estimatedBudget,
      projectDetails: contact.projectDetails,
      formSource: "home",
    });

    contact.emailsSent = emailResults;
    await contact.save();

    return res.status(201).json({
      success: true,
      message: "Thank you! Your query has been received. We'll get back to you with the best next step.",
      data: { id: contact._id, name: contact.fullName, email: contact.email, submittedAt: contact.createdAt },
    });
  } catch (error) {
    console.error("❌ Home form error:", error.message);
    return res.status(500).json({ success: false, message: "Something went wrong. Please try again later." });
  }
};

/**
 * Handle CONTACT PAGE "Send your query" form
 * Fields: fullName, email, phone, companyName, serviceNeeded, projectStage, projectDetails
 */
const submitContactForm = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed. Please check your inputs.",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }

  try {
    const { fullName, email, phone, companyName, serviceNeeded, projectStage, projectDetails } = req.body;

    const contact = await Contact.create({
      formSource: "contact_page",
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      companyName: companyName?.trim() || null,
      serviceNeeded: serviceNeeded || null,
      projectStage: projectStage || null,
      projectDetails: projectDetails.trim(),
      ipAddress: req.ip,
    });

    const emailResults = await sendContactEmails({
      fullName: contact.fullName,
      email: contact.email,
      phone: contact.phone,
      companyName: contact.companyName,
      serviceNeeded: contact.serviceNeeded,
      projectStage: contact.projectStage,
      projectDetails: contact.projectDetails,
      formSource: "contact_page",
    });

    contact.emailsSent = emailResults;
    await contact.save();

    return res.status(201).json({
      success: true,
      message: "Your query has been sent! We'll connect with you and recommend the right approach.",
      data: { id: contact._id, name: contact.fullName, email: contact.email, submittedAt: contact.createdAt },
    });
  } catch (error) {
    console.error("❌ Contact form error:", error.message);
    return res.status(500).json({ success: false, message: "Something went wrong. Please try again later." });
  }
};

/**
 * Admin: Get all submissions
 */
const getAllSubmissions = async (req, res) => {
  try {
    const { formSource, status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (formSource) filter.formSource = formSource;
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [submissions, total] = await Promise.all([
      Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).select("-ipAddress"),
      Contact.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      data: submissions,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { submitHomeForm, submitContactForm, getAllSubmissions };
