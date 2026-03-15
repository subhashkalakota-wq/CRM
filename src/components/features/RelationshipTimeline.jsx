import React from 'react';
import { Clock, Mail, Phone, Video, FileText } from 'lucide-react';
import './Features.css';

const RelationshipTimeline = () => {
  const events = [
    { date: 'Today, 10:00 AM', type: 'email', title: 'Proposal Sent', desc: 'Sent final enterprise pricing tier.', icon: <FileText size={16}/>, highlight: true },
    { date: 'Nov 12, 2:30 PM', type: 'video', title: 'Technical Deep Dive', desc: 'Demoed CRM integration capabilities with their engineering lead.', icon: <Video size={16}/> },
    { date: 'Nov 10, 9:15 AM', type: 'email', title: 'Follow-up Email', desc: 'Answered security compliance questions.', icon: <Mail size={16}/> },
    { date: 'Nov 05, 1:00 PM', type: 'phone', title: 'Discovery Call', desc: 'Initial qualification. Uncovered pain points around reporting.', icon: <Phone size={16}/> },
  ];

  return (
    <div className="module-container animate-fade-in">
      <div className="module-header">
        <div className="module-title-group">
          <div className="icon-wrapper base-bg">
            <Clock size={24} />
          </div>
          <div>
            <h2>Relationship Timeline</h2>
            <p className="text-muted">Chronological history of all touchpoints with this account.</p>
          </div>
        </div>
      </div>

      <div className="module-content">
        <div className="glass-panel timeline-card">
          <div className="timeline-container">
            {events.map((evt, idx) => (
              <div key={idx} className={`timeline-row ${evt.highlight ? 'highlight' : ''}`}>
                <div className="timeline-date-col">{evt.date}</div>
                <div className="timeline-line-col">
                  <div className={`timeline-node ${evt.type}`}>{evt.icon}</div>
                  {idx !== events.length - 1 && <div className="timeline-connector"></div>}
                </div>
                <div className="timeline-content-col">
                  <h4>{evt.title}</h4>
                  <p>{evt.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelationshipTimeline;
