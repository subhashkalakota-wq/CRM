require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');

const SCHEDULE_FILE = path.join(__dirname, 'schedule_queue.json');
const SENT_EMAILS_FILE = path.join(__dirname, 'sent_emails.json');

// Initialize queue files if they don't exist
if (!fs.existsSync(SCHEDULE_FILE)) fs.writeFileSync(SCHEDULE_FILE, '[]');
if (!fs.existsSync(SENT_EMAILS_FILE)) fs.writeFileSync(SENT_EMAILS_FILE, '[]');

// Persistent Email Scheduler Poller
setInterval(async () => {
    try {
        const dataText = fs.readFileSync(SCHEDULE_FILE, 'utf-8');
        if (!dataText) return;
        const data = JSON.parse(dataText);
        const now = new Date();
        const pending = [];
        let modified = false;

        for (const email of data) {
            if (new Date(email.sendAt) <= now) {
                // Time to send!
                try {
                    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
                        modified = true;
                        continue; // Skip silently if no creds
                    }

                    let transporter = nodemailer.createTransport({
                      service: 'gmail',
                      auth: {
                        user: process.env.SMTP_EMAIL,
                        pass: process.env.SMTP_PASSWORD,
                      },
                    });

                    let info = await transporter.sendMail({
                      from: `"AuraCRM AI Assistant" <${process.env.SMTP_EMAIL}>`,
                      to: email.to, 
                      subject: email.subject, 
                      text: email.body, 
                    });
                    console.log("✅ Scheduled Message Delivered to", email.to, info.messageId);
                } catch(e) {
                   console.error("❌ Scheduled Send Error:", e);
                }
                modified = true;
            } else {
                pending.push(email);
            }
        }

        if (modified) {
            fs.writeFileSync(SCHEDULE_FILE, JSON.stringify(pending, null, 2));
        }

    } catch (err) {
       console.error("Interval checking error", err);
    }
}, 15000); // Check every 15 seconds

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Simulated AI delay to make it feel authentic
const simulateAiProcessing = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ==========================================
// Mock Database: Customers
// ==========================================
const customersDB = [
  {
    id: 1,
    phone: "+91 98765 43210",
    software: "Aura Analytics Pro",
    name: "TechNova India",
    contact: "Priya Sharma",
    role: "VP of Engineering",
    email: "priya.sharma@technova.in",
    avatar: "https://i.pravatar.cc/150?u=priya",
    status: "Active",
    productInterest: "Enterprise Automation Suite",
    summary: "TechNova India is a major IT solutions provider based in Bangalore. Engagement has increased significantly following the deployment of our analytics suite. They are currently looking to scale operations across South Asia.",
    insights: [
      { type: "intent", text: "Upgrading to Enterprise tier with a budget of ₹85 Lakhs." },
      { type: "pain", text: "Current pipeline lacks automated financial reporting." },
      { type: "engagement", text: "Very responsive (avg. 2h reply rate)." }
    ],
    interactions: [
      { date: "Oct 15", event: "Video Call: Demoed new automation features." },
      { date: "Oct 12", event: "Email: Sent Q3 performance report." },
      { date: "Oct 05", event: "Support Ticket: API integration query resolved." }
    ],
    customerType: "existing",
    dealHistory: [
      { date: "Jan 15, 2024", product: "Aura Analytics Pro - Starter", amount: "₹18 Lakhs", status: "Closed Won" },
      { date: "Jun 02, 2024", product: "Enterprise Automation Suite - Phase 1", amount: "₹42 Lakhs", status: "Closed Won" },
      { date: "Oct 12, 2024", product: "Enterprise Automation Suite - Phase 2 (Upgrade)", amount: "₹85 Lakhs", status: "In Negotiation" }
    ]
  },
  {
    id: 2,
    phone: "+91 98222 33445",
    software: "LogiTrack API",
    name: "Bharat Logistics Corporation",
    contact: "Amitabh Patel",
    role: "Director of Operations",
    email: "amitabh.p@bharatlogistics.in",
    avatar: "https://i.pravatar.cc/150?u=amitabh",
    status: "In Pipeline",
    productInterest: "Dispatch Tracking API",
    summary: "Bharat Logistics Corporation is evaluating AuraCRM to consolidate their dispatch tracking and customer communication across Maharashtra and Gujarat.",
    insights: [
      { type: "intent", text: "Pending Security Review Approval." },
      { type: "pain", text: "Legacy system migration complexity." },
      { type: "engagement", text: "Moderate (multiple stakeholders involved)." }
    ],
    interactions: [
      { date: "Oct 14", event: "Email: Technical architecture review sent." },
      { date: "Oct 10", event: "Meeting: Security & Compliance Q&A." },
      { date: "Sep 28", event: "Demo: West India division pilot kick-off." }
    ],
    customerType: "existing",
    dealHistory: [
      { date: "Mar 10, 2024", product: "LogiTrack API - Pilot", amount: "₹12 Lakhs", status: "Closed Won" },
      { date: "Oct 14, 2024", product: "LogiTrack API - Regional Expansion", amount: "₹45 Lakhs", status: "In Negotiation" }
    ]
  },
  {
    id: 3,
    phone: "+91 99887 76655",
    software: "MedCloud Secure",
    name: "Aarohi Health Network",
    contact: "Dr. Anaya Desai",
    role: "Chief Information Officer",
    email: "adesai@aarohihealth.in",
    avatar: "https://i.pravatar.cc/150?u=anaya",
    status: "At Risk",
    productInterest: "HIPAA Compliant Cloud Storage",
    summary: "Aarohi Health Network operates 15 multi-specialty hospitals. Recent telemetry shows a 40% drop in login frequency over the last month. Contract renewal is approaching next quarter.",
    insights: [
      { type: "pain", text: "User adoption issues in rural secondary clinics." },
      { type: "intent", text: "Reviewing competitor solutions quoting ₹1.2 Cr." },
      { type: "engagement", text: "Low (Unopened recent check-in emails)." }
    ],
    interactions: [
      { date: "Oct 01", event: "Email: Quarterly Check-in (No Response)." },
      { date: "Sep 15", event: "Usage Alert: Dramatic drop in daily active users." },
      { date: "Aug 20", event: "Support Ticket: Password reset assistance." }
    ],
    customerType: "existing",
    dealHistory: [
      { date: "Mar 10, 2023", product: "MedCloud Secure - Basic", amount: "₹28 Lakhs", status: "Closed Won" },
      { date: "Sep 01, 2024", product: "HIPAA Compliant Cloud Storage Expansion", amount: "₹55 Lakhs", status: "Renewal Due" }
    ]
  },
  {
    id: 4,
    phone: "+91 91234 56789",
    software: "RiskPredict Enterprise",
    name: "Vertex Finance India",
    contact: "Rahul Verma",
    role: "CFO",
    email: "rahul.verma@vertexfinance.in",
    avatar: "https://i.pravatar.cc/150?u=rahul",
    status: "Active",
    productInterest: "Predictive Risk Analytics",
    summary: "Mumbai-based Vertex Finance recently upgraded to our premium predictive suite. They use our AI tools extensively to forecast market anomalies in the BSE and NSE.",
    insights: [
      { type: "intent", text: "Wants custom reporting widgets for tax season." },
      { type: "pain", text: "Data ingestion limits reached." },
      { type: "engagement", text: "High (Weekly standing syncs)." }
    ],
    interactions: [
      { date: "Oct 16", event: "Meeting: Discussed ₹20 Lakh data limit increase." },
      { date: "Oct 09", event: "Email: Strategy planning for Q4." }
    ],
    customerType: "existing",
    dealHistory: [
      { date: "Apr 05, 2023", product: "RiskPredict Standard", amount: "₹15 Lakhs", status: "Closed Won" },
      { date: "Feb 20, 2024", product: "Predictive Risk Analytics - Premium", amount: "₹38 Lakhs", status: "Closed Won" },
      { date: "Oct 16, 2024", product: "Data Limit Increase (₹20 Lakh add-on)", amount: "₹20 Lakhs", status: "In Negotiation" }
    ]
  },
  {
    id: 5,
    phone: "+91 97777 88888",
    software: "Edge AI NodeManager",
    name: "Veda Robotics",
    contact: "Siddharth Rao",
    role: "Lead Systems Architect",
    email: "s.rao@vedarobotics.in",
    avatar: "https://i.pravatar.cc/150?u=siddharth",
    status: "In Pipeline",
    productInterest: "Real-Time Sensor Processing Edge Network",
    summary: "Pune-based industrial robotics startup. They need an edge computing solution to process sensor data locally on factory floors before pushing anomalies to the cloud.",
    insights: [
      { type: "intent", text: "Evaluating edge nodes performance." },
      { type: "pain", text: "Latency in their current AWS Mumbai setup." },
      { type: "engagement", text: "Very High (Running deep technical POC)." }
    ],
    interactions: [
      { date: "Oct 17", event: "Slack: Shared benchmark results." },
      { date: "Oct 12", event: "Video Call: Live POC debugging session." }
    ],
    customerType: "new",
    dealHistory: []
  },
  {
    id: 6,
    phone: "+91 95555 44444",
    software: "OmniCDP Suite",
    name: "Nirvana Retail Group",
    contact: "Vikram Singh",
    role: "VP Marketing",
    email: "vsingh@nirvanaretail.in",
    avatar: "https://i.pravatar.cc/150?u=vikram",
    status: "At Risk",
    productInterest: "Omnichannel Customer Data Platform",
    summary: "Large retail conglomerate dealing with fragmented customer profiles across their malls. They bought the basic CDP module but struggled to integrate it with their legacy POS system.",
    insights: [
      { type: "pain", text: "Integration delays causing friction during Diwali prep." },
      { type: "intent", text: "Threatening to churn if not resolved by Nov 1st." },
      { type: "engagement", text: "Moderate (Only responds to escalations)." }
    ],
    interactions: [
      { date: "Oct 10", event: "Escalation Call: Apologized for POS delays." },
      { date: "Oct 02", event: "Email: Sent revised integration timeline." }
    ],
    customerType: "existing",
    dealHistory: [
      { date: "Nov 12, 2023", product: "OmniCDP Basic Module", amount: "₹22 Lakhs", status: "Closed Won" }
    ]
  },
  {
    id: 7,
    phone: "+91 93333 22222",
    software: "VideoTagging AI Module",
    name: "Chitramaya Media",
    contact: "Neha Gupta",
    role: "Content Director",
    email: "ngupta@chitramaya.in",
    avatar: "https://i.pravatar.cc/150?u=neha",
    status: "Active",
    productInterest: "AI Video Encoding & Tagging",
    summary: "A digital media agency rapidly scaling their Bollywood video production. Using our AI to automatically tag and transcribe raw footage. Very happy customer looking for expansion.",
    insights: [
      { type: "intent", text: "Wants to double their storage quota for ₹5 Lakhs/mo." },
      { type: "engagement", text: "High (Advocate, willing to do a case study)." }
    ],
    customerType: "existing",
    interactions: [
      { date: "Oct 15", event: "Email: Agreed to case study interview." },
      { date: "Oct 01", event: "Video Call: Quarterly Business Review (Excellent)." }
    ]
  },
  {
    id: 8,
    phone: "+91 91111 00000",
    software: "SolarGrid Monitor",
    name: "Surya Green Energy",
    contact: "Karan Malhotra",
    role: "Facilities Manager",
    email: "kmalhotra@suryagreen.in",
    avatar: "https://i.pravatar.cc/150?u=karan",
    status: "In Pipeline",
    productInterest: "IoT Grid Monitoring Dashboard",
    summary: "Renewable energy provider looking for a centralized dashboard to monitor solar panel outputs across multiple remote farms in Rajasthan. Security is a primary concern.",
    insights: [
      { type: "intent", text: "Awaiting final budget approval of ₹45 Lakhs." },
      { type: "pain", text: "Strict government procurement process." }
    ],
    interactions: [
      { date: "Oct 14", event: "Email: Sent legal compliance documentation." },
      { date: "Sep 30", event: "Meeting: Technical Review." }
    ],
    customerType: "new"
  },
  {
    id: 9,
    phone: "+91 99999 11111",
    software: "MatchMaker ScaleDB",
    name: "Khel Studios",
    contact: "Arjun Reddy",
    role: "Backend Lead",
    email: "arjun@khelstudios.in",
    avatar: "https://i.pravatar.cc/150?u=arjun",
    status: "Active",
    productInterest: "Multiplayer Matchmaking Infrastructure",
    summary: "Hyderabad-based indie game studio that just had a viral mobile hit. Frantically scaling their server infrastructure with our matchmaking API to handle the influx of players.",
    insights: [
      { type: "intent", text: "Needs emergency priority support SLA." },
      { type: "pain", text: "Unexpected scale causing dropped matches." },
      { type: "engagement", text: "Very High (Constant slack communication)." }
    ],
    interactions: [
      { date: "Oct 17", event: "Support: Upgraded database shard limits." },
      { date: "Oct 16", event: "Call: Emergency scaling response plan." }
    ],
    customerType: "existing"
  },
  {
    id: 10,
    phone: "+91 98888 22222",
    software: "SatOptimize Pro",
    name: "Sagar Cruises",
    contact: "Divya Nair",
    role: "IT Director",
    email: "d.nair@sagarcruises.in",
    avatar: "https://i.pravatar.cc/150?u=divya",
    status: "In Pipeline",
    productInterest: "Satellite Internet Optimization Suite",
    summary: "Cruise line attempting to improve ship-to-shore connectivity along the Kerala coast. Exploring our compression and optimization tools to save bandwidth costs.",
    insights: [
      { type: "intent", text: "Interested in a 2-ship pilot program." },
      { type: "pain", text: "Bandwidth costs are eating profit margins." }
    ],
    interactions: [
      { date: "Oct 08", event: "Demo: Showcased compression analytics." },
      { date: "Sep 22", event: "Email: Initial cold outreach." }
    ],
    customerType: "new"
  },
  {
    id: 11,
    phone: "+91 83743 59262",
    software: "AI Product Summarizer",
    name: "Amazon",
    contact: "Subhash Kalakota",
    role: "Product Manager",
    email: "subhashkalakota@gmail.com",
    avatar: "https://i.pravatar.cc/150?u=subhash",
    status: "Active",
    productInterest: "AI Product Summarizer Engine",
    summary: "Amazon is looking to integrate an automated product summarization engine to help condense vast amounts of product descriptions and user reviews into digestible, actionable insights for their retail platform.",
    insights: [
      { type: "intent", text: "Ready to deploy the AI summarizer API for beta testing." },
      { type: "pain", text: "Current manual review processes are too slow." }
    ],
    interactions: [
      { date: "Oct 20", event: "Video Call: Architectural review and scoping." },
      { date: "Oct 18", event: "Email: Sent API documentation and pricing details." }
    ],
    customerType: "existing"
  }
];

