import React, { useState, useEffect } from 'react';
import { Inbox, Star, Clock, Reply, CornerUpRight, Trash2, MoreVertical, Sparkles } from 'lucide-react';
import { useToast } from '../Toast';
import './Modules.css';

const InboxViewer = ({ customer }) => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedInboxId, setSelectedInboxId] = useState(1);
  const [selectedSentId, setSelectedSentId] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  const [persistentSentEmails, setPersistentSentEmails] = useState([]);

  useEffect(() => {
    if (customer && customer.email) {
      fetchSentEmails();
    }
  }, [customer, activeTab]); // Re-fetch on tab switch to see new sent emails

  const fetchSentEmails = async () => {
    try {
      const res = await fetch(`/api/sent-emails?customerEmail=${encodeURIComponent(customer.email)}`);
      const result = await res.json();
      if (result.success) {
        setPersistentSentEmails(result.data);
      }
    } catch (err) {
      console.error("Failed to fetch sent emails:", err);
    }
  };

  // Generate contextually relevant mock emails
  const clientName = customer ? customer.name : 'Unknown Client';
  const contactName = customer ? customer.contact : 'Valued Customer';
  const product = customer ? customer.software : 'Our Product';
  
  const mockEmails = [
    {
      id: 1,
      sender: contactName,
      company: clientName,
      subject: `Question regarding ${product} implementation timeline`,
      snippet: "Hi team, we were reviewing the deployment sequence and had a quick question about phase 2...",
      date: "Today, 10:23 AM",
      body: `Hi AuraCRM Team,\n\nWe were reviewing the deployment sequence for ${product} and had a quick question about phase 2.\n\nCould you clarify if the data migration from our legacy systems needs to be fully completed before we can start the user training sessions? Our engineering lead seems to think we can run them in parallel to save a week.\n\nLooking forward to your thoughts.\n\nBest regards,\n${contactName}\n${clientName}`,
      isStarred: true,
      isUnread: true
    },
    {
      id: 2,
      sender: contactName,
      company: clientName,
      subject: "Re: Following up on our last discussion",
      snippet: "Thanks for the swift responses. I've shared the technical documentation with our CTO...",
      date: "Yesterday",
      body: `Thanks for the swift responses.\n\nI've shared the technical documentation with our CTO and they are generally happy with the security architecture. They did ask if you had a SOC2 compliance report available that we could review before finalizing the procurement process?\n\nThanks,\n${contactName}`,
      isStarred: false,
      isUnread: false
    },
    {
      id: 3,
      sender: "Billing Department",
      company: clientName,
      subject: "Vendor Onboarding Forms",
      snippet: "Please find attached the required vendor onboarding documents needed by our finance team...",
      date: "Oct 12",
      body: `Hello,\n\nPlease find attached the required vendor onboarding documents needed by our finance team to officially add AuraCRM to our procurement system.\n\nPlease fill these out and return them at your earliest convenience so we don't encounter any delays once the final contract is signed.\n\nRegards,\nAccounts Payable\n${clientName}`,
      isStarred: false,
      isUnread: false
    }
  ];

  const mockSentEmails = [
    {
      id: 1,
      sender: "AuraCRM Team",
      recipient: clientName,
      subject: `Scheduled Follow-up: Next Steps for ${product}`,
      snippet: "Hi there, I wanted to follow up on our demo yesterday and share the tailored implementation plan...",
      date: "Scheduled for Tomorrow, 9:00 AM",
      body: `Hi ${contactName},\n\nI wanted to follow up on our demo yesterday and share the tailored implementation plan we discussed for ${product}.\n\nAs promised, our team has mapped out the exact timeline required for your specific use cases. Please take a look when you have a moment, and let me know if you have any questions.\n\nBest,\nYour AuraCRM Rep`,
      isStarred: true,
      isUnread: false
    },
    {
      id: 2,
      sender: "AuraCRM Team",
      recipient: clientName,
      subject: `Meeting Invite: Quarterly Sync - ${clientName}`,
      snippet: "Invitation: Quarterly Strategy Sync @ Tue Oct 24, 2026...",
      date: "Last Tuesday",
      body: `Hi ${contactName},\n\nThis is a calendar invitation for our upcoming Quarterly Strategy Sync.\n\nWe will be reviewing your usage metrics over the last 90 days, discussing ROI, and introducing upcoming features that are highly relevant to your workflow.\n\nLooking forward to speaking soon.\n\nBest,\nYour AuraCRM Rep`,
      isStarred: false,
      isUnread: false
    }
  ];

  const isNewCustomer = customer && (customer.customerType === 'new');
  
  // Combine mock sent emails with real persistent ones
  const allSentMessages = [...persistentSentEmails, ...(isNewCustomer ? [] : mockSentEmails)];

  // Auto-select first sent email if none selected
  useEffect(() => {
    if (activeTab === 'sent' && !selectedSentId && allSentMessages.length > 0) {
      setSelectedSentId(allSentMessages[0].id);
    }
  }, [activeTab, allSentMessages, selectedSentId]);
  
  const currentList = activeTab === 'inbox' 
    ? (isNewCustomer ? [] : mockEmails) 
    : allSentMessages;

  const selectedEmail = (currentList.length === 0) 
    ? null
    : (activeTab === 'inbox' 
        ? mockEmails.find(email => email.id === selectedInboxId) || mockEmails[0]
        : allSentMessages.find(email => email.id === selectedSentId) || allSentMessages[0]);

  const handleAnalyzeEmail = async () => {
    setIsAnalyzing(true);
    setAnalysisResult('');
    try {
      const res = await fetch('http://localhost:5000/api/analyze-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailBody: selectedEmail.body })
      });
      const data = await res.json();
      if (data.success) {
        setAnalysisResult(data.analysis);
      } else {
        setAnalysisResult("An error occurred during analysis.");
      }
    } catch (err) {
      console.error(err);
      setAnalysisResult("Failed to connect to the analysis engine.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="module-container animate-fade-in" style={{ height: 'calc(100vh - 120px)' }}>
      <div className="module-header">
        <div className="module-title-group">
          <div className="icon-wrapper base-bg" style={{ background: 'rgba(52, 152, 219, 0.15)', color: '#3498db' }}>
            <Inbox size={24} />
          </div>
          <div>
            <h2>Client Inbox</h2>
            <p className="text-muted">Direct communications received from {clientName}.</p>
          </div>
        </div>
      </div>

      <div className="module-content" style={{ flex: 1, overflow: 'hidden' }}>
        <div className="split-container glass-panel" style={{ height: '100%', padding: 0 }}>
          
          {/* Email List Pane (Left) */}
          <div className="customer-list-pane" style={{ width: '350px', borderRight: '1px solid var(--color-glass-border)', display: 'flex', flexDirection: 'column' }}>
            <div className="pane-header" style={{ paddingBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Messages</h3>
              </div>
              
              {/* Tab Toggle */}
              <div style={{ display: 'flex', background: 'rgba(0,0,0,0.05)', borderRadius: '8px', padding: '4px' }}>
                <button 
                  className={`tab-btn ${activeTab === 'inbox' ? 'active' : ''}`}
                  onClick={() => setActiveTab('inbox')}
                  style={{ flex: 1, padding: '6px 12px', border: 'none', background: activeTab === 'inbox' ? 'white' : 'transparent', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, color: activeTab === 'inbox' ? 'var(--color-dark-charcoal)' : 'var(--text-muted)', cursor: 'pointer', boxShadow: activeTab === 'inbox' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s' }}
                >
                  Inbox <span className="ai-badge" style={{ marginLeft: 6, opacity: activeTab === 'inbox' ? 1 : 0.6 }}>{isNewCustomer ? 0 : 3}</span>
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'sent' ? 'active' : ''}`}
                  onClick={() => setActiveTab('sent')}
                  style={{ flex: 1, padding: '6px 12px', border: 'none', background: activeTab === 'sent' ? 'white' : 'transparent', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, color: activeTab === 'sent' ? 'var(--color-dark-charcoal)' : 'var(--text-muted)', cursor: 'pointer', boxShadow: activeTab === 'sent' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s' }}
                >
                  Sent
                </button>
              </div>
            </div>
            
            <div className="customer-list" style={{ overflowY: 'auto', flex: 1 }}>
              {currentList.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Inbox size={32} style={{ opacity: 0.2, marginBottom: '12px' }} />
                  <p style={{ fontSize: '0.9rem' }}>No messages found.</p>
                </div>
              ) : (
                currentList.map(email => (
                  <div 
                    key={email.id} 
                    className={`customer-item ${(activeTab === 'inbox' ? selectedInboxId : selectedSentId) === email.id ? 'active' : ''}`}
                    onClick={() => {
                      activeTab === 'inbox' ? setSelectedInboxId(email.id) : setSelectedSentId(email.id);
                      setAnalysisResult(''); // Clear previous analysis
                    }}
                    style={{ display: 'block', padding: '16px 20px' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                      <span style={{ fontWeight: email.isUnread ? 700 : 500, color: 'var(--color-dark-charcoal)' }}>
                        {activeTab === 'inbox' ? email.sender : "To: " + (email.recipient || email.to)}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: email.isUnread ? 'var(--color-accent)' : 'var(--text-muted)' }}>
                        {email.date}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: email.isUnread ? 600 : 500, color: 'var(--color-dark-charcoal)', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {email.subject}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {email.snippet || email.body.substring(0, 100) + "..."}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Email View Pane (Right) */}
          <div className="customer-details-pane" style={{ background: 'rgba(255, 255, 255, 0.4)', display: 'flex', flexDirection: 'column' }}>
            {!selectedEmail ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', opacity: 0.5 }}>
                <Inbox size={64} strokeWidth={1} style={{ marginBottom: '20px' }} />
                <h3 style={{ margin: 0 }}>Select a message to read</h3>
              </div>
            ) : (
              <>
                <div className="pane-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 32px' }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button className="icon-btn" title="Reply" onClick={() => addToast("Reply draft started", "info")}><Reply size={18} /></button>
                    <button className="icon-btn" title="Forward" onClick={() => addToast("Message readied for forwarding", "info")}><CornerUpRight size={18} /></button>
                    <button className="icon-btn" title="Delete" onClick={() => addToast("Message moved to trash", "success")}><Trash2 size={18} /></button>
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <button 
                      className="btn btn-primary"
                      onClick={handleAnalyzeEmail}
                      disabled={isAnalyzing}
                      style={{ 
                        padding: '8px 16px', borderRadius: '20px', fontSize: '0.85rem',
                        background: 'var(--color-glass-surface)', color: 'var(--color-dark-charcoal)',
                        border: '1px solid var(--color-glass-border)', display: 'flex', alignItems: 'center', gap: '6px',
                        opacity: isAnalyzing ? 0.7 : 1, transition: 'all 0.2s', cursor: isAnalyzing ? 'not-allowed' : 'pointer'
                      }}
                      onMouseEnter={(e) => { if(!isAnalyzing) e.currentTarget.style.background = 'rgba(255,255,255,0.8)'; }}
                      onMouseLeave={(e) => { if(!isAnalyzing) e.currentTarget.style.background = 'var(--color-glass-surface)'; }}
                    >
                      <Sparkles size={16} className={isAnalyzing ? 'animate-spin' : 'text-accent'} />
                      {isAnalyzing ? 'Analyzing...' : 'Analyse'}
                    </button>
                    <button className="icon-btn" title="More Options" onClick={() => addToast("More options menu opened", "info")}><MoreVertical size={18} /></button>
                  </div>
                </div>
                
                <div style={{ padding: '32px', overflowY: 'auto', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                    <div>
                      <h1 style={{ fontSize: '1.6rem', marginBottom: 16, color: 'var(--color-dark-charcoal)' }}>{selectedEmail.subject}</h1>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: activeTab === 'inbox' ? 'var(--color-accent)' : '#2ecc71', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                          {activeTab === 'inbox' ? selectedEmail.sender.charAt(0) : "A"}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--color-dark-charcoal)' }}>
                            {activeTab === 'inbox' ? (
                              <>
                                {selectedEmail.sender} <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.9rem' }}>&lt;{selectedEmail.sender.split(' ')[0].toLowerCase()}@{selectedEmail.company.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}.com&gt;</span>
                              </>
                            ) : (
                              <>
                                {selectedEmail.sender || "AuraCRM Team"} <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.9rem' }}>&lt;salesforces.crmai@gmail.com&gt;</span>
                              </>
                            )}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {activeTab === 'inbox' ? "To: me" : `To: ${selectedEmail.recipient || selectedEmail.to}`}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      {selectedEmail.date}
                      <Star size={18} style={{ color: selectedEmail.isStarred ? '#f1c40f' : 'var(--text-muted)', fill: selectedEmail.isStarred ? '#f1c40f' : 'none', cursor: 'pointer' }} />
                    </div>
                  </div>
    
                  <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: '#333', fontSize: '1.05rem', maxWidth: '800px' }}>
                    {selectedEmail.body}
                  </div>
    
                  {/* AI Analysis Result Card */}
                  {analysisResult && (
                    <div className="animate-fade-in" style={{ marginTop: '32px', padding: '24px', background: 'rgba(255, 234, 167, 0.15)', border: '1px solid rgba(253, 203, 110, 0.3)', borderRadius: '12px', borderLeft: '4px solid var(--color-accent)', maxWidth: '800px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--color-accent)', fontWeight: 600 }}>
                        <Sparkles size={18} />
                        <span>AI Analysis</span>
                      </div>
                      <div style={{ color: 'var(--color-dark-charcoal)', fontSize: '0.95rem', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                        {analysisResult}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default InboxViewer;
