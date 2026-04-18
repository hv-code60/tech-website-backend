# 📬 Contact Form Backend

A production-ready backend for handling **2 contact forms** with:
- ✅ **MongoDB** — stores all submissions
- ✅ **Brevo** — sends beautiful HTML emails to both user & admin
- ✅ **Rate limiting** — prevents spam
- ✅ **Input validation** — protects your data

---

## 📁 Project Structure

```
contact-backend/
├── server.js                    ← Entry point
├── config/
│   └── db.js                    ← MongoDB connection
├── models/
│   └── Contact.js               ← MongoDB schema
├── routes/
│   └── contactRoutes.js         ← API routes + validation
├── controllers/
│   └── contactController.js     ← Business logic
├── services/
│   └── emailService.js          ← Brevo email sending
├── templates/
│   └── emailTemplates.js        ← Beautiful HTML email templates
├── FRONTEND_EXAMPLES.js         ← Copy-paste frontend JS
├── .env.example                 ← Environment variable template
└── package.json
```

---

## 🚀 Setup Instructions

### Step 1 — Install Dependencies
```bash
cd contact-backend
npm install
```

### Step 2 — Setup MongoDB Atlas
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Click **Connect → Connect your application**
4. Copy the connection string (it looks like `mongodb+srv://...`)

### Step 3 — Setup Brevo
1. Go to [brevo.com](https://www.brevo.com) and create a free account
2. Go to **Settings → API Keys**
3. Create a new API key and copy it
4. Go to **Senders & Domains** → Add and verify your sender email

### Step 4 — Create .env file
```bash
cp .env.example .env
```
Then fill in your values:
```env
PORT=5000
NODE_ENV=development

MONGO_URI=mongodb+srv://youruser:yourpass@cluster0.xxxxx.mongodb.net/contact_db

BREVO_API_KEY=xkeysib-xxxxxxxxxxxxxxxx...

ADMIN_EMAIL=you@yourdomain.com
ADMIN_NAME=Your Name
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=Your Website

WEBSITE_NAME=Your Website Name
WEBSITE_URL=https://yourwebsite.com
FRONTEND_URL=https://yourfrontend.com
```

### Step 5 — Run the Server
```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

---

## 🔌 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/` | Health check |
| `POST` | `/api/contact/home` | Home page form |
| `POST` | `/api/contact/contact-page` | Contact page form |
| `GET` | `/api/contact/submissions` | View all submissions (protect in production!) |

---

## 📝 Form Fields

### Home Page Form (`/api/contact/home`)
| Field | Type | Required |
|-------|------|----------|
| name | string | ✅ Yes |
| email | string | ✅ Yes |
| message | string | ✅ Yes |

### Contact Page Form (`/api/contact/contact-page`)
| Field | Type | Required |
|-------|------|----------|
| name | string | ✅ Yes |
| email | string | ✅ Yes |
| phone | string | ❌ Optional |
| subject | string | ❌ Optional |
| message | string | ✅ Yes |

---

## 📧 Emails Sent

When someone submits a form:
1. **User gets** → A beautiful confirmation email showing their message summary
2. **Admin gets** → A notification email with all details and a quick-reply button

---

## 🛡️ Security Features
- Rate limiting: **5 requests per 15 minutes** per IP
- Input validation and sanitization
- Message size limits
- CORS protection

---

## ⚠️ Production Checklist
- [ ] Set `FRONTEND_URL` to your actual frontend domain (not `*`)
- [ ] Protect `/api/contact/submissions` with authentication middleware
- [ ] Use HTTPS (deploy on Railway, Render, or VPS with Nginx + SSL)
- [ ] Verify your sender email/domain in Brevo
