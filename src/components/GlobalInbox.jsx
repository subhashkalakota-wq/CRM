import React, { useState } from 'react';
import { Inbox, Star, Clock, Reply, CornerUpRight, Trash2, MoreVertical, ArrowLeft } from 'lucide-react';
import './modules/Modules.css';

const GlobalInbox = ({ onBack }) => {
  const [selectedEmailId, setSelectedEmailId] = useState(1);
  const [filterDate, setFilterDate] = useState('');
  const [filterUrgency, setFilterUrgency] = useState('All');
  
  const mockEmails = [
    {
      id: 1,
      sender: "Priya Sharma",
      company: "TechNova India",
      subject: `Question regarding Enterprise Automation Suite implementation timeline`,
      snippet: "Hi team, we were reviewing the deployment sequence and had a quick question about phase 2...",
      date: "Today, 10:23 AM",
      dateStr: new Date().toISOString().split('T')[0], // Today's date
      urgency: 'Medium',
      body: `Hi AuraCRM Team,\n\nWe were reviewing the deployment sequence for Enterprise Automation Suite and had a quick question about phase 2.\n\nCould you clarify if the data migration from our legacy systems needs to be fully completed before we can start the user training sessions? Our engineering lead seems to think we can run them in parallel to save a week.\n\nLooking forward to your thoughts.\n\nBest regards,\nPriya Sharma\nTechNova India`,
      isStarred: true,
      isUnread: true
    },
    {
      id: 2,
      sender: "Rahul Verma",
      company: "Vertex Finance India",
      subject: "Re: Predictive Risk Analytics demo request",
      snippet: "Thanks for the swift responses. I've shared the technical documentation with our CTO...",
      date: "Yesterday",
      dateStr: new Date(new Date().getTime() - 86400000).toISOString().split('T')[0], // Yesterday
      urgency: 'Low',
      body: `Thanks for the swift responses.\n\nI've shared the technical documentation with our CTO and they are generally happy with the security architecture. They did ask if you had a SOC2 compliance report available that we could review before finalizing the procurement process?\n\nThanks,\nRahul Verma`,
      isStarred: false,
      isUnread: false
    },
    {
      id: 3,
      sender: "Dr. Anaya Desai",
      company: "Aarohi Health Network",
      subject: "HIPAA Compliant Cloud Storage - Vendor Onboarding",
      snippet: "Please find attached the required vendor onboarding documents needed by our finance team...",
      date: "Oct 12",
      dateStr: "2026-10-12",
      urgency: 'Medium',
      body: `Hello,\n\nPlease find attached the required vendor onboarding documents needed by our finance team to officially add AuraCRM to our procurement system.\n\nPlease fill these out and return them at your earliest convenience so we don't encounter any delays once the final contract is signed.\n\nRegards,\nDr. Anaya Desai\nAarohi Health Network`,
      isStarred: false,
      isUnread: false
    },
    {
      id: 4,
      sender: "Siddharth Rao",
      company: "Veda Robotics",
      subject: "Real-Time Sensor Processing Edge Network APIs?",
      snippet: "Can we get access to the sandbox API environment this week? Our devs want to test latency...",
      date: "Oct 11",
      dateStr: "2026-10-11",
      urgency: 'High',
      body: `Hey there,\n\nCan we get access to the sandbox API environment this week? Our devs want to test the latency for the Real-Time Sensor Processing Edge Network before we commit to the annual plan.\n\nLet me know what you need from us.\n\nCheers,\nSiddharth`,
      isStarred: true,
      isUnread: true
    }
  ];

  const filteredEmails = mockEmails.filter(email => {
    const dateMatch = !filterDate || email.dateStr === filterDate;
    const urgencyMatch = filterUrgency === 'All' || email.urgency.toLowerCase() === filterUrgency.toLowerCase();
    return dateMatch && urgencyMatch;
  });

  const selectedEmail = filteredEmails.find(email => email.id === selectedEmailId) || filteredEmails[0] || mockEmails[0];

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'High': return { bg: '#fee2e2', text: '#ef4444', border: '#fca5a5' };
      case 'Medium': return { bg: '#fef3c7', text: '#f59e0b', border: '#fcd34d' };
      case 'Low': return { bg: '#dcfce7', text: '#22c55e', border: '#86efac' };
      default: return { bg: '#f1f5f9', text: '#64748b', border: '#cbd5e1' };
    }
  };

  return (
    <div className="lobby-container bg-ivory animate-fade-in" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ padding: '2rem 2rem 1rem 2rem', borderBottom: '1px solid var(--color-glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={onBack}
            style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              padding: '10px', borderRadius: '50%', background: 'var(--color-glass-bg)', 
              color: 'var(--color-dark-charcoal)', border: '1px solid var(--color-glass-border)', 
              cursor: 'pointer', boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s'
            }}
            title="Back to Lobby"
          >
            <ArrowLeft size={20} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="icon-wrapper base-bg" style={{ background: 'rgba(52, 152, 219, 0.15)', color: '#3498db' }}>
              <Inbox size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.6rem', margin: 0, color: 'var(--color-dark-charcoal)' }}>Global Inbox</h1>
              <p className="text-muted" style={{ margin: 0, fontSize: '0.95rem' }}>View all recent incoming emails from all prospects and clients.</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '2rem', display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
        <div className="max-w-6xl w-full split-container glass-panel" style={{ height: 'calc(100vh - 180px)', padding: 0 }}>
          
          {/* Email List Pane (Left) */}
          <div className="customer-list-pane" style={{ width: '380px', borderRight: '1px solid var(--color-glass-border)', display: 'flex', flexDirection: 'column' }}>
            <div className="pane-header" style={{ paddingBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>All Messages <span className="ai-badge" style={{ marginLeft: 8 }}>{filteredEmails.length}</span></h3>
              </div>
              
              {/* Filters */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(255,255,255,0.5)', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-glass-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label htmlFor="dateFilter" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-dark-charcoal)', minWidth: '60px' }}>Date:</label>
                  <input 
                    type="date" 
                    id="dateFilter"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    style={{ 
                      border: '1px solid #ccc', borderRadius: '4px', padding: '4px 8px', 
                      fontSize: '0.85rem', flex: 1, outline: 'none', background: 'white'
                    }}
                  />
                  {filterDate && (
                    <button onClick={() => setFilterDate('')} style={{ background: 'none', border: 'none', color: 'var(--color-accent)', fontSize: '0.8rem', cursor: 'pointer', padding: '0 4px', fontWeight: 600 }}>Clear</button>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label htmlFor="urgencyFilter" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-dark-charcoal)', minWidth: '60px' }}>Urgency:</label>
                  <select
                    id="urgencyFilter"
                    value={filterUrgency}
                    onChange={(e) => setFilterUrgency(e.target.value)}
                    style={{ 
                      border: '1px solid #ccc', borderRadius: '4px', padding: '4px 8px', 
                      fontSize: '0.85rem', flex: 1, outline: 'none', background: 'white', cursor: 'pointer'
                    }}
                  >
                    <option value="All">All Urgencies</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="customer-list" style={{ overflowY: 'auto', flex: 1 }}>
              {filteredEmails.length === 0 && (
                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  No messages found for this date.
                </div>
              )}
              {filteredEmails.map(email => {
                const urgencyTheme = getUrgencyColor(email.urgency);
                return (
                  <div 
                    key={email.id} 
                    className={`customer-item ${selectedEmailId === email.id ? 'active' : ''}`}
                    onClick={() => setSelectedEmailId(email.id)}
                    style={{ display: 'block', padding: '16px 20px', borderBottom: '1px solid var(--color-glass-border)' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                      <span style={{ fontWeight: email.isUnread ? 700 : 500, color: 'var(--color-dark-charcoal)' }}>
                        {email.sender}
                      </span>
                    <span style={{ fontSize: '0.8rem', color: email.isUnread ? 'var(--color-accent)' : 'var(--text-muted)' }}>
                      {email.date}
                    </span>
                  </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-accent)', fontWeight: 600, marginBottom: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{email.company}</span>
                      {email.urgency && (
                        <span style={{ 
                          fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px',
                          background: urgencyTheme.bg, color: urgencyTheme.text, border: `1px solid ${urgencyTheme.border}`,
                          padding: '2px 6px', borderRadius: '4px' 
                        }}>
                          {email.urgency}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: email.isUnread ? 600 : 500, color: 'var(--color-dark-charcoal)', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {email.subject}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {email.snippet}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Email View Pane (Right) */}
          <div className="customer-details-pane" style={{ background: 'rgba(255, 255, 255, 0.4)', display: 'flex', flexDirection: 'column' }}>
            <div className="pane-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 32px' }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="icon-btn" title="Reply"><Reply size={18} /></button>
                <button className="icon-btn" title="Forward"><CornerUpRight size={18} /></button>
                <button className="icon-btn" title="Delete"><Trash2 size={18} /></button>
              </div>
              <div>
                <button className="icon-btn"><MoreVertical size={18} /></button>
              </div>
            </div>
            
            <div style={{ padding: '32px', overflowY: 'auto', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                <div>
                  <h1 style={{ fontSize: '1.6rem', marginBottom: 16, color: 'var(--color-dark-charcoal)' }}>{selectedEmail.subject}</h1>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                      {selectedEmail.sender.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--color-dark-charcoal)' }}>
                        {selectedEmail.sender} <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.9rem' }}>({selectedEmail.company}) &lt;{selectedEmail.sender.split(' ')[0].toLowerCase()}@{selectedEmail.company.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}.com&gt;</span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>To: me</div>
                    </div>
                  </div>
                  
                  {selectedEmail.urgency && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.03)', padding: '6px 12px', borderRadius: '16px', border: '1px solid var(--color-glass-border)' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Urgency:</span>
                      <span style={{ 
                        fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px',
                        background: getUrgencyColor(selectedEmail.urgency).bg, 
                        color: getUrgencyColor(selectedEmail.urgency).text, 
                        border: `1px solid ${getUrgencyColor(selectedEmail.urgency).border}`,
                        padding: '2px 8px', borderRadius: '12px' 
                      }}>
                        {selectedEmail.urgency}
                      </span>
                    </div>
                  )}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  {selectedEmail.date}
                  <Star size={18} style={{ color: selectedEmail.isStarred ? '#f1c40f' : 'var(--text-muted)', fill: selectedEmail.isStarred ? '#f1c40f' : 'none', cursor: 'pointer' }} />
                </div>
              </div>

              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: '#333', fontSize: '1.05rem', maxWidth: '800px' }}>
                {selectedEmail.body}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GlobalInbox;