// ==========================================
// Endpoints: Customers Data
// ==========================================
app.get('/api/customers', async (req, res) => {
  await simulateAiProcessing(500); // Small network delay
  res.json({ success: true, data: customersDB });
});

app.get('/api/customers/:id', async (req, res) => {
  await simulateAiProcessing(800); // Simulate AI summarizing live CRM data
  const id = parseInt(req.params.id);
  const customer = customersDB.find(c => c.id === id);
  if (customer) {
    res.json({ success: true, data: customer });
  } else {
    res.status(404).json({ success: false, message: "Customer not found." });
  }
});

app.patch('/api/customers/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;
  
  const customerIndex = customersDB.findIndex(c => c.id === id);
  if (customerIndex !== -1) {
    if (status) customersDB[customerIndex].status = status;
    res.json({ success: true, data: customersDB[customerIndex] });
  } else {
    res.status(404).json({ success: false, message: "Customer not found." });
  }
});

app.post('/api/customers/batch', async (req, res) => {
  const { customers } = req.body;
  
  if (!customers || !Array.isArray(customers)) {
    return res.status(400).json({ success: false, message: "Invalid payload format. Expected an array of customers." });
  }

  try {
    let newCustomersAdded = [];
    
    for (const data of customers) {
      if (!data.name || !data.contact) continue; // Skip horribly invalid rows

      const newId = customersDB.length > 0 ? Math.max(...customersDB.map(c => c.id)) + 1 : 1;
      const firstName = data.contact.split(' ')[0].toLowerCase() || 'user';
      
      const newCustomer = {
        id: newId,
        name: data.name,
        contact: data.contact,
        email: data.email || `${firstName}@${data.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'company'}.com`,
        role: data.role || "Executive",
        phone: data.phone || "+91 00000 00000",
        software: data.software || "Core Platform",
        productInterest: data.productInterest || "General AI Suite",
        status: data.status || "In Pipeline",
        avatar: `https://i.pravatar.cc/150?u=${firstName}${newId}`,
        summary: data.summary || `${data.name} is evaluating AuraCRM for their ${data.productInterest || 'needs'}. Batch imported into the system.`,
        insights: [
           { type: "intent", text: `Evaluating ${data.productInterest || 'platform features'}.` },
           { type: "engagement", text: "Low (Newly imported lead)" }
        ],
        interactions: [
           { date: "Today", event: "Imported from batch dataset." }
        ],
        customerType: "new"
      };
      
      customersDB.push(newCustomer);
      newCustomersAdded.push(newCustomer);
    }

    res.json({ success: true, count: newCustomersAdded.length, data: newCustomersAdded });
  } catch (error) {
    console.error("Batch upload error:", error);
    res.status(500).json({ success: false, message: "Server error during batch upload." });
  }
});

// ==========================================
// Endpoint: AI Product Preview (Gemini)
// ==========================================
app.get('/api/product-preview', async (req, res) => {
  const { product } = req.query;
  
  if (!process.env.GROQ_API_KEY) {
    // Fallback if no key is configured
    await simulateAiProcessing(1500);
    return res.json({ 
      success: true, 
      html: `<div style="padding: 24px; text-align: left; border: 2px dashed var(--color-glass-border); border-radius: 12px; background: rgba(255,255,255,0.5);">
               <h4 style="margin:0 0 12px 0; color: var(--color-dark-charcoal);">Analysis: ${product || 'Aura Platform'}</h4>
               <p style="margin:0 0 8px 0; color: var(--text-muted); font-size: 0.95rem;"><strong>Goal:</strong> Define fallback goal here.</p>
               <p style="margin:0 0 8px 0; color: var(--text-muted); font-size: 0.95rem;"><strong>Purpose:</strong> Define fallback purpose here.</p>
               <p style="margin:0; color: var(--text-muted); font-size: 0.95rem;"><strong>Requirements:</strong> Define fallback requirements here.</p>
             </div>` 
    });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
    });
    const prompt = `Act as an expert technical Product Manager.
    Analyze the software product named "${product}" for a potential client.

    You MUST provide a REAL, DETAILED analysis of this SPECIFIC product.
    Format your response as clean HTML fragments (no <html>, <head>, or <body> tags).
    Use <p>, <strong>, <ul>, <li> tags. Keep styling minimal.

    Structure your response EXACTLY like this:
    <p><strong>Goal:</strong> [Detailed goal of ${product}]</p>
    <p><strong>Purpose:</strong> [Overarching purpose and business value]</p>
    <p><strong>Key Requirements:</strong></p>
    <ul>[3-5 <li> items covering functional requirements]</ul>`;

    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }]
    });

    let htmlContent = response.choices[0].message.content;
    // Clean up markdown code blocks if the AI returns them
    htmlContent = htmlContent.replace(/```html/g, '').replace(/```/g, '').trim();

    res.json({ success: true, html: htmlContent });
  } catch (error) {
    console.error("Groq Preview Error:", error);
    // If API fails (e.g. rate limit), return a graceful fallback instead of an error so the UI still looks good
    return res.json({ 
      success: true, 
      html: `<div style="padding: 24px; text-align: left; border: 2px dashed var(--color-glass-border); border-radius: 12px; background: rgba(255,255,255,0.5);">
               <h4 style="margin:0 0 12px 0; color: var(--color-dark-charcoal);">Analysis: ${product || 'Aura Platform'}</h4>
               <p style="margin:0 0 8px 0; color: var(--text-muted); font-size: 0.95rem;"><strong>Goal:</strong> Optimize workflows and improve overall data visibility for ${product}.</p>
               <p style="margin:0 0 8px 0; color: var(--text-muted); font-size: 0.95rem;"><strong>Purpose:</strong> Designed to scale operations and eliminate manual reporting overhead.</p>
               <p style="margin:0; color: var(--text-muted); font-size: 0.95rem;"><strong>Requirements:</strong> Seamless API integration, 99.9% uptime, and role-based access control.</p>
               <div style="margin-top: 12px; padding: 8px; background: rgba(231, 76, 60, 0.1); border-radius: 6px; font-size: 0.8rem; color: #c0392b;">
                 AI generation temporarily unavailable due to API rate limits. Showing cached estimate.
               </div>
             </div>` 
    });
  }
});

app.delete('/api/customers/:id', async (req, res) => {
  const { id } = req.params;
  const index = customersDB.findIndex(c => c.id === parseInt(id));
  
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Customer not found" });
  }
  
  customersDB.splice(index, 1);
  res.json({ success: true, message: "Customer deleted successfully" });
});

app.post('/api/customers', async (req, res) => {
  await simulateAiProcessing(500);
  const { name, contact, email, role, phone, productInterest, software, status } = req.body;
  
  if (!name || !contact) {
    return res.status(400).json({ success: false, message: "Name and contact are required." });
  }

  const newId = customersDB.length > 0 ? Math.max(...customersDB.map(c => c.id)) + 1 : 1;
  const newCustomer = {
    id: newId,
    name,
    contact,
    email: email || "",
    role: role || "",
    phone: phone || "",
    software: software || "Unknown",
    status: status || "Active",
    productInterest: productInterest || "General Services",
    avatar: `https://i.pravatar.cc/150?u=${name.replace(/\s+/g, '')}`,
    summary: `${name} is currently using ${software || "legacy software"}. They are highly interested in ${productInterest || "our latest offerings"} to streamline operations and improve their workflow efficiency. Their primary focus is scaling their current infrastructure.`,
    insights: [
      { type: "intent", text: `Actively evaluating ${productInterest || "the platform"} for their team.` },
      { type: "pain", text: `Experiencing friction and limitations with ${software || "current manual processes"}.` },
      { type: "engagement", text: "New account, pending first scheduled sync." }
    ],
    interactions: [
      { date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' }), event: "Account manually created and assigned." }
    ]
  };

  customersDB.push(newCustomer);
  res.json({ success: true, data: newCustomer });
});

// ==========================================
// Endpoint: Generate Email
// ==========================================
app.post('/api/generate-email', async (req, res) => {
  const { context, tone, customer } = req.body;
  
  // Simulate AI Generation Time
  await simulateAiProcessing(2000);

  const cName = customer && customer.contact ? customer.contact.split(' ')[0] : 'Sarah';
  const cEmail = customer && customer.email ? customer.email : 'sarah.jenkins@techflow.com';
  const cProduct = customer && customer.productInterest ? customer.productInterest : 'AuraCRM Automation Suite';

  let generatedText = '';

  if (tone === 'Professional') {
    generatedText = `Hi ${cName},\n\nFollowing up on our recent discussion regarding the ${cProduct}. Based on the discovery phase, I've put together a comprehensive overview of how our platform addresses the reporting bottlenecks we identified.\n\nI've attached a customized breakdown for your review. Would you be available for a brief 15-minute alignment call early next week (perhaps Tuesday at 10 AM) to dive into the technical implementation details?\n\nLooking forward to your thoughts.\n\nBest regards,\nSales Team`;
  } else if (tone === 'Friendly') {
    generatedText = `Hi ${cName},\n\nIt was so great chatting with you yesterday! I really enjoyed learning about your vision for the upcoming year.\n\nI was thinking more about the reporting bottlenecks you mentioned and put together a quick breakdown of how ${cProduct} can automate that flow for you entirely. I've attached it here for you to check out when you have a moment.\n\nLet me know if you're up for a quick 15-minute chat next week to walk through it. Tuesday at 10 AM works great on my end!\n\nCheers,\nSales Team`;
  } else if (tone === 'Urgent') {
    generatedText = `Hi ${cName},\n\nI wanted to circle back quickly regarding the ${cProduct} deployment timeline we discussed.\n\nTo ensure we can successfully launch before the end of Q4 and eliminate those reporting bottlenecks, we would need to begin the technical scoping by next week. I've attached the required project breakdown.\n\nPlease let me know if we can lock in 15 minutes this Tuesday at 10 AM to confirm these final details.\n\nBest,\nSales Team`;
  } else {
    generatedText = `Hi ${cName},\n\nThank you for sharing the detailed insights into your current infrastructure challenges. \n\nIn reviewing the data flow from your legacy systems, the primary issue appears to be the manual orchestration layer. I've mapped out a proposed architecture using the ${cProduct} that streamlines this entirely, which I've attached here.\n\nI recommend we schedule a 15-minute technical deep dive next Tuesday at 10 AM to review the proposed schema. Does that time work for you?\n\nBest regards,\nSales Team`;
  }

  res.json({
    success: true,
    data: {
      to: cEmail,
      subject: `Next Steps: ${cProduct}`,
      body: generatedText,
      metadata: { tone, context, generatedAt: new Date().toISOString() }
    }
  });
});

// ==========================================
// Endpoint: Generate Proposal
// ==========================================
app.post('/api/generate-proposal', async (req, res) => {
  const { customer } = req.body || {};
  
  const clientName = customer && customer.name ? customer.name : "TechFlow Inc.";
  const software = customer && customer.software ? customer.software : "Aura Automation Suite";
  const productInterest = customer && customer.productInterest ? customer.productInterest : "Enterprise Scale Automation Implementation";
  const productDetails = customer && customer.summary ? customer.summary : "A comprehensive solution designed to streamline operational workflows, eliminate manual reporting, and enhance overall pipeline visibility across the organization.";

  // Fallback if no API key is provided
  if (!process.env.GROQ_API_KEY) {
    await simulateAiProcessing(2500);
    return res.json({
      success: true,
      data: {
        client: clientName,
        title: `${productInterest} Proposal`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        software: software,
        productDetails: productDetails,
        pricing: [
          { description: `${productInterest} Core Setup`, details: `Initial configuration and deployment of ${productInterest}.`, amount: 45000 },
          { description: "Custom Integration Services", details: "One-time fee for API connections and data migration from legacy systems.", amount: 25000 },
          { description: `${productInterest} Premium Support`, details: "24/7 technical support and dedicated account management for 12 months.", amount: 15000 }
        ],
        totalValue: 125000
      }
    });
  }

  // Real AI Generation
  try {
    const openai = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
    });
    
    const prompt = `Act as an expert B2B Sales Executive. Generate a realistic pricing proposal for a customer named "${clientName}" who is highly interested in buying and deploying our software product: "${productInterest}".
    
    Return ONLY a valid JSON array of 4 objects representing the pricing line items for this specific product. The line items MUST be highly relevant to "${productInterest}" (e.g., if they want a Database, charge for Storage and Compute. If they want an API, charge for rate limits and setup).

    Each object MUST have exactly these 3 keys:
    - "description": A short title for the line item highly relevant to ${productInterest} (e.g. "${productInterest} Core License", "Custom Migration Fee", "Implementation Training").
    - "details": A 1-2 sentence explanation of EXACTLY what this fee covers, tailored to ${productInterest}, justifying the cost to the client.
    - "amount": An integer representing the realistic cost in US Dollars (e.g., 45000).

    Do NOT include markdown formatting like \`\`\`json. Just the raw array.`;

    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }]
    });

    let jsonText = response.choices[0].message.content.trim();
    if(jsonText.startsWith('```json')) jsonText = jsonText.substring(7);
    if(jsonText.endsWith('```')) jsonText = jsonText.slice(0, -3);
    
    const pricingArray = JSON.parse(jsonText.trim());
    const totalValue = pricingArray.reduce((sum, item) => sum + item.amount, 0);

    res.json({
      success: true,
      data: {
        client: clientName,
        title: `${productInterest} Proposal`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        software: software,
        productDetails: productDetails,
        pricing: pricingArray,
        totalValue: totalValue
      }
    });

  } catch (error) {
    console.error("Groq Proposal Generator Error:", error);
    res.status(500).json({ success: false, error: "Failed to generate AI proposal." });
  }
});

