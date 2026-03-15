# AuraCRM Base: AI Sales Assistant

!✨AuraCRM(public/vite.svg)

**AuraCRM Base** is a next-generation, AI-powered sales assistant designed to transform your CRM pipeline with intelligent, real-time insights. Built as a sleek, modern React application, it acts as your personal AI sales coach, analyzing customer data, highlighting risks, automating communications, and predicting deal success.

---

## 🌟 Key Features

### 1. **Interactive AI Dashboard**
A powerful, centralized hub providing a bird's-eye view of your sales pipeline.
- **Top Deals Tracker:** Monitor high-value opportunities at a glance.
- **AI Alert Feed:** Real-time notifications for critical events like "Competitor Surge" or "Engagement Drop".
- **Dynamic Charting:** Visualizes pipeline health and progress using Recharts.

### 2. **Sales Insights Engine**
The core intelligence module that evaluates individual customer accounts.
- **Urgency & Status Badges:** Instantly know if a customer is Active, Pending, or In Pipeline.
- **Actionable AI Recommendations:** Get specific, generated advice (e.g., "Schedule technical review", "Send SOC2 report").
- **Accept Customer Workflow:** Move prospects through the pipeline directly from the insights screen with backend integration.

### 3. **Smart Follow-Up Scheduler**
Eliminates the back-and-forth of scheduling meetings.
- **Custom Meeting Selection:** Pick the exact date and time for your next touchpoint.
- **Automated Google Meet Links:** Instantly generates a unique `meet.google.com` link.
- **Automated Email Dispatch:** Integrates with Nodemailer to automatically send out the meeting invitation directly to the client's inbox.

### 4. **Global Inbox with AI Analysis**
A unified view of client communications, enhanced by contextual AI.
- **Contextual Urgency Badges:** Automatically flags emails as High, Medium, or Low urgency based on message content (e.g., requests for API access "this week" are flagged High).
- **Date Filtering:** Quickly sort through emails by specific dates using the built-in calendar filter.
- **Inbox/Sent Toggling:** Switch seamlessly between received client messages and automated system-sent emails.

### 5. **Account Summarizer & Proposal Generator**
Tools to close deals faster.
- **Account Summarizer:** Generates a concise brief of the client's needs, budget, and timeline. Includes 1-click meeting scheduling.
- **Proposal Generator:** Creates tailored, itemized proposals based on the customer's specific software requirements.

### 6. **Customer Lobby (CRM Database)**
Manage your entire network in one clean interface.
- **Live Status Tracking:** See who is Active vs. pending.
- **Direct Deletion:** Integrated backend API calls to safely remove prospects from your database with a safety confirmation prompt.

---

## 🛠️ Technology Stack

### **Frontend**
- **React (Vite+SWC):** Ultra-fast build tool and development server.
- **Lucide React:** Modern, lightweight SVG icons.
- **Vanilla CSS:** Custom-built, responsive design system utilizing glassmorphism, dynamic animations, and a rich, curated "Ivory/Charcoal/Accent" color palette.

### **Backend**
- **Node.js & Express:** Robust backend server handling API routing.
- **Nodemailer:** Handles all automated outgoing email communications (meeting invites, etc.).
- **MongoDB (Mongoose):** NoSQL database for flexible customer data storage.
- **CORS & dotenv:** Security and environment variable management.

---

## 📂 Project Structure

\`\`\`text
ai-sales-assistant/
├── backend/                  # Express server & API endpoints
│   ├── .env                  # Backend environment variables
│   ├── package.json          # Backend dependencies
│   └── server.js             # Main server logic, Nodemailer, & API routes
│
├── public/                   # Static assets
│   └── vite.svg              # AuraCRM Base Logo
│
├── src/                      # React Frontend Source
│   ├── components/           # UI Components
│   │   ├── features/         # Complex nested features (e.g. SmartFollowUpScheduler)
│   │   ├── modules/          # Main dashboard views (AccountSummarizer, GlobalInbox, etc.)
│   │   ├── Dashboard.jsx     # Main Dashboard layout container
│   │   ├── Hero.jsx          # Landing page Hero section
│   │   └── ...               # Shared UI elements
│   ├── App.jsx               # Root App component and React Router setup
│   ├── index.css             # Global styling utilizing vanilla CSS & glassmorphism
│   └── main.jsx              # React application entry point
│
├── .gitignore                # Git ignored files
├── package.json              # Frontend dependencies and scripts
├── README.md                 # Project documentation
└── vite.config.js            # Vite build configuration
\`\`\`

---

## 📦 Required Libraries

To run this application, you need to install the following dependencies:

### **Frontend Libraries** (`npm install` in the root directory)
- `react` / `react-dom` (v19) - UI Library
- `react-router-dom` - Client-side routing
- `lucide-react` - Modern SVG icon pack
- `recharts` - Charting library for the dashboard
- *Dev Dependencies:* `vite`, `@vitejs/plugin-react`, `eslint`

### **Backend Libraries** (`npm install` inside the backend directory)
- `express` - Web framework for Node.js API
- `cors` - Middleware for Cross-Origin Resource Sharing
- `dotenv` - Loading environment variables from `.env` files
- `nodemailer` - Module for automated email sending (meeting invites)
- `@google/generative-ai` & `openai` - AI wrappers (if utilizing AI models on the backend)
- *Dev Dependencies:* `nodemon`

---

## 💻 Tools Used

During the development of the AuraCRM Base application, the following tools and software were utilized:

- **Antigravity / Cursor / Windsurf / Copilot:** Primary IDEs and AI coding assistants used for engineering.
- **Node Package Manager (npm):** Used for dependency management.
- **Vite:** Used as the lightning-fast frontend build tool and local development server.
- **Git / GitHub:** Version control and source code hosting.
- **MongoDB Atlas:** (If using a remote DB) Used for cloud-based NoSQL database hosting.
- **Recharts:** Used to build the dynamic SVGs and data visualization charts on the dashboard.
- **Lucide Icons:** Utilized for crisp, consistent UI iconography.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.
You will also need a MongoDB URI and an App Password and Email Address for Nodemailer.

### 1. Clone the Repository
\`\`\`bash
git clone <your-repo-url>
cd ai-sales-assistant
\`\`\`

### 2. Install Dependencies
You will need to install dependencies for both the frontend and backend.

**Frontend:**
\`\`\`bash
cd ai-sales-assistant
npm install
\`\`\`

**Backend:**
\`\`\`bash
cd backend
npm install
\`\`\`

### 3. Environment Variables
Navigate to the `backend` directory and ensure your `.env` file is set up correctly:

\`\`\`env
# backend/.env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
\`\`\`

### 4. Run the Application
You need to run both the Vite frontend server and the Express backend server simultaneously. Open two terminal windows:

**Terminal 1 (Backend):**
\`\`\`bash
cd backend
npm run dev
\`\`\`
*(Server runs on http://localhost:5000)*

**Terminal 2 (Frontend):**
\`\`\`bash
cd ai-sales-assistant
npm run dev
\`\`\`
*(App runs on http://localhost:5174)*

---

## 🎨 Design Philosophy
AuraCRM Base was built with a strict adherence to **Premium Aesthetics**.
- It avoids generic Bootstrap/Tailwind defaults in favor of a bespoke visual identity.
- It utilizes aggressive but smooth micro-animations to make the interface feel "alive".
- The layout is intentionally spacious, using deep shadows and blurred "glass" panels to create depth and focus the user's attention on actionable AI insights.

---

*Designed and engineered for the modern sales professional.*
