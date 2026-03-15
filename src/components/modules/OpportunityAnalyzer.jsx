import React from 'react';
import { Target, TrendingUp, AlertTriangle, ArrowRightCircle } from 'lucide-react';
import { useToast } from '../Toast';
import './Modules.css';

const OpportunityAnalyzer = ({ customer }) => {
  const { addToast } = useToast();

  return (
    <div className="module-container animate-fade-in">
      <div className="module-header">
        <div className="module-title-group">
          <div className="icon-wrapper base-bg">
            <TrendingUp size={24} />
          </div>
          <div>
            <h2>Opportunity Analyzer</h2>
            <p className="text-muted">AI analysis of current sales opportunities and next best actions.</p>
          </div>
        </div>
      </div>

      <div className="module-content">
        <div className="analysis-board">
          
          <div className="glass-panel analysis-card highlight-card">
            <div className="card-header">
              <h3 className="card-title">Deal Profile: {customer ? customer.productInterest : 'Cloud Migration Project'}</h3>
              <span className="badge badge-success">High Probability ({customer ? 70 + (customer.id*2) : 85}%)</span>
            </div>
            <div className="metrics-row">
              <div className="metric">
                <span className="metric-label">Estimated Value</span>
                <span className="metric-value">₹{customer ? customer.id * 15 + 50 : 125},000</span>
              </div>
              <div className="metric">
                <span className="metric-label">Target Close Date</span>
                <span className="metric-value">Nov {customer ? (customer.id % 28) + 1 : 30}, 2026</span>
              </div>
              <div className="metric">
                <span className="metric-label">Stage</span>
                <span className="metric-value">{customer && customer.status === 'Active' ? 'Negotiation' : 'Proposal Sent'}</span>
              </div>
            </div>
          </div>

          <div className="module-grid">
            <div className="glass-panel action-card info-card">
              <div className="card-header">
                <h3 className="card-title"><Target size={20} className="text-accent" /> Next Best Action</h3>
              </div>
              <div className="action-content">
                <div className="action-icon">
                  <ArrowRightCircle size={32} className="text-accent" />
                </div>
                <div className="action-details" style={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1, gap: '8px' }}>
                  <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Schedule Technical Deep-Dive</h4>
                  <h5 style={{ margin: 0, color: 'var(--color-dark-charcoal)', fontSize: '0.95rem', fontWeight: 600 }}>Risk: Extended Decision Cycle</h5>
                  <p style={{ margin: 0, flex: 1, fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {customer ? customer.name : 'TechFlow Enterprise'} projects usually require 3-6 months. Keep momentum.
                  </p>
                  <button 
                    className="btn-primary" 
                    style={{ marginTop: '12px', padding: '8px 16px', alignSelf: 'flex-start' }}
                    onClick={() => {
                      const newSchedule = {
                        title: "Technical Deep-Dive",
                        customer: customer ? customer.name : "TechFlow Enterprise",
                        date: new Date(Date.now() + 86400000 * 2).toLocaleString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
                        type: "Video Call"
                      };
                      const existing = JSON.parse(localStorage.getItem('aura_schedules') || '[]');
                      localStorage.setItem('aura_schedules', JSON.stringify([...existing, newSchedule]));
                      addToast("Meeting scheduled correctly. Added to Global Schedules.", "success");
                    }}
                  >
                    Schedule Now
                  </button>
                </div>
              </div>
            </div>

            <div className="glass-panel risk-card info-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="card-header">
                <h3 className="card-title"><AlertTriangle size={20} style={{color: '#FF5F56'}} /> Identified Risks</h3>
              </div>
              <ul className="risk-list" style={{ flex: 1, margin: 0, paddingRight: '12px' }}>
                <li style={{ marginBottom: '12px', lineHeight: 1.5 }}>
                  <strong style={{ color: 'var(--color-dark-charcoal)' }}>Budget Approval:</strong> Decision-maker (CFO) hasn't engaged in the last 2 weeks.
                </li>
                <li style={{ marginBottom: '0', lineHeight: 1.5 }}>
                  <strong style={{ color: 'var(--color-dark-charcoal)' }}>Competitor Threat:</strong> Mentioned exploring alternative solutions during the last call.
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OpportunityAnalyzer;