// ==========================================
// Endpoint: AI Deal Prediction
// ==========================================
app.get('/api/deal-prediction/:id', async (req, res) => {
  const customerId = parseInt(req.params.id);
  const customer = customersDB.find(c => c.id === customerId);

  if (!customer) {
    return res.status(404).json({ success: false, message: "Customer not found." });
  }

  // Fallback if no API key is provided
  if (!process.env.GROQ_API_KEY) {
    await simulateAiProcessing(2000);
    const hasHistoryFallback = customer.dealHistory && customer.dealHistory.length > 0;
    return res.json({
      success: true,
      data: {
        recommendation: hasHistoryFallback 
          ? `Offer a bundled discount on ${customer.productInterest} based on their strong history with us.`
          : `Project high implementation efficiency for ${customer.productInterest} to build initial trust.`,
        relook: "Push Forward - Active Engagement",
        profitability: "High Profit Margin",
        isProfit: true,
        hasHistory: hasHistoryFallback,
        efficiency: "Scheduled for 95% throughput",
        businessValue: "Potential 22% ROI in Q1",
        history: customer.dealHistory || []
      }
    });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
    });
    
    const hasHistory = customer.dealHistory && customer.dealHistory.length > 0;
    const historyText = hasHistory
      ? customer.dealHistory.map(deal => `- ${deal.date}: ${deal.product} for ${deal.amount} (${deal.status})`).join('\n')
      : "No prior deal history. This is a net-new engagement.";

    const prompt = `Act as an expert B2B Deal Analyst. Review this customer's profile and deal history to provide a prediction on the current deal.
    
    Customer Name: ${customer.name}
    Current Product Interest: ${customer.productInterest}
    
    Past Deal History:
    ${historyText}

    Instructions for recommendations:
    1. If history EXISTS: Base the recommendation EXPLICITLY on past behavior (e.g., "They usually buy x after y, so offer z").
    2. If history DOES NOT EXIST: Predict the "Efficiency" of the implementation and the "Business Value" (ROI/Impact) this deal brings to the company.

    Return ONLY a valid JSON object with exactly these keys:
    - "recommendation": A 1-2 sentence specific recommendation.
    - "relook": A 3-5 word status (e.g., "Push Forward", "Re-evaluate").
    - "profitability": A 3-5 word status (e.g., "High Profit Margin").
    - "isProfit": boolean.
    - "hasHistory": boolean (${hasHistory}).
    - "efficiency": A short string describing predicted efficiency (only if hasHistory is false).
    - "businessValue": A short string describing business value (only if hasHistory is false).

    Do NOT include markdown formatting. Just the raw JSON object.`;

    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }]
    });

    let jsonText = response.choices[0].message.content.trim();
    if(jsonText.startsWith('```json')) jsonText = jsonText.substring(7);
    if(jsonText.endsWith('```')) jsonText = jsonText.slice(0, -3);
    
    const predictionData = JSON.parse(jsonText.trim());

    res.json({
      success: true,
      data: {
        ...predictionData,
        hasHistory: hasHistory, // Extra safety
        history: customer.dealHistory || []
      }
    });

  } catch (error) {
    console.error("Groq Deal Prediction Error:", error);
    res.json({
      success: true,
      data: {
        recommendation: `Data processing error. Standard playbook applies for ${customer.productInterest}.`,
        relook: "Proceed with Standard Terms",
        profitability: "Standard Margin",
        isProfit: true,
        hasHistory: false,
        efficiency: "N/A",
        businessValue: "N/A",
        history: customer.dealHistory || []
      }
    });
  }
});

// ==========================================
// Endpoint: Send Real Email (Nodemailer)
// ==========================================
app.post('/api/send-email', async (req, res) => {
  const { to, subject, body, html } = req.body;

  try {
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
       console.error("❌ ERROR: Missing SMTP credentials in backend/.env file.");
       return res.status(500).json({ success: false, error: "Server email credentials not configured." });
    }

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    let info = await transporter.sendMail({
      from: `"AuraCRM AI Assistant" <${process.env.SMTP_EMAIL}>`,
      to: to, 
      subject: subject, 
      text: body || (html ? "Please view this email in an HTML-compatible client." : ""),
      html: html
    });

    console.log("✅ Real Message Delivered: %s", info.messageId);

    // Save to sent emails persistence
    try {
      const sentData = JSON.parse(fs.readFileSync(SENT_EMAILS_FILE, 'utf-8') || '[]');
      sentData.push({
        id: Date.now(),
        to,
        subject,
        body: body || (html ? "[HTML Content]" : ""),
        date: new Date().toLocaleString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
        timestamp: new Date().toISOString()
      });
      fs.writeFileSync(SENT_EMAILS_FILE, JSON.stringify(sentData, null, 2));
    } catch (saveErr) {
      console.error("⚠️ Failed to save sent email to persistence:", saveErr);
    }

    res.json({ success: true, messageId: info.messageId });
  } catch (err) {
    console.error("❌ Error sending email:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// Endpoint: Schedule Email via File Queue
// ==========================================
app.post('/api/schedule-email', async (req, res) => {
  const { to, subject, body, sendAt } = req.body;

  try {
    const targetDate = new Date(sendAt);
    
    // Read current queue, append new mail, write back
    const data = JSON.parse(fs.readFileSync(SCHEDULE_FILE, 'utf-8') || '[]');
    data.push({ to, subject, body, sendAt });
    fs.writeFileSync(SCHEDULE_FILE, JSON.stringify(data, null, 2));

    console.log(`⏱️ Saved scheduled email to ${to} for ${targetDate.toLocaleString()} to persistent queue.`);
    res.json({ success: true, message: `Email scheduled successfully for ${targetDate.toLocaleString()}` });
  } catch (err) {
    console.error("❌ Error scheduling email:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/sent-emails', (req, res) => {
  const { customerEmail } = req.query;
  try {
    const data = JSON.parse(fs.readFileSync(SENT_EMAILS_FILE, 'utf-8') || '[]');
    if (customerEmail) {
      const filtered = data.filter(email => email.to && email.to.toLowerCase() === customerEmail.toLowerCase());
      return res.json({ success: true, data: filtered });
    }
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// Endpoint: Voice Command Intent Parser
// ==========================================
app.post('/api/parse-voice-command', async (req, res) => {
  const { command, context } = req.body;

  if (!command) {
    return res.status(400).json({ success: false, error: "No voice command provided." });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
    });
    
    const contextInstruction = context ? `\n    Available Context (Customers): ${context}\n` : '';

    const prompt = `You are an AI assistant parsing voice commands for a CRM dashboard.
    The user said: "${command}"${contextInstruction}
    
    Determine their intent and return a strictly formatted JSON object with two keys:
    - "action": Must be exactly one of: 
      - "SHOW_ACTIVE_USERS" (returning to the customer lobby/home screen)
      - "OPEN_INBOX" (opening the email inbox or global inbox)
      - "OPEN_MODULE" (navigating to a specific tool or view for a customer)
      - "FILTER_CUSTOMERS" (filtering the customer list by category like Active, Pipeline, At Risk, Domain)
      - "SEND_EMAIL" (triggering the action to send an email to the current customer)
      - "CHANGE_EMAIL_TONE" (changing the tone of an email draft)
      - "TOGGLE_THEME" (switching to dark mode or light mode)
      - "TOGGLE_CHATBOT" (opening or closing the AI assistant chatbot window)
      - "SELECT_CUSTOMER" (navigating to a specific client/customer's workspace)
      - "LOGOUT" (exiting or signing out of the dashboard)
      - "UNKNOWN"
    - "target": 
        - If action is OPEN_MODULE, this MUST be the internal key for that module. Choose from: 'insights', 'inbox', 'account', 'opportunity', 'email', 'proposal', 'deals', 'emotion', 'coach', 'heatmap', 'scheduler', 'timeline', 'globalSchedules'.
        - If action is FILTER_CUSTOMERS, this MUST be the category name. Choose from: 'All', 'Active', 'At Risk', 'Pipeline', 'Recent', 'Domain'.
        - If action is SEND_EMAIL, the target can be null unless they mention a specific time or detail.
        - If action is CHANGE_EMAIL_TONE, the target MUST be 'Professional', 'Friendly', 'Urgent', or 'Consultative'.
        - If action is SELECT_CUSTOMER, the target MUST be the exact numeric ID representing the customer from the 'Available Context' list. If no context is provided, or no match is found, target MUST be null.
        - If they mentioned a specific person or company, extract their name here if action is not OPEN_MODULE or SELECT_CUSTOMER. Else null.
    
    Examples:
    "show the active users" -> {"action": "SHOW_ACTIVE_USERS", "target": null}
    "click on active" -> {"action": "FILTER_CUSTOMERS", "target": "Active"}
    "show pipeline users" -> {"action": "FILTER_CUSTOMERS", "target": "Pipeline"}
    "open my inbox" -> {"action": "OPEN_INBOX", "target": null}
    "send mail" -> {"action": "SEND_EMAIL", "target": null}
    "send the email to them" -> {"action": "SEND_EMAIL", "target": null}
    "make the email friendly" -> {"action": "CHANGE_EMAIL_TONE", "target": "Friendly"}
    "change tone to urgent" -> {"action": "CHANGE_EMAIL_TONE", "target": "Urgent"}
    "open opportunity analyzer" -> {"action": "OPEN_MODULE", "target": "opportunity"}
    "view schedule" -> {"action": "OPEN_MODULE", "target": "globalSchedules"}
    "go to sales coach" -> {"action": "OPEN_MODULE", "target": "coach"}
    "generate a proposal" -> {"action": "OPEN_MODULE", "target": "proposal"}
    "show relationship timeline" -> {"action": "OPEN_MODULE", "target": "timeline"}
    "open smart scheduler" -> {"action": "OPEN_MODULE", "target": "scheduler"}
    "switch to dark mode" -> {"action": "TOGGLE_THEME", "target": "dark"}
    "open the chatbot" -> {"action": "TOGGLE_CHATBOT", "target": "open"}
    "open technova" -> {"action": "SELECT_CUSTOMER", "target": "TechNova"}
    "go to the workspace for amazon" -> {"action": "SELECT_CUSTOMER", "target": "Amazon"}
    "log me out" -> {"action": "LOGOUT", "target": null}
    "view schedule" -> {"action": "OPEN_MODULE", "target": "globalSchedules"}
    "go to sales coach" -> {"action": "OPEN_MODULE", "target": "coach"}
    "generate a proposal" -> {"action": "OPEN_MODULE", "target": "proposal"}
    "show relationship timeline" -> {"action": "OPEN_MODULE", "target": "timeline"}
    "open smart scheduler" -> {"action": "OPEN_MODULE", "target": "scheduler"}
    
    Return ONLY the valid JSON object. No markdown, no conversational text.`;

    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }]
    });

    let jsonText = response.choices[0].message.content.trim();
    if(jsonText.startsWith('```json')) jsonText = jsonText.substring(7);
    if(jsonText.endsWith('```')) jsonText = jsonText.slice(0, -3);
    
    const parsedIntent = JSON.parse(jsonText.trim());

    res.json({
      success: true,
      intent: parsedIntent
    });

  } catch (error) {
    console.error("Groq Voice Parser Error:", error);
    res.status(500).json({ success: false, error: "Failed to parse voice command." });
  }
});

// ==========================================
// Endpoint: AI Chatbot for Product Clarification
// ==========================================
app.post('/api/chat', async (req, res) => {
  const { message, context } = req.body;

  if (!process.env.GROQ_API_KEY) {
    await simulateAiProcessing(1500);
    return res.json({ 
      success: true, 
      reply: "I am running in offline mode. Please add a GROQ_API_KEY to enable real AI responses." 
    });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
    });
    
    const systemPrompt = `You are Aura Assistant, an expert AI embedded in a CRM dashboard helping a sales representative.
    Your job is to clarify doubts and answer questions about a customer's specific product interest.
    
    Context about the current customer:
    ${context}
    
    Respond directly to the question in a helpful, concise, and professional tone. Keep answers under 4 paragraphs. Do not use complex markdown that cannot render properly in basic HTML text.`;

    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ]
    });

    const replyContent = response.choices[0].message.content;
    res.json({ success: true, reply: replyContent });
  } catch (error) {
    console.error("Groq Chat Error:", error);
    res.status(500).json({ success: false, reply: "I'm having trouble connecting right now. Please try again." });
  }
});

