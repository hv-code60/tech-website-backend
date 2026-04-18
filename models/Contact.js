const mongoose = require("mongoose");

// ── Exact dropdown values matching the UI ─────────────────────────────────
const SERVICE_OPTIONS = [
  "Custom Software Development",
  "Web & Portal Development",
  "Mobile Applications",
  "AI & Automation",
  "Cloud & DevOps",
  "UI/UX Design",
];

const BUDGET_OPTIONS = [
  "Under ₹50K",
  "₹50K – ₹1L",
  "₹1L – ₹3L",
  "₹3L – ₹5L",
  "₹5L+",
];

const PROJECT_STAGE_OPTIONS = [
  "Just an idea",
  "Planning phase",
  "Designs ready",
  "Ready to start development",
  "Improving an existing product",
];

const contactSchema = new mongoose.Schema(
  {
    // Which form submitted this entry
    formSource: {
      type: String,
      enum: ["home", "contact_page"],
      required: true,
    },

    // ── Common fields (both forms) ────────────────────────────────────────
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      trim: true,
      default: null,
    },
    companyName: {
      type: String,
      trim: true,
      default: null,
    },
    serviceNeeded: {
      type: String,
      enum: [...SERVICE_OPTIONS, null],
      default: null,
    },
    projectDetails: {
      type: String,
      required: [true, "Project details are required"],
      trim: true,
      maxlength: [3000, "Project details cannot exceed 3000 characters"],
    },

    // ── Home page only ────────────────────────────────────────────────────
    estimatedBudget: {
      type: String,
      enum: [...BUDGET_OPTIONS, null],
      default: null,
    },

    // ── Contact page only ─────────────────────────────────────────────────
    projectStage: {
      type: String,
      enum: [...PROJECT_STAGE_OPTIONS, null],
      default: null,
    },

    // Status tracking
    status: {
      type: String,
      enum: ["new", "read", "replied", "archived"],
      default: "new",
    },

    // Email delivery tracking
    emailsSent: {
      userEmail: { type: Boolean, default: false },
      adminEmail: { type: Boolean, default: false },
    },

    ipAddress: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

contactSchema.index({ email: 1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ status: 1 });
contactSchema.index({ formSource: 1 });

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
module.exports.SERVICE_OPTIONS = SERVICE_OPTIONS;
module.exports.BUDGET_OPTIONS = BUDGET_OPTIONS;
module.exports.PROJECT_STAGE_OPTIONS = PROJECT_STAGE_OPTIONS;
