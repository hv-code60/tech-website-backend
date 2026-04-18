const Brevo = require("@getbrevo/brevo");
const { userConfirmationTemplate, adminNotificationTemplate } = require("../templates/emailTemplates");

// Initialize Brevo API client
const initBrevoClient = () => {
  const apiInstance = new Brevo.TransactionalEmailsApi();
  const apiKey = apiInstance.authentications["apiKey"];
  apiKey.apiKey = process.env.BREVO_API_KEY;
  return apiInstance;
};

/**
 * Send email using Brevo
 * @param {Object} to - { email, name }
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 */
const sendEmail = async (to, subject, html) => {
  const apiInstance = initBrevoClient();

  const sendSmtpEmail = new Brevo.SendSmtpEmail();

  sendSmtpEmail.sender = {
    name: process.env.FROM_NAME,
    email: process.env.FROM_EMAIL,
  };

  sendSmtpEmail.to = [{ email: to.email, name: to.name }];
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = html;

  const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
  return response;
};

/**
 * Send both user confirmation and admin notification emails
 * @param {Object} formData - The contact form data
 * @returns {Object} - Results of both email sends
 */
const sendContactEmails = async (formData) => {
  const websiteName = process.env.WEBSITE_NAME || "Our Website";
  const websiteUrl = process.env.WEBSITE_URL || "#";

  const templateData = {
    ...formData,
    websiteName,
    websiteUrl,
  };

  const results = { userEmail: false, adminEmail: false };

  // 1️⃣ Send confirmation to the user
  try {
    const userTemplate = userConfirmationTemplate(templateData);
    await sendEmail(
      { email: formData.email, name: formData.fullName },
      userTemplate.subject,
      userTemplate.html
    );
    results.userEmail = true;
    console.log(`✅ Confirmation email sent to user: ${formData.email}`);
  } catch (error) {
    console.error(`❌ Failed to send user email:`, error?.body || error.message);
  }

  // 2️⃣ Send notification to the admin
  try {
    const adminTemplate = adminNotificationTemplate(templateData);
    await sendEmail(
      { email: process.env.ADMIN_EMAIL, name: process.env.ADMIN_NAME || "Admin" },
      adminTemplate.subject,
      adminTemplate.html
    );
    results.adminEmail = true;
    console.log(`✅ Notification email sent to admin: ${process.env.ADMIN_EMAIL}`);
  } catch (error) {
    console.error(`❌ Failed to send admin email:`, error?.body || error.message);
  }

  return results;
};

module.exports = { sendContactEmails };