// ==========================================
// Endpoint: AI Email Analysis
// ==========================================
app.post('/api/analyze-email', async (req, res) => {
  const { emailBody } = req.body;

  if (!emailBody) {
    return res.status(400).json({ success: false, error: 'Email body is required' });
  }

  if (!process.env.GROQ_API_KEY) {
    await simulateAiProcessing(1500);
    return res.json({ 
      success: true, 
      analysis: "• **Intent:** Requesting clarification\n• **Key Question:** Needs timeline detail\n• **Action Item:** Reply with updated schedule" 
    });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
    });
    
    const systemPrompt = `You are an elite Sales Assistant AI. Analyze the following email from a prospect.
    Provide a concise, 3-point summary:
    1. Main intent/sentiment of the email.
    2. Any specific requests or questions asked.
    3. Your recommended next action for the sales rep.
    
    Make it short, professional, and easy to read. Use bullet points. Do not use markdown headers (like # or ##).`;

    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: emailBody }
      ]
    });

    const analysisContent = response.choices[0].message.content;
    res.json({ success: true, analysis: analysisContent });
  } catch (error) {
    console.error("Email Analysis Error:", error);
    res.status(500).json({ success: false, analysis: "AI analysis unavailable. Please read the email directly." });
  }
});



// ==========================================
// Buy Products Store — In-Memory Database
// ==========================================
let storeUsersDB = [];

