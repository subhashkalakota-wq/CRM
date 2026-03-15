import React, { useState } from 'react';
import { FileText, Download, LayoutTemplate, Zap, Loader2, Calendar, Clock, Edit2 } from 'lucide-react';
import { useToast } from '../Toast';
import './Modules.css';
import './CustomInputs.css';

const ProposalGenerator = ({ customer }) => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [proposal, setProposal] = useState({
    client: "TechFlow Inc.",
    title: "Enterprise Scale Automation Implementation",
    date: "Nov 15, 2026",
    software: "AuraCRM Automation Suite",
    productDetails: "A comprehensive solution designed to eliminate manual reporting and enhance pipeline visibility.",
    pricing: [
      {
        description: "Enterprise License (Annual)",
        details: "Standard yearly subscription for the primary platform capabilities.",
        justification: "Pricing is based on 50+ active global users and includes unlimited storage, advanced analytics processing, and priority module access.",
        amount: 85000
      },
      {
        description: "Custom Integration Services",
        details: "One-time fee for API connections and data migration from legacy systems.",
        justification: "Covers 120 hours of dedicated engineering time for secure data transfer, mapping legacy schemas to AuraCRM, and verifying pipeline integrity.",
        amount: 25000
      },
      {
        description: "Premium Support Package",
        details: "24/7 technical support and dedicated account management for 12 months.",
        justification: "Provides a guaranteed 1-hour SLA for critical issues, a dedicated Technical Account Manager (TAM), and quarterly business reviews to ensure ROI.",
        amount: 15000
      }
    ],
    totalValue: 125000
  });

  const generateProposal = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer })
      });
      const result = await response.json();
      if (result.success) {
        setProposal({
          ...result.data,
          client: customer ? customer.name : "TechFlow Inc."
        });
      }
    } catch (error) {
      console.error('Error generating proposal:', error);
      alert('Failed to connect to AI engine.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="module-container animate-fade-in">
      <div className="module-header">
        <div className="module-title-group">
          <div className="icon-wrapper base-bg">
            <FileText size={24} />
          </div>
          <div>
            <h2>Proposal Generator</h2>
            <p className="text-muted">Instantly create customized sales proposals tailored to client needs.</p>
          </div>
        </div>
        <button className="btn-primary" onClick={generateProposal} disabled={loading}>
          {loading ? <Loader2 size={18} className="spin" style={{ marginRight: '8px' }} /> : <LayoutTemplate size={18} style={{ marginRight: '8px' }} />}
          {loading ? 'Analyzing Data...' : 'Auto-Generate Proposal'}
        </button>
      </div>

      <div className="module-content">
        <div className="glass-panel generated-proposal">

          <div className="proposal-header">
            <div className="proposal-branding">
              <h1>{proposal.title}</h1>
              <p className="proposal-meta">Prepared for: {proposal.client} | Date: {proposal.date}</p>
            </div>
            <div className="proposal-status bg-gold">
              <Zap size={16} /> Ready for Review
            </div>
          </div>

          <div className="proposal-body">
            <section className="proposal-section">
              <h3 style={{ margin: '0 0 8px 0' }}>1. Product Details</h3>
              <div style={{ background: 'var(--color-ivory)', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-glass-border)' }}>
                <h4 style={{ margin: '0 0 6px 0', color: 'var(--color-dark-charcoal)' }}>Product: {proposal.software}</h4>
                <p style={{ margin: 0, color: 'var(--color-dark-charcoal)', lineHeight: '1.5' }}>{proposal.productDetails}</p>
              </div>
            </section>

            <section className="proposal-section pricing-table">
              <h3>2. Investment Summary</h3>
              <div className="table-row header">
                <span>Description</span>
                <span>Amount</span>
              </div>
              {proposal.pricing.map((item, idx) => (
                <div key={idx} style={{ borderBottom: '1px solid var(--color-glass-border)' }}>
                  <div className="table-row" style={{ borderBottom: 'none', paddingBottom: '4px' }}>
                    <span style={{ fontWeight: 500, color: 'var(--color-dark-charcoal)' }}>{item.description}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      ₹<span
                        contentEditable
                        suppressContentEditableWarning
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            e.target.blur();
                          }
                        }}
                        onBlur={(e) => {
                          let valStr = e.target.innerText.replace(/[^0-9.]/g, ''); // Allow decimal
                          if (valStr) {
                            const parsedValue = parseFloat(valStr);
                            if (!isNaN(parsedValue)) {
                              const newPricing = [...proposal.pricing];
                              // Store INR value directly, avoid conversion math jumps
                              newPricing[idx].amount = parsedValue;
                              const newTotal = newPricing.reduce((sum, p) => sum + p.amount, 0);
                              setProposal({ ...proposal, pricing: newPricing, totalValue: newTotal });
                            } else {
                              e.target.innerText = item.amount.toLocaleString('en-IN');
                            }
                          } else {
                            e.target.innerText = item.amount.toLocaleString('en-IN');
                          }
                        }}
                        style={{ borderBottom: '1px dashed var(--color-dark-charcoal)', outline: 'none', cursor: 'text', minWidth: '60px', textAlign: 'right', padding: '0 4px' }}
                      >
                        {item.amount.toLocaleString('en-IN')}
                      </span>
                      <Edit2 size={12} style={{ opacity: 0.5 }} />
                    </span>
                  </div>
                  {item.details && (
                    <div className="pricing-description">
                      {item.details}
                      {item.justification && (
                        <div style={{
                          marginTop: '8px',
                          padding: '8px 12px',
                          background: 'rgba(168, 142, 91, 0.05)',
                          borderLeft: '3px solid var(--color-accent)',
                          borderRadius: '0 4px 4px 0',
                          fontSize: '0.8rem',
                          color: 'var(--color-dark-charcoal)',
                          fontStyle: 'italic'
                        }}>
                          <strong style={{ fontWeight: 600, fontStyle: 'normal' }}>Cost Basis: </strong>
                          {item.justification}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              <div className="table-row total">
                <span>Total Estimated Value</span>
                <span>₹{proposal.totalValue.toLocaleString('en-IN')}</span>
              </div>
            </section>
          </div>

          <div className="proposal-actions" style={{ flexDirection: 'column', alignItems: 'flex-start', borderTop: '1px solid var(--color-glass-border)', paddingTop: '24px', marginTop: '24px' }}>
            <h3 style={{ marginBottom: 12 }}>Schedule Acceptance Meeting</h3>
            <p className="text-muted" style={{ marginBottom: 16 }}>Select a date and time to notify {proposal.client} that you accept the proposal requirements.</p>
            <div style={{ display: 'flex', gap: 12, width: '100%' }}>
              <div style={{ display: 'flex', gap: 12, flex: 1 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Calendar size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="input-field"
                    style={{ width: '100%', paddingLeft: 42, paddingRight: 16, height: '48px', borderRadius: '12px', border: '1px solid var(--color-glass-border)', background: 'var(--color-ivory)', color: 'var(--color-dark-charcoal)', fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s ease', outline: 'none' }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-glass-border)'}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(168, 142, 91, 0.15)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-glass-border)'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                </div>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Clock size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="input-field"
                    style={{ width: '100%', paddingLeft: 42, paddingRight: 16, height: '48px', borderRadius: '12px', border: '1px solid var(--color-glass-border)', background: 'var(--color-ivory)', color: 'var(--color-dark-charcoal)', fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s ease', outline: 'none' }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-glass-border)'}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(168, 142, 91, 0.15)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-glass-border)'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>
              <button
                className="btn-primary flex-center"
                onClick={async () => {
                  if (!scheduleDate || !scheduleTime) return;
                  const dateObj = new Date(`${scheduleDate}T${scheduleTime}`);
                  const formatted = dateObj.toLocaleString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

                  const newSchedule = {
                    title: "Proposal Acceptance Notification",
                    customer: proposal.client,
                    date: formatted,
                    type: "WhatsApp / Email"
                  };
                  const existing = JSON.parse(localStorage.getItem('aura_schedules') || '[]');
                  localStorage.setItem('aura_schedules', JSON.stringify([...existing, newSchedule]));

                  // Fire real email via nodemailer
                  const custEmail = customer ? customer.email : null;
                  if (custEmail) {
                    const meetLink = 'https://meet.google.com/mxb-qsra-tea';
                    const formattedTotal = `₹${proposal.totalValue.toLocaleString('en-IN')}`;
                    const subject = `Proposal Acceptance & Investment Summary: ${proposal.title}`;

                    // Build the HTML breakdown for the email
                    const itemsHtml = proposal.pricing.map(item => `
                       <div style="margin-bottom: 24px; padding: 16px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #a88e5b;">
                         <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px;">
                           <h3 style="margin: 0; color: #2b2b2b; font-size: 16px;">${item.description}</h3>
                           <strong style="color: #2b2b2b; font-size: 16px;">₹${item.amount.toLocaleString('en-IN')}</strong>
                         </div>
                         <p style="margin: 0 0 12px 0; color: #555555; font-size: 14px; line-height: 1.5;">${item.details}</p>
                         ${item.justification ? `
                           <div style="background-color: #ffffff; padding: 12px; border-radius: 6px; border: 1px solid #eaeaea;">
                             <p style="margin: 0; font-size: 13px; color: #666; line-height: 1.5;">
                               <strong style="color: #444;">Cost Basis / Summary:</strong> ${item.justification}
                             </p>
                           </div>
                         ` : ''}
                       </div>
                     `).join('');

                    const htmlBody = `
                       <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
                         
                         <h2 style="color: #2b2b2b; margin-bottom: 24px;">Hi ${customer.contact},</h2>
                         <p style="font-size: 16px; line-height: 1.6; color: #444; margin-bottom: 24px;">
                           Thank you for your interest in our proposal: <strong>"${proposal.title}"</strong>.
                         </p>
                         <p style="font-size: 16px; line-height: 1.6; color: #444; margin-bottom: 32px;">
                           Based on our discussion outlining your requirements for ${proposal.software}, we have generated an estimated total investment value of <strong>${formattedTotal}</strong>. Below is the itemized summary and the cost justifications for your review.
                         </p>

                         <h3 style="font-size: 18px; color: #2b2b2b; margin-bottom: 16px; border-bottom: 2px solid #eaeaea; padding-bottom: 8px;">Investment Breakdown</h3>
                         
                         ${itemsHtml}

                         <div style="margin-top: 32px; padding: 24px; background-color: #fdfbf7; border: 1px solid #f0e6d2; border-radius: 8px; text-align: center;">
                           <h3 style="margin: 0 0 16px 0; color: #2b2b2b; font-size: 18px;">Next Steps: Acceptance Meeting</h3>
                           <p style="margin: 0 0 16px 0; color: #555; font-size: 15px;">
                             You have scheduled the Acceptance Meeting for:<br/>
                             <strong style="color: #a88e5b; font-size: 16px;">${formatted}</strong>
                           </p>
                           <a href="${meetLink}" style="display: inline-block; padding: 12px 24px; background-color: #2b2b2b; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 15px;">Join Google Meet</a>
                         </div>
                         
                         <p style="margin-top: 32px; font-size: 14px; color: #777; line-height: 1.5;">
                           We look forward to speaking with you!<br><br>
                           Best regards,<br>
                           <strong>Your AuraCRM Sales Team</strong>
                         </p>
                       </div>
                     `;
                    const plainTextBody = `
Hi ${customer.contact},

Thank you for your interest in our proposal: "${proposal.title}".

Based on our discussion outlining your requirements for ${proposal.software}, we have generated an estimated total investment value of ${formattedTotal}.

Investment Breakdown:
${proposal.pricing.map(item => `- ${item.description}: ₹${item.amount.toLocaleString('en-IN')}`).join('\n')}

Next Steps: Acceptance Meeting
You have scheduled the Acceptance Meeting for: ${formatted}
Join Google Meet: ${meetLink}

We look forward to speaking with you!

Best regards,
Your AuraCRM Sales Team
                      `.trim();

                    addToast(`Sending proposal invite to ${custEmail}...`, "info");
                    try {
                      const res = await fetch('/api/send-email', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ to: custEmail, subject, html: htmlBody, body: plainTextBody })
                      });
                      const data = await res.json();
                      if (data.success) {
                        addToast(`Proposal meeting invite sent to ${custEmail}!`, "success");
                      } else {
                        addToast("Server failed to send proposal invite.", "error");
                      }
                    } catch (e) {
                      console.error(e);
                      addToast("Network error while sending proposal invite.", "error");
                    }
                  } else {
                    addToast(`Meeting scheduled for ${formatted}!`, "success");
                  }
                  setScheduleDate('');
                  setScheduleTime('');
                }}
                disabled={!scheduleDate || !scheduleTime}
                style={{ minWidth: 200, height: '48px', borderRadius: '12px', fontSize: '1rem', fontWeight: 600, transition: 'all 0.2s ease' }}
              >
                Schedule & Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalGenerator;
