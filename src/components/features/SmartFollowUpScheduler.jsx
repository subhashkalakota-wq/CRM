import React, { useState } from 'react';
import { Calendar, Clock, ArrowRightCircle } from 'lucide-react';
import { useToast } from '../Toast';
import '../modules/Modules.css';

const SmartFollowUpScheduler = ({ customer }) => {
  const { addToast } = useToast();
  const [selectedDate, setSelectedDate] = useState('2023-10-24T09:30');

  return (
    <div className="module-container animate-fade-in">
      <div className="module-header">
        <div className="module-title-group">
          <div className="icon-wrapper base-bg">
            <Calendar size={24} />
          </div>
          <div>
            <h2>Smart Follow-Up Scheduler</h2>
            <p className="text-muted">AI-suggested optimal contact times based on recipient behavior patterns.</p>
          </div>
        </div>
      </div>

      <div className="module-content flex-center" style={{ padding: '24px 0' }}>
        <div className="glass-panel schedule-card" style={{ width: '100%', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h3>Schedule Meeting with: {customer ? `${customer.contact} (${customer.role})` : 'Select a Customer'}</h3>
          <p className="text-muted subtext" style={{ marginBottom: 24 }}>Select a date and time to instantly dispatch a Google Meet calendar invitation.</p>

          <div style={{ padding: '24px', background: 'var(--color-ivory)', borderRadius: '12px', border: '1px solid var(--color-glass-border)' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-dark-charcoal)', textAlign: 'left' }}>
              <Calendar size={16} style={{ display: 'inline', marginRight: 6, verticalAlign: 'text-bottom' }} />
              Meeting Date & Time
            </label>
            <input
              type="datetime-local"
              className="form-select"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ width: '100%', marginBottom: '24px', padding: '12px' }}
            />
            <button
              className="btn-accent w-full"
              style={{ padding: '14px', fontSize: '1.05rem' }}
              onClick={async () => {
                const dateObj = new Date(selectedDate);
                const formatted = dateObj.toLocaleString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

                // Add to Global Schedules State
                const newSchedule = {
                  title: "Video Meeting (Google Meet)",
                  customer: customer ? customer.name : 'Unknown',
                  date: formatted,
                  type: "Email Sent"
                };
                const existing = JSON.parse(localStorage.getItem('aura_schedules') || '[]');
                localStorage.setItem('aura_schedules', JSON.stringify([...existing, newSchedule]));

                // Fire NodeMailer API Call
                const custEmail = customer ? customer.email : 'demo@example.com';
                const custName = customer ? customer.contact : 'Customer';
                const meetLink = 'https://meet.google.com/mxb-qsra-tea';
                const subject = `Meeting Invitation: ${formatted}`;
                const body = `Hi ${custName},\n\nI have scheduled a video meeting for us on ${formatted}.\n\nPlease join using this link at the agreed time:\n${meetLink}\n\nLooking forward to speaking with you!\n\nBest,\nYour Sales Team`;

                addToast(`Dispatching invitation to ${custEmail}...`, "info");

                try {
                  const res = await fetch('/api/send-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ to: custEmail, subject, body })
                  });
                  const data = await res.json();
                  if (data.success) {
                    addToast(`Calendar invite delivered to ${custEmail}!`, "success");
                  } else {
                    addToast("Server failed to send invitation.", "error");
                  }
                } catch (e) {
                  console.error(e);
                  addToast("Network error while sending schedule.", "error");
                }
              }}
            >
              Confirm Schedule & Send Invite
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartFollowUpScheduler;
