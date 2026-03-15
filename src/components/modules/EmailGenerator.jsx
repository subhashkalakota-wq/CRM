import React, { useState, useEffect } from 'react';
import { Mail, Edit3, Send, RefreshCw, Loader2, Calendar } from 'lucide-react';
import { useToast } from '../Toast';
import './Modules.css';

const EmailGenerator = ({ customer, voiceAction, clearVoiceAction }) => {
  const { addToast } = useToast();
  const [tone, setTone] = useState('Professional');
  const [context, setContext] = useState('Follow-up after Demo');
  const [loading, setLoading] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [emailData, setEmailData] = useState({
    to: '', subject: '', body: ''
  });

  useEffect(() => {
    if (customer) {
      setEmailData({
        to: customer.email || 'contact@client.com',
        subject: `Next Steps: ${customer.productInterest || 'AuraCRM Automation Suite'}`,
        body: `Hi ${customer.contact ? customer.contact.split(' ')[0] : 'there'},\n\nIt was great speaking with you and the team yesterday. \nFollowing up on our demo of the ${customer.productInterest || 'AuraCRM Automation Suite'}, I've outlined the specific ways our platform can streamline your current reporting pipeline—specifically addressing the pain points we discussed around manual data entry.\n\nI've attached a customized one-pager for your review. Would you be open to a brief 15-minute call early next week (perhaps Tuesday at 10 AM) to dive into the technical implementation details?\n\nLooking forward to your thoughts.\n\nBest regards,\nSales Team`
      });
    }
  }, [customer]);

  const generateEmail = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context, tone, customer })
      });
      const result = await response.json();
      if (result.success) {
        setEmailData({
          to: result.data.to,
          subject: result.data.subject,
          body: result.data.body
        });
      }
    } catch (error) {
      console.error('Error generating email:', error);
      alert('Failed to connect to AI engine.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    addToast(`Sending email to ${emailData.to} via AI Server...`, "info");
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: emailData.to, subject: emailData.subject, body: emailData.body })
      });
      const data = await res.json();
      if(data.success) {
         addToast(`Email successfully delivered to ${emailData.to}!`, "success");
      } else {
         addToast("Server failed to send email.", "error");
      }
    } catch (e) {
      console.error(e);
      addToast("Network error while sending email.", "error");
    }
  };

  useEffect(() => {
    if (voiceAction) {
      if (voiceAction.type === 'SEND_EMAIL') {
        handleSendEmail();
        if (clearVoiceAction) clearVoiceAction();
      } else if (voiceAction.type === 'CHANGE_EMAIL_TONE') {
        const validTones = ['Professional', 'Friendly', 'Urgent', 'Consultative'];
        if (validTones.includes(voiceAction.tone)) {
           setTone(voiceAction.tone);
           // We need to use a setTimeout or a separate effect to trigger generation 
           // AFTER the tone state has actually updated, otherwise it regenerates with the old tone.
           setTimeout(() => {
              // We simulate the generation to keep it simple, or actually call generateEmail
              addToast(`Regenerating email with a ${voiceAction.tone} tone...`, "info");
              // Actually trigger generation
              // To ensure it uses the fresh state, we could pass tone directly if generateEmail accepted it,
              // but since it uses the state, setTimeout here often works. 
              // A better way is using a ref or just let useEffect catch it, but let's fire generation here.
              // Wait, generateEmail reads the state. We'll trigger it.
              setContext('Follow-up after Demo'); // ensure context is set
           }, 100);
           
           // We'll create a dedicated trigger for voice generation
           setGenerateTrigger(Date.now());
        }
        if (clearVoiceAction) clearVoiceAction();
      }
    }
  }, [voiceAction]);

  const [generateTrigger, setGenerateTrigger] = useState(0);

  useEffect(() => {
    if (generateTrigger > 0) {
      generateEmail();
    }
  }, [generateTrigger]);

  return (
    <div className="module-container animate-fade-in">
      <div className="module-header">
        <div className="module-title-group">
          <div className="icon-wrapper base-bg">
            <Mail size={24} />
          </div>
          <div>
            <h2>Smart Email Generator</h2>
            <p className="text-muted">Generate highly personalized contextual follow-up emails.</p>
          </div>
        </div>
      </div>

      <div className="module-content layout-split">
        
        {/* Controls Panel */}
        <div className="glass-panel controls-panel">
          <h3 className="panel-title">Generation Settings</h3>
          
          <div className="form-group">
            <label>Context / Goal</label>
            <select 
              className="form-select" 
              value={context} 
              onChange={(e) => setContext(e.target.value)}
            >
              <option>Follow-up after Demo</option>
              <option>Proposal Check-in</option>
              <option>Cold Outreach (High Intent)</option>
              <option>Re-engage Ghosted Lead</option>
            </select>
          </div>

          <div className="form-group">
            <label>Communication Tone</label>
            <div className="tone-selector">
              {['Professional', 'Friendly', 'Urgent', 'Consultative'].map((t) => (
                <button 
                  key={t}
                  className={`tone-btn ${tone === t ? 'active' : ''}`}
                  onClick={() => setTone(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button 
            className="btn-accent w-full" 
            style={{marginTop: 'auto'}} 
            onClick={generateEmail}
            disabled={loading}
          >
            {loading ? <Loader2 size={18} className="spin" /> : <RefreshCw size={18} />} 
            {loading ? 'Generating...' : 'Generate Email'}
          </button>
        </div>

        {/* Editor Panel */}
        <div className="glass-panel editor-panel">
          <div className="editor-header">
            <div className="editor-meta">
              <span><strong>To:</strong> {emailData.to}</span>
              <span><strong>Subject:</strong> {emailData.subject}</span>
            </div>
            <button className="icon-btn" onClick={() => {
               navigator.clipboard.writeText(emailData.body);
               addToast("Email copied to clipboard", "success");
            }}><Edit3 size={18} /></button>
          </div>
          
          <textarea 
            className="editor-content editable-textarea" 
            value={emailData.body}
            onChange={(e) => setEmailData({...emailData, body: e.target.value})}
            style={{ width: '100%', minHeight: '200px', border: 'none', background: 'transparent', resize: 'vertical' }}
          />

          <div className="editor-actions" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button className="btn-primary" onClick={handleSendEmail}>
              <Send size={18} /> Send Email
            </button>
            {isScheduling ? (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'var(--color-ivory)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--color-glass-border)' }}>
                <input 
                  type="datetime-local" 
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem', color: 'var(--color-dark-charcoal)' }}
                />
                <button 
                  className="btn-accent" 
                  style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                  onClick={async () => {
                    if (!scheduleDate) {
                      addToast("Please select a date and time first.", "warning");
                      return;
                    }

                    const dateObj = new Date(scheduleDate);
                    if (dateObj <= new Date()) {
                      addToast("Please select a future date and time.", "warning");
                      return;
                    }

                    const formatted = dateObj.toLocaleString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
                    
                    addToast(`Scheduling email for ${formatted}...`, "info");
                    
                    try {
                      const res = await fetch('/api/schedule-email', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                          to: emailData.to, 
                          subject: emailData.subject, 
                          body: emailData.body,
                          sendAt: dateObj.toISOString()
                        })
                      });
                      const data = await res.json();
                      
                      if(data.success) {
                         // Add to Global Schedules State
                         const newSchedule = {
                           title: `Scheduled Email: ${emailData.subject.substring(0, 20)}...`,
                           customer: emailData.to,
                           date: formatted,
                           type: "Email Scheduled"
                         };
                         const existing = JSON.parse(localStorage.getItem('aura_schedules') || '[]');
                         localStorage.setItem('aura_schedules', JSON.stringify([...existing, newSchedule]));
                         
                         addToast(`Email successfully scheduled for ${formatted}!`, "success");
                         setIsScheduling(false);
                         setScheduleDate('');
                      } else {
                         addToast("Server failed to schedule email.", "error");
                      }
                    } catch (e) {
                      console.error(e);
                      addToast("Network error while scheduling email.", "error");
                    }
                  }}
                >
                  Confirm Schedule
                </button>
                <button 
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                  onClick={() => setIsScheduling(false)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button 
                className="btn-accent" 
                onClick={() => {
                   const tomorrow = new Date();
                   tomorrow.setDate(tomorrow.getDate() + 1);
                   tomorrow.setHours(10, 0, 0, 0);
                   
                   // Format as YYYY-MM-DDThh:mm for the input type="datetime-local"
                   const tzoffset = tomorrow.getTimezoneOffset() * 60000;
                   const localISOTime = (new Date(tomorrow - tzoffset)).toISOString().slice(0, 16);
                   
                   setScheduleDate(localISOTime);
                   setIsScheduling(true);
                }}
              >
                <Calendar size={18} /> Schedule
              </button>
            )}
            
            <span className="ai-badge" style={{ marginLeft: 'auto' }}>✨ AI Generated (Tone: {tone})</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EmailGenerator;
