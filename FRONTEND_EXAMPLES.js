/**
 * ================================================================
 *  FRONTEND INTEGRATION — Exact dropdown values from your UI
 * ================================================================
 */

const API_BASE = "https://tech-website-backend-production.up.railway.app/"; // ← Change to your deployed backend URL

// ─────────────────────────────────────────────────────────────
// DROPDOWN OPTIONS  (exact match to your UI screenshots)
// These are also returned by GET /api/contact/options
// ─────────────────────────────────────────────────────────────
const SERVICE_OPTIONS = [
  "Custom Software Development",
  "Web & Portal Development",
  "Mobile Applications",
  "AI & Automation",
  "Cloud & DevOps",
  "UI/UX Design",
];

const BUDGET_OPTIONS = [          // Home page only
  "Under ₹50K",
  "₹50K – ₹1L",
  "₹1L – ₹3L",
  "₹3L – ₹5L",
  "₹5L+",
];

const PROJECT_STAGE_OPTIONS = [   // Contact page only
  "Just an idea",
  "Planning phase",
  "Designs ready",
  "Ready to start development",
  "Improving an existing product",
];

// ─────────────────────────────────────────────────────────────
// AUTO-POPULATE DROPDOWNS ON PAGE LOAD
// ─────────────────────────────────────────────────────────────
function populateSelect(id, options, placeholder) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML =
    `<option value="">${placeholder}</option>` +
    options.map(o => `<option value="${o}">${o}</option>`).join("");
}

// Call this on DOMContentLoaded for whichever page you're on
function initHomeForm() {
  populateSelect("serviceNeeded",   SERVICE_OPTIONS, "Select a service");
  populateSelect("estimatedBudget", BUDGET_OPTIONS,  "Select budget range");
}

function initContactForm() {
  populateSelect("serviceNeeded", SERVICE_OPTIONS,       "Select a service");
  populateSelect("projectStage",  PROJECT_STAGE_OPTIONS, "Select current stage");
}

// ─────────────────────────────────────────────────────────────
// 1. HOME PAGE FORM SUBMIT
// ─────────────────────────────────────────────────────────────
async function submitHomeForm(event) {
  event.preventDefault();
  const btn = event.target.querySelector("button[type=submit]");
  btn.disabled = true;
  btn.textContent = "Sending...";

  const payload = {
    fullName:        document.getElementById("fullName").value,
    email:           document.getElementById("email").value,
    phone:           document.getElementById("phone").value           || null,
    companyName:     document.getElementById("companyName").value     || null,
    serviceNeeded:   document.getElementById("serviceNeeded").value   || null,
    estimatedBudget: document.getElementById("estimatedBudget").value || null,
    projectDetails:  document.getElementById("projectDetails").value,
  };

  try {
    const res  = await fetch(`${API_BASE}/api/contact/home`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (data.success) {
      showSuccess(data.message);
      event.target.reset();
    } else {
      showErrors(data.errors || [{ message: data.message }]);
    }
  } catch {
    alert("❌ Network error. Please try again.");
  } finally {
    btn.disabled = false;
    btn.textContent = "Submit Query";
  }
}

// ─────────────────────────────────────────────────────────────
// 2. CONTACT PAGE FORM SUBMIT
// ─────────────────────────────────────────────────────────────
async function submitContactForm(event) {
  event.preventDefault();
  const btn = event.target.querySelector("button[type=submit]");
  btn.disabled = true;
  btn.textContent = "Sending...";

  const payload = {
    fullName:       document.getElementById("fullName").value,
    email:          document.getElementById("email").value,
    phone:          document.getElementById("phone").value          || null,
    companyName:    document.getElementById("companyName").value    || null,
    serviceNeeded:  document.getElementById("serviceNeeded").value  || null,
    projectStage:   document.getElementById("projectStage").value   || null,
    projectDetails: document.getElementById("projectDetails").value,
  };

  try {
    const res  = await fetch(`${API_BASE}/api/contact/contact-page`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (data.success) {
      showSuccess(data.message);
      event.target.reset();
    } else {
      showErrors(data.errors || [{ message: data.message }]);
    }
  } catch {
    alert("❌ Network error. Please try again.");
  } finally {
    btn.disabled = false;
    btn.textContent = "Submit Query";
  }
}

// ─────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────
function showSuccess(message) {
  // Replace with your toast/modal UI as needed
  alert("✅ " + message);
}

function showErrors(errors) {
  const msg = errors.map(e => `• ${e.message}`).join("\n");
  alert("Please fix the following:\n" + msg);
}

// ─────────────────────────────────────────────────────────────
// 4. HTML — Copy into your pages
// ─────────────────────────────────────────────────────────────

/*
  ── HOME PAGE (index.html) ──────────────────────────────────

  <script src="contact.js"></script>  ← include this file
  <script>document.addEventListener("DOMContentLoaded", initHomeForm);</script>

  <form onsubmit="submitHomeForm(event)">
    <div class="form-row">
      <input id="fullName"        type="text"  placeholder="Enter your name"       required />
      <input id="email"           type="email" placeholder="Enter your email"      required />
    </div>
    <div class="form-row">
      <input id="phone"           type="tel"   placeholder="Enter your phone"               />
      <input id="companyName"     type="text"  placeholder="Your company or brand"          />
    </div>
    <div class="form-row">
      <select id="serviceNeeded"></select>      ← auto-populated
      <select id="estimatedBudget"></select>    ← auto-populated
    </div>
    <textarea id="projectDetails"
      placeholder="Tell us about your requirement, goals, timeline, or any specific features you need"
      required></textarea>
    <button type="submit">Submit Query</button>
  </form>


  ── CONTACT PAGE (contact.html) ─────────────────────────────

  <script src="contact.js"></script>
  <script>document.addEventListener("DOMContentLoaded", initContactForm);</script>

  <form onsubmit="submitContactForm(event)">
    <div class="form-row">
      <input id="fullName"       type="text"  placeholder="Enter your name"       required />
      <input id="email"          type="email" placeholder="Enter your email"      required />
    </div>
    <div class="form-row">
      <input id="phone"          type="tel"   placeholder="Enter your phone"               />
      <input id="companyName"    type="text"  placeholder="Your company or brand"          />
    </div>
    <div class="form-row">
      <select id="serviceNeeded"></select>     ← auto-populated
      <select id="projectStage"></select>      ← auto-populated
    </div>
    <textarea id="projectDetails"
      placeholder="Tell us about your requirement, goals, expected timeline, and any specific features or challenges"
      required></textarea>
    <button type="submit">Submit Query</button>
  </form>
*/