const storeProductsDB = [
  // --- Mobile Phones ---
  { id: 1, category: "Mobile Phones", name: "Samsung Galaxy S24 Ultra", brand: "Samsung", price: 129999, originalPrice: 149999, rating: 4.8, reviews: 3420, image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=80", badge: "Bestseller", specs: "6.8\" QHD+, 200MP, 5000mAh" },
  { id: 2, category: "Mobile Phones", name: "Apple iPhone 15 Pro Max", brand: "Apple", price: 159900, originalPrice: 174900, rating: 4.9, reviews: 5812, image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80", badge: "Top Rated", specs: "6.7\" OLED, 48MP, Titanium" },
  { id: 3, category: "Mobile Phones", name: "OnePlus 12", brand: "OnePlus", price: 64999, originalPrice: 74999, rating: 4.7, reviews: 2100, image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80", badge: "Hot Deal", specs: "6.82\" LTPO, 50MP, 5400mAh" },
  { id: 4, category: "Mobile Phones", name: "Google Pixel 8 Pro", brand: "Google", price: 106999, originalPrice: 119999, rating: 4.6, reviews: 1890, image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80", badge: null, specs: "6.7\" LTPO OLED, 50MP, AI Camera" },
  { id: 5, category: "Mobile Phones", name: "Xiaomi 14 Ultra", brand: "Xiaomi", price: 89999, originalPrice: 99999, rating: 4.5, reviews: 980, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80", badge: null, specs: "6.73\" AMOLED, 50MP Leica, 5000mAh" },
  { id: 6, category: "Mobile Phones", name: "Vivo X100 Pro", brand: "Vivo", price: 99999, originalPrice: 109999, rating: 4.5, reviews: 670, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80", badge: null, specs: "6.78\" AMOLED, 50MP ZEISS, 5400mAh" },
  { id: 7, category: "Mobile Phones", name: "Nothing Phone 2a", brand: "Nothing", price: 23999, originalPrice: 27999, rating: 4.4, reviews: 1540, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80", badge: "Budget Pick", specs: "6.7\" AMOLED, 50MP, 5000mAh" },
  { id: 8, category: "Mobile Phones", name: "OPPO Find X7 Ultra", brand: "OPPO", price: 104999, originalPrice: 119999, rating: 4.6, reviews: 540, image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80", badge: null, specs: "6.82\" OLED, 50MP Hasselblad quad cam" },
  { id: 9, category: "Mobile Phones", name: "Motorola Edge 50 Pro", brand: "Motorola", price: 31999, originalPrice: 39999, rating: 4.3, reviews: 820, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80", badge: null, specs: "6.7\" pOLED, 50MP, 4500mAh" },
  { id: 10, category: "Mobile Phones", name: "Realme GT 6", brand: "Realme", price: 34999, originalPrice: 39999, rating: 4.4, reviews: 1100, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80", badge: "Value King", specs: "6.78\" AMOLED, 50MP, Snapdragon 8s Gen3" },
  { id: 11, category: "Mobile Phones", name: "Samsung Galaxy A55", brand: "Samsung", price: 38999, originalPrice: 42999, rating: 4.3, reviews: 2300, image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=80", badge: null, specs: "6.6\" Super AMOLED, 50MP, 5000mAh" },
  { id: 12, category: "Mobile Phones", name: "iPhone 14", brand: "Apple", price: 59900, originalPrice: 79900, rating: 4.7, reviews: 4200, image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80", badge: "Great Value", specs: "6.1\" Super Retina XDR, 12MP, A15 Bionic" },
  { id: 13, category: "Mobile Phones", name: "Poco X6 Pro", brand: "Poco", price: 26999, originalPrice: 31999, rating: 4.5, reviews: 1780, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80", badge: "Gaming Beast", specs: "6.67\" AMOLED, 64MP, Dimensity 8300" },
  { id: 14, category: "Mobile Phones", name: "iQOO 12", brand: "iQOO", price: 52999, originalPrice: 64999, rating: 4.6, reviews: 890, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80", badge: null, specs: "6.78\" AMOLED, 50MP, Snapdragon 8 Gen 3" },
  { id: 15, category: "Mobile Phones", name: "Samsung Galaxy Z Fold 6", brand: "Samsung", price: 164999, originalPrice: 179999, rating: 4.4, reviews: 320, image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=80", badge: "Foldable", specs: "7.6\" Foldable AMOLED, 50MP" },
  // --- Laptops ---
  { id: 16, category: "Laptops", name: "Apple MacBook Pro M3 Pro", brand: "Apple", price: 199900, originalPrice: 219900, rating: 4.9, reviews: 2800, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80", badge: "Top Rated", specs: "14\", M3 Pro, 18GB RAM, 512GB SSD" },
  { id: 17, category: "Laptops", name: "ASUS ROG Zephyrus G16", brand: "ASUS", price: 189990, originalPrice: 209990, rating: 4.7, reviews: 1200, image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80", badge: "Gaming", specs: "16\" QHD, RTX 4080, i9 13th Gen" },
  { id: 18, category: "Laptops", name: "Dell XPS 15", brand: "Dell", price: 169990, originalPrice: 189990, rating: 4.6, reviews: 1700, image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80", badge: null, specs: "15.6\" OLED, i7-13700H, RTX 4060" },
  { id: 19, category: "Laptops", name: "Lenovo ThinkPad X1 Carbon", brand: "Lenovo", price: 149990, originalPrice: 169990, rating: 4.8, reviews: 2100, image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80", badge: "Business", specs: "14\" IPS, i7, 32GB, 1TB SSD" },
  { id: 20, category: "Laptops", name: "HP Spectre x360 14", brand: "HP", price: 139990, originalPrice: 154990, rating: 4.5, reviews: 980, image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80", badge: null, specs: "14\" 2.8K OLED, Touch, i7, 16GB" },
  { id: 21, category: "Laptops", name: "Microsoft Surface Pro 10", brand: "Microsoft", price: 129990, originalPrice: 144990, rating: 4.4, reviews: 670, image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80", badge: "2-in-1", specs: "13\" Touchscreen, i5, 16GB, 256GB" },
  { id: 22, category: "Laptops", name: "Acer Predator Helios 16", brand: "Acer", price: 159990, originalPrice: 174990, rating: 4.5, reviews: 890, image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80", badge: "Gaming", specs: "16\" QHD 240Hz, RTX 4070, i7" },
  { id: 23, category: "Laptops", name: "MacBook Air M2", brand: "Apple", price: 114900, originalPrice: 134900, rating: 4.8, reviews: 5600, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80", badge: "Popular", specs: "13.6\", M2, 8GB/256GB, Fanless" },
  { id: 24, category: "Laptops", name: "Lenovo IdeaPad Slim 5", brand: "Lenovo", price: 54990, originalPrice: 64990, rating: 4.3, reviews: 3200, image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80", badge: "Budget", specs: "16\" FHD, AMD Ryzen 5, 16GB, 512GB" },
  { id: 25, category: "Laptops", name: "Samsung Galaxy Book4 Pro", brand: "Samsung", price: 149990, originalPrice: 164990, rating: 4.6, reviews: 540, image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80", badge: null, specs: "16\" AMOLED, Ultra 7, 16GB, 512GB" },
  // --- Tablets ---
  { id: 26, category: "Tablets", name: "Apple iPad Pro 13\" M4", brand: "Apple", price: 119900, originalPrice: 134900, rating: 4.9, reviews: 1870, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80", badge: "Top Rated", specs: "13\" Ultra Retina XDR, M4 chip, OLED" },
  { id: 27, category: "Tablets", name: "Samsung Galaxy Tab S9 Ultra", brand: "Samsung", price: 108999, originalPrice: 124999, rating: 4.7, reviews: 1240, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80", badge: null, specs: "14.6\" Super AMOLED, Snapdragon 8 Gen 2" },
  { id: 28, category: "Tablets", name: "Apple iPad Air M2", brand: "Apple", price: 59900, originalPrice: 69900, rating: 4.8, reviews: 3200, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80", badge: "Popular", specs: "11\" Liquid Retina, M2, USB-C" },
  { id: 29, category: "Tablets", name: "Microsoft Surface Pro 9", brand: "Microsoft", price: 99990, originalPrice: 114990, rating: 4.5, reviews: 780, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80", badge: null, specs: "13\" IPS Touch, i5, 8GB, 128GB SSD" },
  { id: 30, category: "Tablets", name: "Lenovo Tab Extreme", brand: "Lenovo", price: 64990, originalPrice: 74990, rating: 4.4, reviews: 560, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80", badge: null, specs: "14.5\" 3K OLED, Dimensity 9000" },
  // --- Smartwatches ---
  { id: 31, category: "Smartwatches", name: "Apple Watch Ultra 2", brand: "Apple", price: 89900, originalPrice: 99900, rating: 4.9, reviews: 2100, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", badge: "Premium", specs: "49mm Titanium, GPS, 60hr battery" },
  { id: 32, category: "Smartwatches", name: "Samsung Galaxy Watch 7", brand: "Samsung", price: 32999, originalPrice: 39999, rating: 4.6, reviews: 1540, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", badge: null, specs: "44mm AMOLED, BioActive Sensor" },
  { id: 33, category: "Smartwatches", name: "Google Pixel Watch 3", brand: "Google", price: 34999, originalPrice: 39999, rating: 4.5, reviews: 780, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", badge: null, specs: "45mm AMOLED, Fitbit health suite" },
  { id: 34, category: "Smartwatches", name: "Garmin Fenix 7 Pro Solar", brand: "Garmin", price: 79990, originalPrice: 89990, rating: 4.8, reviews: 1200, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", badge: "Outdoor", specs: "Solar charging, 22-day battery, GPS" },
  { id: 35, category: "Smartwatches", name: "Apple Watch Series 9", brand: "Apple", price: 41900, originalPrice: 49900, rating: 4.7, reviews: 4500, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", badge: "Popular", specs: "45mm Aluminum, Double Tap, S9 chip" },
  // --- Headphones & Audio ---
  { id: 36, category: "Audio", name: "Sony WH-1000XM5 Headphones", brand: "Sony", price: 29990, originalPrice: 34990, rating: 4.8, reviews: 6700, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80", badge: "Top Rated", specs: "ANC, 30hr battery, LDAC" },
  { id: 37, category: "Audio", name: "Apple AirPods Pro 2", brand: "Apple", price: 24900, originalPrice: 26900, rating: 4.7, reviews: 8900, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80", badge: "Bestseller", specs: "ANC, USB-C, Adaptive Audio" },
  { id: 38, category: "Audio", name: "Bose QuietComfort 45", brand: "Bose", price: 24900, originalPrice: 34900, rating: 4.7, reviews: 3400, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80", badge: null, specs: "ANC, 24hr battery, Comfortable" },
  { id: 39, category: "Audio", name: "Samsung Galaxy Buds 3 Pro", brand: "Samsung", price: 17999, originalPrice: 21999, rating: 4.5, reviews: 2100, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80", badge: null, specs: "ANC, 360° Audio, IPX7" },
  { id: 40, category: "Audio", name: "JBL Flip 6 Speaker", brand: "JBL", price: 11999, originalPrice: 13999, rating: 4.6, reviews: 5600, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80", badge: "Popular", specs: "Portable, IP67, 12hr battery" },
  { id: 41, category: "Audio", name: "Sennheiser Momentum 4", brand: "Sennheiser", price: 27990, originalPrice: 32990, rating: 4.7, reviews: 1200, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80", badge: null, specs: "60hr battery, ANC, Bluetooth 5.2" },
  { id: 42, category: "Audio", name: "Sony WF-1000XM5 Earbuds", brand: "Sony", price: 24990, originalPrice: 29990, rating: 4.7, reviews: 2300, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80", badge: null, specs: "Best ANC earbuds, LDAC" },
  { id: 43, category: "Audio", name: "Marshall Emberton III", brand: "Marshall", price: 8999, originalPrice: 10499, rating: 4.5, reviews: 3100, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80", badge: "Budget Gem", specs: "Portable, 30hr battery, IP67" },
  // --- TVs & Displays ---
  { id: 44, category: "TVs & Displays", name: "LG C3 OLED 65\"", brand: "LG", price: 189990, originalPrice: 219990, rating: 4.9, reviews: 1890, image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80", badge: "Editor's Choice", specs: "65\" 4K OLED, 120Hz, webOS, Dolby" },
  { id: 45, category: "TVs & Displays", name: "Samsung Neo QLED 8K 75\"", brand: "Samsung", price: 289990, originalPrice: 329990, rating: 4.7, reviews: 450, image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80", badge: "8K", specs: "75\" 8K, 144Hz, Neo Quantum Processor" },
  { id: 46, category: "TVs & Displays", name: "Sony Bravia XR 55\" OLED", brand: "Sony", price: 169990, originalPrice: 199990, rating: 4.8, reviews: 980, image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80", badge: null, specs: "55\" OLED, XR Processor, 4K 120Hz" },
  { id: 47, category: "TVs & Displays", name: "MI Smart TV 4K 55\"", brand: "Xiaomi", price: 39990, originalPrice: 49990, rating: 4.3, reviews: 4500, image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80", badge: "Budget", specs: "55\" UHD 4K, 60Hz, Android TV" },
  { id: 48, category: "TVs & Displays", name: "Dell 27\" 4K USB-C Monitor", brand: "Dell", price: 54990, originalPrice: 64990, rating: 4.6, reviews: 1200, image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80", badge: null, specs: "27\" IPS, 4K, 60Hz, USB-C, sRGB 99%" },
  { id: 49, category: "TVs & Displays", name: "LG UltraGear 32\" Gaming", brand: "LG", price: 44990, originalPrice: 54990, rating: 4.7, reviews: 890, image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80", badge: "Gaming", specs: "32\" QHD, 165Hz, 1ms, IPS" },
  { id: 50, category: "TVs & Displays", name: "Samsung Odyssey G9 49\"", brand: "Samsung", price: 109990, originalPrice: 129990, rating: 4.6, reviews: 560, image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80", badge: "Ultrawide", specs: "49\" Super Ultrawide, 240Hz, Curved" },
  // --- Cameras ---
  { id: 51, category: "Cameras", name: "Sony Alpha A7 IV", brand: "Sony", price: 249990, originalPrice: 279990, rating: 4.9, reviews: 2100, image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=80", badge: "Pro Pick", specs: "33MP Full Frame, 4K 60fps, IBIS" },
  { id: 52, category: "Cameras", name: "Canon EOS R6 Mark II", brand: "Canon", price: 229990, originalPrice: 259990, rating: 4.8, reviews: 1450, image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=80", badge: null, specs: "24MP, 40fps, 4K 60fps, IBIS" },
  { id: 53, category: "Cameras", name: "GoPro Hero 12 Black", brand: "GoPro", price: 39999, originalPrice: 44999, rating: 4.6, reviews: 3400, image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=80", badge: "Action Cam", specs: "5.3K 60fps, HyperSmooth, 27MP" },
  { id: 54, category: "Cameras", name: "Fujifilm X100VI", brand: "Fujifilm", price: 169990, originalPrice: 184990, rating: 4.8, reviews: 780, image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=80", badge: "Trendy", specs: "40MP, Fixed 23mm f/2, IBIS, Retro" },
  { id: 55, category: "Cameras", name: "DJI Mini 4 Pro Drone", brand: "DJI", price: 89990, originalPrice: 99990, rating: 4.7, reviews: 1200, image: "https://images.unsplash.com/photo-1576633587382-13ddf37b1fc1?w=400&q=80", badge: "Drone", specs: "4K 100fps, Omnidirectional Obstacle" },
  // --- Gaming ---
  { id: 56, category: "Gaming", name: "PlayStation 5 Digital", brand: "Sony", price: 44990, originalPrice: 49990, rating: 4.8, reviews: 7800, image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&q=80", badge: "Bestseller", specs: "4K Gaming, SSD, DualSense Controller" },
  { id: 57, category: "Gaming", name: "Xbox Series X", brand: "Microsoft", price: 49990, originalPrice: 54990, rating: 4.7, reviews: 5600, image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&q=80", badge: null, specs: "4K 120fps, 1TB SSD, Game Pass" },
  { id: 58, category: "Gaming", name: "Nintendo Switch OLED", brand: "Nintendo", price: 34990, originalPrice: 38990, rating: 4.7, reviews: 6700, image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&q=80", badge: "Handheld", specs: "7\" OLED, Portable & Docked mode" },
  { id: 59, category: "Gaming", name: "ASUS ROG Ally X", brand: "ASUS", price: 89990, originalPrice: 99990, rating: 4.5, reviews: 1230, image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&q=80", badge: "Handheld PC", specs: "Ryzen Z1 Extreme, 7\" FHD 120Hz" },
  { id: 60, category: "Gaming", name: "Razer DeathAdder V3 Pro", brand: "Razer", price: 12999, originalPrice: 14999, rating: 4.6, reviews: 2100, image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80", badge: "Gaming Mouse", specs: "63g, 30K DPI, 90hr wireless" },
  // --- Smart Home ---
  { id: 61, category: "Smart Home", name: "Amazon Echo Show 10", brand: "Amazon", price: 22999, originalPrice: 27999, rating: 4.5, reviews: 3400, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", badge: null, specs: "10\" screen, Alexa, 360° motion, camera" },
  { id: 62, category: "Smart Home", name: "Google Nest Hub Max", brand: "Google", price: 19999, originalPrice: 23999, rating: 4.4, reviews: 2100, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", badge: null, specs: "10\" display, Google Assistant, camera" },
  { id: 63, category: "Smart Home", name: "Philips Hue Starter Kit", brand: "Philips", price: 12999, originalPrice: 15999, rating: 4.6, reviews: 4500, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", badge: "Popular", specs: "4 bulbs + Bridge, 16M colors" },
  { id: 64, category: "Smart Home", name: "Ring Video Doorbell Pro 2", brand: "Ring", price: 18999, originalPrice: 22999, rating: 4.5, reviews: 1980, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", badge: null, specs: "Head-to-Toe 3D Motion, 1536p HD" },
  { id: 65, category: "Smart Home", name: "eufy RoboVac X8 Pro", brand: "eufy", price: 39999, originalPrice: 49999, rating: 4.4, reviews: 1200, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", badge: null, specs: "Robot Vacuum, 4000Pa, iPath Laser" },
  // --- Accessories ---
  { id: 66, category: "Accessories", name: "Apple MagSafe 3 Charger", brand: "Apple", price: 6900, originalPrice: 7900, rating: 4.6, reviews: 2300, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80", badge: null, specs: "140W USB-C, MagSafe, MacBook Pro" },
  { id: 67, category: "Accessories", name: "Anker 65W GaN Charger", brand: "Anker", price: 3499, originalPrice: 3999, rating: 4.7, reviews: 5600, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80", badge: "Best Value", specs: "65W, 3 ports, GaN II, Foldable" },
  { id: 68, category: "Accessories", name: "Logitech MX Master 3S", brand: "Logitech", price: 9995, originalPrice: 11995, rating: 4.8, reviews: 4500, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80", badge: "Popular", specs: "8000 DPI, Quiet clicks, USB-C" },
  { id: 69, category: "Accessories", name: "Samsung T7 Portable SSD 2TB", brand: "Samsung", price: 13999, originalPrice: 16999, rating: 4.7, reviews: 3200, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80", badge: null, specs: "2TB, USB 3.2, 1050MB/s, Compact" },
  { id: 70, category: "Accessories", name: "Ugreen 10-in-1 USB-C Hub", brand: "Ugreen", price: 4999, originalPrice: 6499, rating: 4.5, reviews: 2100, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80", badge: null, specs: "4K HDMI, 100W PD, SD/TF, USB 3.0" },
  // --- Refrigerators & Appliances ---
  { id: 71, category: "Appliances", name: "Samsung French Door Refrigerator", brand: "Samsung", price: 89990, originalPrice: 104990, rating: 4.5, reviews: 1200, image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&q=80", badge: null, specs: "674L, SmartThings, Twin Cooling" },
  { id: 72, category: "Appliances", name: "LG Washing Machine 9Kg", brand: "LG", price: 49990, originalPrice: 59990, rating: 4.6, reviews: 2100, image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&q=80", badge: null, specs: "9Kg, AI DD, Steam, 5 Star" },
  { id: 73, category: "Appliances", name: "Dyson V15 Detect Vacuum", brand: "Dyson", price: 59990, originalPrice: 69990, rating: 4.7, reviews: 1800, image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&q=80", badge: "Premium", specs: "Laser Detect, 60min runtime, HEPA" },
  { id: 74, category: "Appliances", name: "Philips Air Fryer HD9270", brand: "Philips", price: 12995, originalPrice: 15995, rating: 4.5, reviews: 4500, image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&q=80", badge: "Popular", specs: "7L XL, RapidAir, 1725W" },
  { id: 75, category: "Appliances", name: "Instant Pot Duo 7-in-1", brand: "Instant Pot", price: 8499, originalPrice: 9999, rating: 4.6, reviews: 7800, image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&q=80", badge: "Bestseller", specs: "7-in-1, 5.7L, Pressure Cooker" },
  // --- Wearables & Health ---
  { id: 76, category: "Wearables", name: "Fitbit Charge 6", brand: "Fitbit", price: 17999, originalPrice: 21999, rating: 4.4, reviews: 2300, image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&q=80", badge: null, specs: "GPS, ECG, 7-day battery, AMOLED" },
  { id: 77, category: "Wearables", name: "Oura Ring Gen 4", brand: "Oura", price: 34990, originalPrice: 39990, rating: 4.5, reviews: 890, image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&q=80", badge: "Health Ring", specs: "Sleep tracking, SPO2, 8-day battery" },
  { id: 78, category: "Wearables", name: "Whoop 4.0", brand: "Whoop", price: 19999, originalPrice: 24999, rating: 4.3, reviews: 560, image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&q=80", badge: "Athletic", specs: "Recovery, Sleep, Strain tracking" },
  // --- Networking ---
  { id: 79, category: "Networking", name: "ASUS ZenWiFi Pro ET12", brand: "ASUS", price: 59990, originalPrice: 69990, rating: 4.7, reviews: 780, image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80", badge: "WiFi 6E", specs: "Tri-band, 11000 Mbps Mesh System" },
  { id: 80, category: "Networking", name: "TP-Link Deco XE75", brand: "TP-Link", price: 32990, originalPrice: 38990, rating: 4.5, reviews: 1200, image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80", badge: null, specs: "WiFi 6E Mesh, 4804 Mbps, 3-pack" },
  // --- Power & Charging ---
  { id: 81, category: "Power", name: "Jackery Explorer 1000 Pro", brand: "Jackery", price: 89990, originalPrice: 104990, rating: 4.8, reviews: 680, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80", badge: "Solar Ready", specs: "1002Wh, 1000W AC, LiFePO4" },
  { id: 82, category: "Power", name: "Anker 26800 Power Bank", brand: "Anker", price: 4999, originalPrice: 5999, rating: 4.6, reviews: 5600, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80", badge: "Popular", specs: "26800mAh, 65W, 3 ports" },
  { id: 83, category: "Power", name: "Belkin Boost Charge 3-in-1", brand: "Belkin", price: 12999, originalPrice: 14999, rating: 4.5, reviews: 1200, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80", badge: null, specs: "iPhone+Watch+AirPods wireless charger" },
  // --- PC Components ---
  { id: 84, category: "PC Components", name: "NVIDIA RTX 4090 GPU", brand: "NVIDIA", price: 199990, originalPrice: 219990, rating: 4.9, reviews: 540, image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&q=80", badge: "Top GPU", specs: "24GB GDDR6X, 4K Gaming Beast" },
  { id: 85, category: "PC Components", name: "AMD Ryzen 9 7950X3D", brand: "AMD", price: 69990, originalPrice: 79990, rating: 4.8, reviews: 780, image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&q=80", badge: "Best CPU", specs: "16 Core, 5.7GHz, AM5, 3D V-Cache" },
  { id: 86, category: "PC Components", name: "Samsung 990 Pro 2TB NVMe", brand: "Samsung", price: 19999, originalPrice: 24999, rating: 4.8, reviews: 2100, image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&q=80", badge: null, specs: "7450/6900 MB/s Seq R/W" },
  { id: 87, category: "PC Components", name: "Corsair DDR5 64GB 6200MHz", brand: "Corsair", price: 24990, originalPrice: 29990, rating: 4.7, reviews: 980, image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&q=80", badge: null, specs: "64GB (2x32), DDR5, 6200MHz CL36" },
  // --- E-Readers ---
  { id: 88, category: "E-Readers", name: "Kindle Paperwhite Signature", brand: "Amazon", price: 21999, originalPrice: 24999, rating: 4.8, reviews: 5400, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80", badge: "Top E-Reader", specs: "6.8\", 300 PPI, Wireless Charging" },
  { id: 89, category: "E-Readers", name: "Kobo Elipsa 2E", brand: "Kobo", price: 29990, originalPrice: 34990, rating: 4.5, reviews: 890, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80", badge: null, specs: "10.3\" E-Ink, Stylus included" },
  // --- Projectors ---
  { id: 90, category: "Projectors", name: "LG CineBeam 4K UST Projector", brand: "LG", price: 299990, originalPrice: 349990, rating: 4.6, reviews: 320, image: "https://images.unsplash.com/photo-1526869246862-08d97d94c0e1?w=400&q=80", badge: "Premium", specs: "4K UHD, 2500 ANSI, Ultra Short Throw" },
  { id: 91, category: "Projectors", name: "BenQ TK700 Gaming Projector", brand: "BenQ", price: 129990, originalPrice: 149990, rating: 4.5, reviews: 560, image: "https://images.unsplash.com/photo-1526869246862-08d97d94c0e1?w=400&q=80", badge: "Gaming", specs: "4K, 240Hz, 3200 ANSI Lumens" },
  { id: 92, category: "Projectors", name: "Anker Nebula Cosmos Laser", brand: "Anker", price: 87990, originalPrice: 97990, rating: 4.4, reviews: 780, image: "https://images.unsplash.com/photo-1526869246862-08d97d94c0e1?w=400&q=80", badge: null, specs: "4K Laser, 2200 ANSI, 4hr battery" },
  // --- Security ---
  { id: 93, category: "Security", name: "Arlo Pro 5S Camera", brand: "Arlo", price: 32990, originalPrice: 38990, rating: 4.5, reviews: 1200, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", badge: null, specs: "4K, Color Night Vision, Outdoor" },
  { id: 94, category: "Security", name: "Eufy Indoor Cam 4K", brand: "Eufy", price: 5999, originalPrice: 7499, rating: 4.4, reviews: 3400, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", badge: "Budget", specs: "4K, 2-way audio, AI detection" },
  // --- Kids & Education ---
  { id: 95, category: "Kids Tech", name: "LeapFrog LeapPad Tablet", brand: "LeapFrog", price: 8999, originalPrice: 10999, rating: 4.4, reviews: 2300, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80", badge: "Kids", specs: "7\", Kid-safe, 1000+ Apps & Games" },
  { id: 96, category: "Kids Tech", name: "Osmo Learning System", brand: "Osmo", price: 12999, originalPrice: 15999, rating: 4.6, reviews: 1800, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80", badge: "Educational", specs: "iPad-based, tangible STEM learning" },
  // --- VR/AR ---
  { id: 97, category: "VR/AR", name: "Meta Quest 3", brand: "Meta", price: 59999, originalPrice: 69999, rating: 4.6, reviews: 3200, image: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400&q=80", badge: "Mixed Reality", specs: "4K+ Pancake Lenses, Snapdragon XR2 Gen2" },
  { id: 98, category: "VR/AR", name: "Apple Vision Pro", brand: "Apple", price: 299900, originalPrice: 319900, rating: 4.5, reviews: 890, image: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400&q=80", badge: "Spatial Computing", specs: "Micro-OLED, EyeSight, M2 + R1" },
  // --- Drones ---
  { id: 99, category: "Drones", name: "DJI Air 3", brand: "DJI", price: 89990, originalPrice: 99990, rating: 4.7, reviews: 1100, image: "https://images.unsplash.com/photo-1576633587382-13ddf37b1fc1?w=400&q=80", badge: "Popular", specs: "4K/60fps, 3 cameras, 46min flight" },
  { id: 100, category: "Drones", name: "DJI Avata 2 FPV", brand: "DJI", price: 79990, originalPrice: 89990, rating: 4.6, reviews: 680, image: "https://images.unsplash.com/photo-1576633587382-13ddf37b1fc1?w=400&q=80", badge: "FPV", specs: "4K/60fps, Motion Controller, 23min" },
];

// Curated reliable images per category
const categoryImages = {
  "Mobile Phones":  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80",
  "Laptops":        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80",
  "Tablets":        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80",
  "Smartwatches":   "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
  "Audio":          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
  "TVs & Displays": "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&q=80",
  "Cameras":        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80",
  "Gaming":         "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&q=80",
  "Smart Home":     "https://images.unsplash.com/photo-1558002038-1055907df827?w=400&q=80",
  "Accessories":    "https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=400&q=80",
  "Appliances":     "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",
  "Wearables":      "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&q=80",
  "Networking":     "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80",
  "Power":          "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=80",
  "PC Components":  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80",
  "E-Readers":      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80",
  "Projectors":     "https://images.unsplash.com/photo-1606471191009-63994c53433b?w=400&q=80",
  "Security":       "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  "Kids Tech":      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&q=80",
  "VR/AR":          "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400&q=80",
  "Drones":         "https://images.unsplash.com/photo-1576633587382-13ddf37b1fc1?w=400&q=80",
};

// Assign curated category images with unique offset to vary images within same category
storeProductsDB.forEach((product, i) => {
  const base = categoryImages[product.category] || "https://images.unsplash.com/photo-1526869246862-08d97d94c0e1?w=400&q=80";
  // append a cache-bust param that varies per product while keeping the photo URL the same
  product.image = base.replace('?w=400', `?w=400&product=${product.id}`);
  product.sold = Math.floor(product.reviews * 3.7 + 100); // Mock sold count based on reviews
});

// ==========================================
// ==========================================
// Software Products Database
// ==========================================
const softwareProductsDB = [
  // --- CRM & Sales ---
  { id: 201, category: "CRM & Sales", name: "Salesforce Sales Cloud", brand: "Salesforce", price: 18000, originalPrice: 24000, rating: 4.7, reviews: 12400, badge: "Market Leader", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80&product=201", specs: "AI-powered CRM, Pipeline management, Automation" },
  { id: 202, category: "CRM & Sales", name: "HubSpot CRM Suite", brand: "HubSpot", price: 7200, originalPrice: 9600, rating: 4.6, reviews: 9800, badge: "Bestseller", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80&product=202", specs: "Free tier available, Marketing + Sales + Service" },
  { id: 203, category: "CRM & Sales", name: "Zoho CRM Plus", brand: "Zoho", price: 2400, originalPrice: 3600, rating: 4.4, reviews: 7200, badge: "Budget Pick", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80&product=203", specs: "Multi-channel, AI Zia, Indian Support" },
  // --- Productivity ---
  { id: 204, category: "Productivity", name: "Microsoft 365 Business", brand: "Microsoft", price: 1620, originalPrice: 2160, rating: 4.8, reviews: 42000, badge: "Top Rated", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80&product=204", specs: "Word, Excel, PowerPoint, Teams, 1TB OneDrive" },
  { id: 205, category: "Productivity", name: "Google Workspace Business", brand: "Google", price: 1380, originalPrice: 1800, rating: 4.7, reviews: 38000, badge: "Popular", image: "https://images.unsplash.com/photo-1494475673543-6a6a27143fc8?w=400&q=80&product=205", specs: "Gmail, Drive, Meet, Docs, Sheets, Slides" },
  { id: 206, category: "Productivity", name: "Notion Team Plan", brand: "Notion", price: 960, originalPrice: 1440, rating: 4.6, reviews: 15200, badge: null, image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&q=80&product=206", specs: "All-in-one workspace, AI writing, Wiki" },
  { id: 207, category: "Productivity", name: "Slack Pro", brand: "Slack", price: 540, originalPrice: 840, rating: 4.5, reviews: 22000, badge: null, image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80&product=207", specs: "Channels, Integrations, Huddle, Workflow Builder" },
  // --- DevOps & Cloud ---
  { id: 208, category: "DevOps & Cloud", name: "GitHub Team", brand: "GitHub", price: 3600, originalPrice: 4800, rating: 4.8, reviews: 31000, badge: "Dev Favorite", image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&q=80&product=208", specs: "Unlimited repos, Actions CI/CD, Copilot AI" },
  { id: 209, category: "DevOps & Cloud", name: "Docker Business", brand: "Docker", price: 4200, originalPrice: 6000, rating: 4.6, reviews: 14000, badge: null, image: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400&q=80&product=209", specs: "Container runtime, Desktop, Scout, Build Cloud" },
  { id: 210, category: "DevOps & Cloud", name: "AWS Starter Bundle", brand: "Amazon", price: 6000, originalPrice: 8400, rating: 4.7, reviews: 19000, badge: "Cloud Leader", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80&product=210", specs: "EC2, S3, RDS, Lambda, CloudFront" },
  { id: 211, category: "DevOps & Cloud", name: "Jira Software Cloud", brand: "Atlassian", price: 840, originalPrice: 1200, rating: 4.5, reviews: 28000, badge: null, image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80&product=211", specs: "Agile boards, Roadmaps, Advanced reporting" },
  // --- Cybersecurity ---
  { id: 212, category: "Cybersecurity", name: "CrowdStrike Falcon Go", brand: "CrowdStrike", price: 14400, originalPrice: 18000, rating: 4.8, reviews: 5200, badge: "Top Security", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80&product=212", specs: "EDR, AI threat detection, Cloud-native" },
  { id: 213, category: "Cybersecurity", name: "Bitdefender GravityZone", brand: "Bitdefender", price: 4800, originalPrice: 7200, rating: 4.7, reviews: 8400, badge: "Bestseller", image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400&q=80&product=213", specs: "Anti-malware, Ransomware protection, 10 Devices" },
  { id: 214, category: "Cybersecurity", name: "NordVPN Teams", brand: "Nord Security", price: 2400, originalPrice: 3600, rating: 4.6, reviews: 6300, badge: null, image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=400&q=80&product=214", specs: "Business VPN, Mesh network, Threat Protection" },
  { id: 215, category: "Cybersecurity", name: "LastPass Teams", brand: "LastPass", price: 1200, originalPrice: 2400, rating: 4.3, reviews: 4100, badge: "Budget Pick", image: "https://images.unsplash.com/photo-1555066931-4365d14431b9?w=400&q=80&product=215", specs: "Password manager, SSO, Admin console" },
  // --- Analytics & BI ---
  { id: 216, category: "Analytics & BI", name: "Tableau Creator", brand: "Tableau", price: 8400, originalPrice: 12000, rating: 4.7, reviews: 7800, badge: "Pro Choice", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80&product=216", specs: "Data visualization, Dashboards, AI insights" },
  { id: 217, category: "Analytics & BI", name: "Power BI Premium", brand: "Microsoft", price: 1620, originalPrice: 2400, rating: 4.6, reviews: 14300, badge: "Value King", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80&product=217", specs: "Interactive dashboards, Azure integration, Copilot" },
  { id: 218, category: "Analytics & BI", name: "Google Analytics 360", brand: "Google", price: 12000, originalPrice: 18000, rating: 4.5, reviews: 9200, badge: null, image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80&product=218", specs: "Enterprise web analytics, BigQuery export, BI" },
  // --- Design & Creative ---
  { id: 219, category: "Design & Creative", name: "Adobe Creative Cloud", brand: "Adobe", price: 6000, originalPrice: 7800, rating: 4.8, reviews: 29000, badge: "Industry Standard", image: "https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=400&q=80&product=219", specs: "Photoshop, Illustrator, Premiere, 100+ apps" },
  { id: 220, category: "Design & Creative", name: "Figma Professional", brand: "Figma", price: 1200, originalPrice: 1800, rating: 4.7, reviews: 18000, badge: "Designer's Pick", image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&q=80&product=220", specs: "UI/UX design, Prototyping, Dev mode" },
  { id: 221, category: "Design & Creative", name: "Canva for Teams", brand: "Canva", price: 3600, originalPrice: 4800, rating: 4.6, reviews: 24000, badge: "Hot Deal", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80&product=221", specs: "Brand kits, Magic AI, 100M+ templates" },
  // --- HR & Payroll ---
  { id: 222, category: "HR & Payroll", name: "Darwinbox HR Suite", brand: "Darwinbox", price: 4800, originalPrice: 7200, rating: 4.4, reviews: 3600, badge: "India's #1", image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&q=80&product=222", specs: "HRMS, Payroll, Recruitment, Performance" },
  { id: 223, category: "HR & Payroll", name: "Keka HR", brand: "Keka", price: 2400, originalPrice: 3600, rating: 4.5, reviews: 4800, badge: "SMB Favorite", image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80&product=223", specs: "Payroll, Attendance, Leave management, ESS" },
  { id: 224, category: "HR & Payroll", name: "BambooHR Essentials", brand: "BambooHR", price: 3000, originalPrice: 4200, rating: 4.6, reviews: 6200, badge: null, image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&q=80&product=224", specs: "Employee database, Onboarding, PTO tracking" },
  // --- Accounting & Finance ---
  { id: 225, category: "Accounting & Finance", name: "QuickBooks Online Plus", brand: "Intuit", price: 3000, originalPrice: 4200, rating: 4.6, reviews: 21000, badge: "Bestseller", image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80&product=225", specs: "Invoicing, GST filing, 5 users, Reports" },
  { id: 226, category: "Accounting & Finance", name: "Tally Prime", brand: "Tally Solutions", price: 18000, originalPrice: 22000, rating: 4.5, reviews: 16000, badge: "India Fav", image: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=400&q=80&product=226", specs: "Accounting, GST, Inventory, Payroll" },
  { id: 227, category: "Accounting & Finance", name: "Zoho Books Professional", brand: "Zoho", price: 2400, originalPrice: 3600, rating: 4.5, reviews: 8400, badge: null, image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80&product=227", specs: "GST invoicing, 5 users, Inventory, Integrations" },
  // --- Marketing ---
  { id: 228, category: "Marketing", name: "Mailchimp Standard", brand: "Mailchimp", price: 1800, originalPrice: 2400, rating: 4.5, reviews: 13000, badge: null, image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&q=80&product=228", specs: "Email automation, 100k contacts, Analytics" },
  { id: 229, category: "Marketing", name: "SEMrush Pro", brand: "SEMrush", price: 10800, originalPrice: 14400, rating: 4.6, reviews: 7200, badge: "SEO Leader", image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400&q=80&product=229", specs: "SEO, PPC, Content, Competitor analysis" },
  { id: 230, category: "Marketing", name: "Buffer Essentials", brand: "Buffer", price: 720, originalPrice: 1080, rating: 4.3, reviews: 5400, badge: "Budget Pick", image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80&product=230", specs: "Social media scheduling, Analytics, AI assistant" },
  // --- E-Learning ---
  { id: 231, category: "E-Learning", name: "Coursera for Business", brand: "Coursera", price: 14400, originalPrice: 18000, rating: 4.7, reviews: 8900, badge: "Top LMS", image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&q=80&product=231", specs: "7000+ courses, Certifications, Team analytics" },
  { id: 232, category: "E-Learning", name: "Udemy Business", brand: "Udemy", price: 9600, originalPrice: 13200, rating: 4.6, reviews: 11000, badge: "Popular", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80&product=232", specs: "25000+ courses, Learning paths, Mobile access" },
  { id: 233, category: "E-Learning", name: "LinkedIn Learning", brand: "LinkedIn", price: 1800, originalPrice: 2400, rating: 4.5, reviews: 15000, badge: null, image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80&product=233", specs: "21000+ expert courses, Certificates, LinkedIn profile" },
  // --- Customer Support ---
  { id: 234, category: "Customer Support", name: "Zendesk Suite Growth", brand: "Zendesk", price: 6000, originalPrice: 8400, rating: 4.6, reviews: 9100, badge: null, image: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=400&q=80&product=234", specs: "Ticketing, Live chat, AI bots, Reporting" },
  { id: 235, category: "Customer Support", name: "Freshdesk Growth", brand: "Freshworks", price: 1200, originalPrice: 2400, rating: 4.5, reviews: 7800, badge: "Hot Deal", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80&product=235", specs: "Ticketing, Phone, Chat, CSAT, SLA management" },
  { id: 236, category: "Customer Support", name: "Intercom Starter", brand: "Intercom", price: 7200, originalPrice: 9600, rating: 4.4, reviews: 5600, badge: null, image: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=400&q=80&product=236", specs: "AI-first CS, In-app chat, Proactive support" },
  // --- Project Management ---
  { id: 237, category: "Project Management", name: "Asana Business", brand: "Asana", price: 2640, originalPrice: 3600, rating: 4.6, reviews: 16000, badge: "Team Fav", image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80&product=237", specs: "Goals, Timelines, Portfolios, AI features" },
  { id: 238, category: "Project Management", name: "Monday.com Pro", brand: "Monday.com", price: 3600, originalPrice: 4800, rating: 4.7, reviews: 14000, badge: "Bestseller", image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=400&q=80&product=238", specs: "Dashboards, Automations, Gantt, Workdocs" },
  { id: 239, category: "Project Management", name: "Trello Premium", brand: "Atlassian", price: 1200, originalPrice: 1800, rating: 4.4, reviews: 19000, badge: null, image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&q=80&product=239", specs: "Kanban boards, Advanced checklists, Timeline view" },
  { id: 240, category: "Project Management", name: "ClickUp Business", brand: "ClickUp", price: 1680, originalPrice: 2400, rating: 4.5, reviews: 12000, badge: "Value King", image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=400&q=80&product=240", specs: "All-in-one, 15+ views, AI, Time tracking" },
];

softwareProductsDB.forEach((product) => {
  product.sold = Math.floor(product.reviews * 4.2 + 50);
});

// ==========================================
// ==========================================
// Salesforce OAuth Endpoints
// ==========================================
app.get('/api/auth/salesforce', (req, res) => {
  const clientId = process.env.SALESFORCE_CLIENT_ID;
  const callbackUrl = process.env.SALESFORCE_CALLBACK_URL || 'http://localhost:6000/api/auth/salesforce/callback';
  const sfBaseUrl = 'https://login.salesforce.com';
  
  const authUrl = `${sfBaseUrl}/services/oauth2/authorize?` +
    `response_type=code&` +
    `client_id=${encodeURIComponent(clientId)}&` +
    `redirect_uri=${encodeURIComponent(callbackUrl)}&` +
    `scope=openid%20profile%20email&` +
    `prompt=login`;
  
  res.redirect(authUrl);
});

app.get('/api/auth/salesforce/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.redirect('http://localhost:5173/store?error=auth_failed');

  try {
    const clientId = process.env.SALESFORCE_CLIENT_ID;
    const clientSecret = process.env.SALESFORCE_CLIENT_SECRET;
    const callbackUrl = process.env.SALESFORCE_CALLBACK_URL;
    const sfBaseUrl = 'https://login.salesforce.com';

    // Exchange code for token
    const tokenRes = await fetch(`${sfBaseUrl}/services/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: callbackUrl
      })
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) throw new Error('No access token');

    // Get user info
    const userRes = await fetch(tokenData.id, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    const sfUser = await userRes.json();

    const email = sfUser.email;
    const name = sfUser.display_name || `${sfUser.first_name} ${sfUser.last_name}`;
    
    // Upsert in store DB
    let user = storeUsersDB.find(u => u.email === email);
    if (!user) {
      user = { id: Date.now(), name, email, phone: '', companyName: sfUser.organization_id || '', role: sfUser.title || '', cart: [], orders: [], provider: 'salesforce' };
      storeUsersDB.push(user);
    }

    const { cart, orders, ...safeUser } = user;
    const encoded = encodeURIComponent(JSON.stringify(safeUser));
    res.redirect(`http://localhost:5173/store?sfuser=${encoded}`);
  } catch (err) {
    console.error('Salesforce OAuth error:', err);
    res.redirect(`http://localhost:5173/store?error=auth_failed`);
  }
});

// ==========================================
// Store Endpoints (Auth, Cart, Products)
// ==========================================
app.post('/api/store/signup', (req, res) => {
  const { name, email, phone, companyName, role } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ success: false, error: 'Name, email and phone are required.' });
  }
  const existing = storeUsersDB.find(u => u.email === email);
  if (existing) {
    return res.status(409).json({ success: false, error: 'An account with this email already exists. Please login.' });
  }
  const newUser = { id: Date.now(), name, email, phone, companyName: companyName || '', role: role || '', cart: [], orders: [] };
  storeUsersDB.push(newUser);
  const { cart, orders, ...safeUser } = newUser;
  res.json({ success: true, user: safeUser });
});

app.post('/api/store/login', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, error: 'Email is required.' });
  
  const user = storeUsersDB.find(u => u.email === email);
  if (!user) {
    return res.status(404).json({ success: false, error: 'Account not found. Please sign up.' });
  }
  const { cart, orders, ...safeUser } = user;
  res.json({ success: true, user: safeUser });
});

// Cart Management
app.get('/api/store/cart', (req, res) => {
  const { email } = req.query;
  const user = storeUsersDB.find(u => u.email === email);
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });
  
  if (!user.cart) user.cart = [];

  // Hydrate cart with full product details
  const populatedCart = user.cart.map(cartItem => {
    let product = storeProductsDB.find(p => p.id === cartItem.productId);
    if (!product) product = softwareProductsDB.find(p => p.id === cartItem.productId);
    
    if (!product) {
      return { id: cartItem.productId, name: "Unknown Product", price: 0, image: '', quantity: cartItem.quantity };
    }
    return { ...product, quantity: cartItem.quantity };
  });
  
  res.json({ success: true, cart: populatedCart });
});

app.post('/api/store/cart', (req, res) => {
  const { email, productId, action } = req.body; // action: 'add' or 'remove'
  const user = storeUsersDB.find(u => u.email === email);
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });

  if (!user.cart) user.cart = [];

  const existingItemIndex = user.cart.findIndex(item => item.productId === productId);

  if (action === 'add') {
    if (existingItemIndex > -1) {
      user.cart[existingItemIndex].quantity += 1;
    } else {
      user.cart.push({ productId, quantity: 1 });
    }
  } else if (action === 'remove') {
    if (existingItemIndex > -1) {
       user.cart.splice(existingItemIndex, 1);
    }
  }

  // Return hydrated cart
  const populatedCart = user.cart.map(cartItem => {
    let product = storeProductsDB.find(p => p.id === cartItem.productId);
    if (!product) product = softwareProductsDB.find(p => p.id === cartItem.productId);
    
    if (!product) {
      return { id: cartItem.productId, name: "Unknown Product", price: 0, image: '', quantity: cartItem.quantity };
    }
    return { ...product, quantity: cartItem.quantity };
  });

  res.json({ success: true, cart: populatedCart });
});

app.post('/api/store/checkout', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, error: 'Email is required' });

  const user = storeUsersDB.find(u => u.email === email);
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });

  if (!user.cart || user.cart.length === 0) {
    return res.status(400).json({ success: false, error: 'Cart is empty' });
  }

  // Hydrate cart for total calculation and item listing
  const purchasedItems = [];
  let cartTotal = 0;
  
  user.cart.forEach(cartItem => {
    // Check both hardware and software DBs
    let product = storeProductsDB.find(p => p.id === cartItem.productId);
    if (!product) {
      product = softwareProductsDB.find(p => p.id === cartItem.productId);
    }
    
    if (product) {
      cartTotal += product.price * cartItem.quantity;
      purchasedItems.push({ name: product.name, quantity: cartItem.quantity, price: product.price });
    }
  });

  const productListStr = purchasedItems.map(i => `${i.quantity}x ${i.name}`).join(', ');
  const orderId = `ORD-${Date.now()}`;

  // Create or Update CRM Customer
  const existingCustomer = customersDB.find(c => c.email === email);
  
  if (existingCustomer) {
    // Update existing customer interactions
    existingCustomer.interactions.unshift({
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
      event: `Purchased ${productListStr} for ₹${cartTotal.toLocaleString('en-IN')}`
    });
    
    // Update product interest
    if (!existingCustomer.productInterest.includes(productListStr)) {
      existingCustomer.productInterest = `${existingCustomer.productInterest}, ${productListStr}`;
    }

    // Add to deal history since they bought something
    if (!existingCustomer.dealHistory) existingCustomer.dealHistory = [];
    existingCustomer.dealHistory.unshift({
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      product: productListStr,
      amount: `₹${cartTotal.toLocaleString('en-IN')}`,
      status: "Closed Won"
    });
    existingCustomer.customerType = 'existing';
  } else {
    // Create new customer
    const newId = customersDB.length > 0 ? Math.max(...customersDB.map(c => c.id)) + 1 : 1;
    const newCustomer = {
      id: newId,
      name: user.name,
      contact: encodeURIComponent(user.name),
      email: user.email,
      role: user.role || 'Customer',
      phone: user.phone || '',
      software: 'Various',
      status: 'Active',
      productInterest: productListStr,
      avatar: `https://i.pravatar.cc/150?u=${user.email.replace(/[^a-zA-Z0-9]/g, '')}`,
      summary: `${user.name} recently purchased ${productListStr} worth ₹${cartTotal.toLocaleString('en-IN')} from AuraStore. They have been active and recently onboarded.`,
      insights: [
        { type: "intent", text: `High intent buyer: Purchased ${purchasedItems.length} items recently.` },
        { type: "engagement", text: "Successfully completed AuraStore checkout." }
      ],
      interactions: [
        { 
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' }), 
          event: `Purchased ${productListStr} for ₹${cartTotal.toLocaleString('en-IN')}` 
        }
      ],
      customerType: 'new',
      dealHistory: [{
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        product: productListStr,
        amount: `₹${cartTotal.toLocaleString('en-IN')}`,
        status: "Closed Won"
      }]
    };
    customersDB.unshift(newCustomer); // Add to beginning
  }

  // Clear user cart and record order
  user.orders.push({
    id: orderId,
    date: new Date().toISOString(),
    items: [...user.cart],
    total: cartTotal
  });
  
  user.cart = [];

  // ── Send Order Confirmation Email ──────────────────────────────
  if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      // Build itemised HTML rows
      const itemRows = purchasedItems.map(item => `
        <tr>
          <td style="padding:12px 16px; border-bottom:1px solid #1e2a3a; color:#e2e8f0; font-size:14px;">${item.name}</td>
          <td style="padding:12px 16px; border-bottom:1px solid #1e2a3a; color:#94a3b8; text-align:center; font-size:14px;">${item.quantity}</td>
          <td style="padding:12px 16px; border-bottom:1px solid #1e2a3a; color:#a855f7; font-weight:700; text-align:right; font-size:14px;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
        </tr>
      `).join('');

      const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background:#0d1117; font-family: 'Segoe UI', Arial, sans-serif;">
  <div style="max-width:600px; margin:0 auto; padding:32px 16px;">

    <!-- Header -->
    <div style="text-align:center; margin-bottom:32px;">
      <div style="display:inline-flex; align-items:center; gap:10px; background:linear-gradient(135deg,#7c3aed,#a855f7); border-radius:16px; padding:14px 28px;">
        <span style="font-size:22px; font-weight:900; color:white;">⚡ AuraStore</span>
      </div>
    </div>

    <!-- Success Banner -->
    <div style="background:linear-gradient(135deg,#064e3b,#065f46); border:1px solid #10b981; border-radius:16px; padding:24px; text-align:center; margin-bottom:28px;">
      <div style="font-size:40px; margin-bottom:8px;">✅</div>
      <h1 style="margin:0 0 8px 0; font-size:24px; font-weight:800; color:#10b981;">Order Confirmed!</h1>
      <p style="margin:0; color:#6ee7b7; font-size:15px;">Thank you, <strong>${user.name}</strong>. Your order has been placed successfully.</p>
    </div>

    <!-- Order Info -->
    <div style="background:#161b27; border:1px solid #1e2a3a; border-radius:16px; padding:20px; margin-bottom:24px;">
      <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
        <span style="color:#64748b; font-size:13px;">Order ID</span>
        <span style="color:#a855f7; font-weight:700; font-size:13px;">${orderId}</span>
      </div>
      <div style="display:flex; justify-content:space-between;">
        <span style="color:#64748b; font-size:13px;">Date</span>
        <span style="color:#e2e8f0; font-size:13px;">${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
      </div>
    </div>

    <!-- Items Table -->
    <div style="background:#161b27; border:1px solid #1e2a3a; border-radius:16px; overflow:hidden; margin-bottom:24px;">
      <div style="padding:16px 20px; border-bottom:1px solid #1e2a3a;">
        <h2 style="margin:0; font-size:16px; font-weight:700; color:white;">🛒 Order Summary</h2>
      </div>
      <table style="width:100%; border-collapse:collapse;">
        <thead>
          <tr style="background:#0f1623;">
            <th style="padding:10px 16px; text-align:left; color:#64748b; font-size:12px; text-transform:uppercase; letter-spacing:0.05em;">Product</th>
            <th style="padding:10px 16px; text-align:center; color:#64748b; font-size:12px; text-transform:uppercase; letter-spacing:0.05em;">Qty</th>
            <th style="padding:10px 16px; text-align:right; color:#64748b; font-size:12px; text-transform:uppercase; letter-spacing:0.05em;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
        <tfoot>
          <tr style="background:#0f1623;">
            <td colspan="2" style="padding:16px; color:white; font-weight:800; font-size:16px;">Total</td>
            <td style="padding:16px; color:#a855f7; font-weight:900; font-size:20px; text-align:right;">₹${cartTotal.toLocaleString('en-IN')}</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Footer -->
    <p style="text-align:center; color:#334155; font-size:13px; margin-top:24px;">
      This is an automated order confirmation from <strong style="color:#a855f7;">AuraStore</strong>.<br>
      For any queries, please contact our support team.
    </p>
  </div>
</body>
</html>`;

      await transporter.sendMail({
        from: `"AuraStore" <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject: `✅ Order Confirmed – ${orderId} | AuraStore`,
        html: htmlBody,
        text: `Order Confirmed!\n\nHi ${user.name},\n\nYour order ${orderId} has been placed.\n\nItems:\n${purchasedItems.map(i => `  ${i.quantity}x ${i.name} — ₹${(i.price * i.quantity).toLocaleString('en-IN')}`).join('\n')}\n\nTotal: ₹${cartTotal.toLocaleString('en-IN')}\n\nThank you for shopping with AuraStore!`,
      });

      console.log(`✅ Order confirmation email sent to ${email}`);
    } catch (emailErr) {
      console.error('❌ Failed to send order confirmation email:', emailErr.message);
      // Don't fail the checkout because of email error
    }
  }

  res.json({ success: true, message: 'Checkout complete', orderId });
});

// Products
app.get('/api/store/products', (req, res) => {
  const { category, search } = req.query;
  let filtered = storeProductsDB;
  if (category && category !== 'All') {
    filtered = filtered.filter(p => p.category === category);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
  }
  const categories = ['All', ...new Set(storeProductsDB.map(p => p.category))];
  res.json({ success: true, products: filtered, categories });
});

// AI Product Details & Reviews
app.get('/api/store/product-details/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = storeProductsDB.find(p => p.id === productId);
    
    if (!product) {
       return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const prompt = `
      You are an expert e-commerce copywriter.
      Generate a compelling, 2-paragraph product summary and EXACTLY 3 highly realistic user reviews for the following product:
      Name: ${product.brand} ${product.name}
      Specs: ${product.specs}
      Price: ₹${product.price}
      Rating: ${product.rating}

      Return the response STRICTLY as a JSON object matching this schema exactly without any markdown wrapping or other text:
      {
        "summary": "Compelling 2 paragraph string...",
        "reviews": [
          {"author": "Random Name", "rating": 5, "title": "Great!", "content": "Review text...", "date": "2 days ago"}
        ]
      }
    `;

    const groqClient = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
    });

    const response = await groqClient.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You only output raw valid JSON objects. No markdown, no explanation, no code blocks." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1200,
    });

    const aiResponseText = response.choices[0]?.message?.content || '{}';

    // parse the JSON response exactly
    let aiData;
    try {
      // Find JSON block robustly
      const jsonMatch = aiResponseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON object found in response");
      aiData = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error("Failed to parse AI review output:", e.message, "\\nRaw output:", aiResponseText);
      aiData = { summary: "A premium electronic device designed for excellence.", reviews: [] };
    }

    res.json({
      success: true,
      product: product,
      details: aiData
    });
    
  } catch (error) {
    console.error('Error generating product details:', error);
    res.status(500).json({ success: false, error: 'Failed to generate details' });
  }
});




// Software Products Endpoint
app.get('/api/store/software-products', (req, res) => {
  const { category, search } = req.query;
  let filtered = softwareProductsDB;
  if (category && category !== 'All') {
    filtered = filtered.filter(p => p.category === category);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.specs.toLowerCase().includes(q));
  }
  const categories = ['All', ...new Set(softwareProductsDB.map(p => p.category))];
  res.json({ success: true, products: filtered, categories });
});

// AI Software Product Details & Reviews
app.get('/api/store/software-product-details/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = softwareProductsDB.find(p => p.id === productId);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });

    const prompt = `You are an expert B2B software reviewer. Generate a 2-paragraph compelling software product summary and EXACTLY 3 highly realistic user reviews for: Software: ${product.brand} ${product.name}, Category: ${product.category}, Features: ${product.specs}, Price: Rs.${product.price}/year, Rating: ${product.rating}/5. Return ONLY a raw JSON object with no markdown: { "summary": "...", "reviews": [{"author": "Name", "role": "Job Title", "rating": 5, "title": "...", "content": "...", "date": "1 week ago"}] }`;

    const groqClient = new OpenAI({ apiKey: process.env.GROQ_API_KEY, baseURL: 'https://api.groq.com/openai/v1' });
    const response = await groqClient.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You only output raw valid JSON objects. No markdown, no code blocks." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7, max_tokens: 1200,
    });

    const rawText = response.choices[0]?.message?.content || '{}';
    let aiData;
    try { const jsonMatch = rawText.match(/\{[\s\S]*\}/); aiData = JSON.parse(jsonMatch ? jsonMatch[0] : rawText); }
    catch (e) { aiData = { summary: `${product.name} is a leading ${product.category} solution by ${product.brand}.`, reviews: [] }; }

    res.json({ success: true, product, details: aiData });
  } catch (error) {
    console.error('SW product details error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate details' });
  }
});

// Top 10 Recommendations Endpoint
app.get('/api/store/top-products', (req, res) => {
  const hardwareTop = [...storeProductsDB]
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 10);
    
  const softwareTop = [...softwareProductsDB]
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 10);

  res.json({
    success: true,
    hardware: hardwareTop,
    software: softwareTop
  });
});

// ==========================================
// Serve Static Frontend (Production)
// ==========================================
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('AuraCRM AI Backend is Running...');
  });
}

app.listen(PORT, () => {
  console.log(`🚀 AuraCRM Server running on port ${PORT}`);
  console.log(`📡 Mode: ${process.env.NODE_ENV || 'development'}`);
});
