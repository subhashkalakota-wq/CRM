import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, Trash2 } from 'lucide-react';
import './Modules.css';

const GlobalSchedules = () => {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('aura_schedules') || '[]');
    setSchedules(stored);
  }, []);

  const handleDelete = (indexToDelete) => {
    const updated = schedules.filter((_, idx) => idx !== indexToDelete);
    setSchedules(updated);
    localStorage.setItem('aura_schedules', JSON.stringify(updated));
  };

  return (
    <div className="module-container animate-fade-in">
      <div className="module-header">
        <div className="module-title-group">
          <div className="icon-wrapper base-bg">
            <Calendar size={24} />
          </div>
          <div>
            <h2>All Scheduled Events</h2>
            <p className="text-muted">A global view of all upcoming meetings, emails, and follow-ups across all accounts.</p>
          </div>
        </div>
      </div>

      <div className="module-content">
        {schedules.length === 0 ? (
          <div className="glass-panel flex-center" style={{ height: 200, flexDirection: 'column', color: 'var(--text-muted)' }}>
            <Calendar size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
            <p>No schedules found.</p>
            <p style={{ fontSize: '0.85rem' }}>Schedule an event from the Opportunity Analyzer or Proposal Generator.</p>
          </div>
        ) : (
          <div className="interaction-timeline glass-panel" style={{ padding: 24 }}>
            {schedules.map((schedule, idx) => (
              <div className="timeline-item" key={idx} style={{ paddingBottom: 24 }}>
                <span className="timeline-date" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 600, color: 'var(--color-dark-charcoal)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock size={16} className="text-accent" /> {schedule.date}
                  </span>
                  <button 
                    onClick={() => handleDelete(idx)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--color-dark-charcoal)', opacity: 0.5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                    title="Delete Schedule"
                  >
                    <Trash2 size={16} />
                  </button>
                </span>
                <div style={{ marginLeft: 30, background: 'var(--color-ivory)', padding: 16, borderRadius: 8, border: '1px solid var(--color-glass-border)', marginTop: 8 }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem' }}>{schedule.title}</h4>
                  <p className="text-muted" style={{ margin: '0 0 12px 0', fontSize: '0.9rem' }}>Customer: {schedule.customer || 'Global'}</p>
                  <div style={{ display: 'flex', gap: 12, fontSize: '0.85rem' }}>
                    <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><CheckCircle size={14} /> Confirmed</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)' }}><MapPin size={14} /> {schedule.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalSchedules;
