import React from 'react';
import { 
  LayoutDashboard, Users, TrendingUp, Mail, FileText,
  Target, Smile, Lightbulb, Map, Calendar, Clock, X, LogOut, ArrowLeft, Inbox, ShoppingBag, Sparkles, Star
} from 'lucide-react';
import './Sidebar.css';

const navGroups = [
  {
    title: 'Overview',
    items: [
      { id: 'insights', label: 'Sales Insights Engine', icon: <LayoutDashboard size={20} /> },
    ]
  },
  {
    title: 'Core Modules',
    items: [
      { id: 'inbox', label: 'Client Inbox', icon: <Inbox size={20} /> },
      { id: 'account', label: 'Account Summarizer', icon: <Users size={20} /> },
      { id: 'opportunity', label: 'Opportunity Analyzer', icon: <TrendingUp size={20} /> },
      { id: 'dealHistory', label: 'Deal History', icon: <ShoppingBag size={20} /> },
      { id: 'email', label: 'Email Generator', icon: <Mail size={20} /> },
      { id: 'proposal', label: 'Proposal Generator', icon: <FileText size={20} /> },
    ]
  },
  {
    title: 'AI Intelligence',
    items: [
      { id: 'deals', label: 'Deal Predictor', icon: <Target size={20} /> },
      { id: 'emotion', label: 'Emotion Analyzer', icon: <Smile size={20} /> },
      { id: 'coach', label: 'AI Sales Coach', icon: <Lightbulb size={20} /> },
      { id: 'scheduler', label: 'Smart Scheduler', icon: <Calendar size={20} /> },
      { id: 'timeline', label: 'Relationship Timeline', icon: <Clock size={20} /> },
    ]
  }
];

const getStatusColor = (status) => {
  if (status === 'Closed Won') return { bg: 'rgba(46,204,113,0.15)', color: '#27ae60' };
  if (status === 'In Negotiation') return { bg: 'rgba(52,152,219,0.15)', color: '#2980b9' };
  if (status === 'Renewal Due') return { bg: 'rgba(243,156,18,0.15)', color: '#d68910' };
  return { bg: 'rgba(52,73,94,0.1)', color: '#52636d' };
};

const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen, onSwitchCustomer, customer }) => {
  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'show' : ''}`} onClick={() => setIsOpen(false)}></div>
      <aside className={`sidebar glass-panel ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">✨</span>
            <span className="logo-text">Aura<span className="text-accent">CRM</span></span>
          </div>
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group" style={{ marginBottom: '1rem' }}>
            <button 
              className="nav-item" 
              onClick={onSwitchCustomer}
              style={{ background: 'var(--color-ivory)', border: '1px solid var(--color-glass-border)', color: 'var(--color-dark-charcoal)', fontWeight: 600 }}
            >
              <ArrowLeft size={18} className="text-accent" />
              <span>Switch Customer</span>
            </button>
          </div>

          {navGroups.map((group, idx) => (
            <div key={idx} className="nav-group">
              <h5 className="nav-group-title">{group.title}</h5>
              <ul>
                {group.items.map((item) => (
                  <li key={item.id}>
                    <button 
                      className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsOpen(false);
                      }}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Removed static Deal History Panel to use main navigation instead */}

        <div className="sidebar-footer" style={{ flexDirection: 'column', gap: '8px' }}>
          <button 
            className={`nav-item ${activeTab === 'globalSchedules' ? 'active' : ''}`} 
            onClick={() => {
              setActiveTab('globalSchedules');
              setIsOpen(false);
            }} 
            style={{ width: '100%', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', padding: '12px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-dark-charcoal)', fontWeight: 600 }}
          >
             <Calendar size={20} className="text-accent" />
             <span>View All Schedules</span>
          </button>
          
          <a href="/" className="nav-item text-muted" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', borderRadius: '12px' }}>
            <LogOut size={20} />
            <span>Exit Dashboard</span>
          </a>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
