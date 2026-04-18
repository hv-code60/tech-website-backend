const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const rateLimit = require("express-rate-limit");
const { submitHomeForm, submitContactForm, getAllSubmissions } = require("../controllers/contactController");

// Rate limiter: max 5 submissions per 15 min per IP
const formRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: "Too many submissions. Please wait 15 minutes before trying again." },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Exact dropdown values matching your UI ────────────────────────────────
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

// ── Shared validators ──────────────────────────────────────────────────────
const fullNameValidator = body("fullName")
  .trim().notEmpty().withMessage("Full name is required")
  .isLength({ min: 2, max: 100 }).withMessage("Name must be 2–100 characters");

const emailValidator = body("email")
  .trim().notEmpty().withMessage("Email is required")
  .isEmail().withMessage("Please enter a valid email address")
  .normalizeEmail();

const phoneValidator = body("phone")
  .optional({ nullable: true, checkFalsy: true })
  .trim().isMobilePhone("any").withMessage("Please enter a valid phone number");

const companyValidator = body("companyName")
  .optional({ nullable: true, checkFalsy: true })
  .trim().isLength({ max: 150 }).withMessage("Company name too long");

const serviceValidator = body("serviceNeeded")
  .optional({ nullable: true, checkFalsy: true })
  .isIn(SERVICE_OPTIONS).withMessage("Please select a valid service");

const projectDetailsValidator = body("projectDetails")
  .trim().notEmpty().withMessage("Project details are required")
  .isLength({ min: 10, max: 3000 }).withMessage("Please describe your project (10–3000 characters)");

// ── Routes ─────────────────────────────────────────────────────────────────

/**
 * POST /api/contact/home
 * Home page form — has "Estimated Budget" dropdown
 */
router.post("/home", formRateLimit, [
  fullNameValidator,
  emailValidator,
  phoneValidator,
  companyValidator,
  serviceValidator,
  body("estimatedBudget")
    .optional({ nullable: true, checkFalsy: true })
    .isIn(BUDGET_OPTIONS).withMessage("Please select a valid budget range"),
  projectDetailsValidator,
], submitHomeForm);

/**
 * POST /api/contact/contact-page
 * Contact page form — has "Project Stage" dropdown
 */
router.post("/contact-page", formRateLimit, [
  fullNameValidator,
  emailValidator,
  phoneValidator,
  companyValidator,
  serviceValidator,
  body("projectStage")
    .optional({ nullable: true, checkFalsy: true })
    .isIn(PROJECT_STAGE_OPTIONS).withMessage("Please select a valid project stage"),
  projectDetailsValidator,
], submitContactForm);

/**
 * GET /api/contact/submissions
 * Admin: view all submissions
 * ⚠️ Add auth middleware before deploying to production!
 */
router.get("/submissions", getAllSubmissions);

/**
 * GET /api/contact/options
 * Returns all dropdown options for the frontend to consume
 */
router.get("/options", (req, res) => {
  res.json({
    success: true,
    data: { SERVICE_OPTIONS, BUDGET_OPTIONS, PROJECT_STAGE_OPTIONS },
  });
});

module.exports = router;
