/**
 * Email Templates for "Send your query" Contact Forms
 */

const userConfirmationTemplate = ({
  fullName, email, phone, companyName,
  serviceNeeded, estimatedBudget, projectStage,
  projectDetails, formSource, websiteName, websiteUrl,
}) => {
  const year = new Date().getFullYear();
  const formLabel = formSource === "home" ? "Home Page" : "Contact Page";

  const row = (label, value) =>
    value ? `<tr>
      <td style="padding:13px 20px;border-bottom:1px solid #e2e8f0;vertical-align:top;">
        <span style="color:#718096;font-size:11px;text-transform:uppercase;letter-spacing:0.6px;font-weight:700;">${label}</span><br/>
        <span style="color:#2d3748;font-size:14px;font-weight:500;line-height:1.6;">${value}</span>
      </td>
    </tr>` : "";

  return {
    subject: `✅ We received your query – ${websiteName}`,
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:36px 16px;">
<tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

<!-- HEADER -->
<tr><td style="background:linear-gradient(135deg,#22c55e 0%,#16a34a 100%);border-radius:16px 16px 0 0;padding:44px 40px 36px;text-align:center;">
  <div style="font-size:40px;margin-bottom:14px;">🎉</div>
  <h1 style="color:#fff;margin:0 0 8px;font-size:26px;font-weight:700;">Query Received!</h1>
  <p style="color:rgba(255,255,255,0.88);margin:0;font-size:15px;">Thank you for reaching out. We'll get back to you shortly.</p>
</td></tr>

<!-- BODY -->
<tr><td style="background:#fff;padding:36px 40px;">
  <p style="color:#1a202c;font-size:17px;margin:0 0 6px;">Hi <strong>${fullName}</strong> 👋</p>
  <p style="color:#4a5568;font-size:15px;line-height:1.75;margin:0 0 28px;">
    We've received your query and our team is already reviewing it. You can expect a response within <strong>24–48 business hours</strong>.
  </p>
  <hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 28px;"/>
  <h2 style="color:#2d3748;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.7px;margin:0 0 14px;">📋 Your Query Summary</h2>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7fafc;border-radius:10px;border:1px solid #e2e8f0;overflow:hidden;border-collapse:collapse;">
    ${row("Full Name", fullName)}
    ${row("Email Address", email)}
    ${row("Phone Number", phone)}
    ${row("Company / Brand", companyName)}
    ${row("Service Needed", serviceNeeded)}
    ${estimatedBudget ? row("Estimated Budget", estimatedBudget) : ""}
    ${projectStage ? row("Project Stage", projectStage) : ""}
    <tr><td style="padding:13px 20px;">
      <span style="color:#718096;font-size:11px;text-transform:uppercase;letter-spacing:0.6px;font-weight:700;">Project Details</span><br/>
      <span style="color:#2d3748;font-size:14px;line-height:1.75;">${projectDetails.replace(/\n/g, "<br/>")}</span>
    </td></tr>
  </table>
  <div style="background:#f0fdf4;border-radius:10px;border-left:4px solid #22c55e;padding:20px 24px;margin-top:28px;">
    <p style="color:#15803d;font-size:14px;font-weight:700;margin:0 0 6px;">⏭️ What happens next?</p>
    <p style="color:#166534;font-size:14px;line-height:1.65;margin:0;">
      Our team will review your project requirements and reach out to <strong>${email}</strong> with the best next step.
    </p>
  </div>
</td></tr>

<!-- CTA -->
<tr><td style="background:#fff;padding:0 40px 36px;text-align:center;">
  <a href="${websiteUrl}" style="display:inline-block;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;text-decoration:none;padding:13px 36px;border-radius:50px;font-size:15px;font-weight:600;">Visit Our Website →</a>
</td></tr>

<!-- FOOTER -->
<tr><td style="background:#2d3748;border-radius:0 0 16px 16px;padding:26px 40px;text-align:center;">
  <p style="color:#a0aec0;font-size:13px;margin:0 0 4px;">© ${year} ${websiteName}. All rights reserved.</p>
  <p style="color:#718096;font-size:12px;margin:0;">This email was sent because you submitted our ${formLabel} query form.</p>
</td></tr>

</table></td></tr></table></body></html>`,
  };
};

const adminNotificationTemplate = ({
  fullName, email, phone, companyName,
  serviceNeeded, estimatedBudget, projectStage,
  projectDetails, formSource, websiteName, websiteUrl,
}) => {
  const year = new Date().getFullYear();
  const isHome = formSource === "home";
  const formLabel = isHome ? "🏠 Home Page" : "📄 Contact Page";
  const accent = isHome ? "#f59e0b" : "#8b5cf6";
  const accent2 = isHome ? "#ef4444" : "#6d28d9";
  const submittedAt = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "full", timeStyle: "short" });

  const card = (label, value, hl = false) =>
    value ? `<div style="background:#374151;border-radius:8px;padding:13px 16px;margin-bottom:10px;${hl ? `border-left:3px solid ${accent};` : ""}">
      <p style="color:#9ca3af;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 4px;font-weight:600;">${label}</p>
      <p style="color:#f9fafb;font-size:14px;font-weight:500;margin:0;line-height:1.5;">${value}</p>
    </div>` : "";

  return {
    subject: `🔔 New Query from ${fullName} – ${serviceNeeded || "General"} (${isHome ? "Home" : "Contact Page"})`,
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#111827;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#111827;padding:28px 16px;">
<tr><td align="center"><table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;">

<!-- HEADER -->
<tr><td style="background:linear-gradient(135deg,${accent} 0%,${accent2} 100%);border-radius:14px 14px 0 0;padding:32px 36px;text-align:center;">
  <p style="color:rgba(255,255,255,0.85);font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;font-weight:700;">${formLabel}</p>
  <h1 style="color:#fff;margin:0 0 8px;font-size:24px;font-weight:700;">New Query Received!</h1>
  <p style="color:rgba(255,255,255,0.82);font-size:13px;margin:0;">🕐 ${submittedAt} (IST)</p>
</td></tr>

<!-- CONTENT -->
<tr><td style="background:#1f2937;padding:30px 36px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
    <tr>
      <td width="49%" style="padding-right:8px;vertical-align:top;">${card("Full Name", fullName, true)}</td>
      <td width="49%" style="padding-left:8px;vertical-align:top;">
        <div style="background:#374151;border-radius:8px;padding:13px 16px;margin-bottom:10px;">
          <p style="color:#9ca3af;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 4px;font-weight:600;">Email Address</p>
          <p style="color:#60a5fa;font-size:13px;font-weight:500;margin:0;word-break:break-all;">${email}</p>
        </div>
      </td>
    </tr>
  </table>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
    <tr>
      <td width="49%" style="padding-right:8px;vertical-align:top;">${card("Phone Number", phone || "Not provided")}</td>
      <td width="49%" style="padding-left:8px;vertical-align:top;">${card("Company / Brand", companyName || "Not provided")}</td>
    </tr>
  </table>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
    <tr>
      <td width="49%" style="padding-right:8px;vertical-align:top;">${card("Service Needed", serviceNeeded || "Not specified", true)}</td>
      <td width="49%" style="padding-left:8px;vertical-align:top;">
        ${isHome ? card("Estimated Budget", estimatedBudget || "Not specified", true) : card("Project Stage", projectStage || "Not specified", true)}
      </td>
    </tr>
  </table>
  <h3 style="color:#d1d5db;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;margin:20px 0 10px;">💬 Project Details</h3>
  <div style="background:#374151;border-radius:8px;padding:18px 20px;border-left:4px solid ${accent};">
    <p style="color:#e5e7eb;font-size:14px;line-height:1.8;margin:0;white-space:pre-wrap;">${projectDetails}</p>
  </div>
  <div style="text-align:center;margin-top:28px;">
    <a href="mailto:${email}?subject=Re: Your query about ${serviceNeeded || "our services"}"
       style="display:inline-block;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;text-decoration:none;padding:13px 30px;border-radius:50px;font-size:14px;font-weight:600;">
      ↩️ Reply to ${fullName}
    </a>
  </div>
</td></tr>

<!-- BADGE -->
<tr><td style="background:#374151;padding:14px 36px;text-align:center;">
  <span style="display:inline-block;background:${accent};color:#fff;font-size:11px;font-weight:700;padding:5px 16px;border-radius:20px;">Submitted via: ${formLabel}</span>
</td></tr>

<!-- FOOTER -->
<tr><td style="background:#111827;border-radius:0 0 14px 14px;padding:22px 36px;text-align:center;">
  <p style="color:#4b5563;font-size:12px;margin:0;">© ${year} ${websiteName} Admin · <a href="${websiteUrl}" style="color:#60a5fa;text-decoration:none;">Visit Website</a></p>
</td></tr>

</table></td></tr></table></body></html>`,
  };
};

module.exports = { userConfirmationTemplate, adminNotificationTemplate };
