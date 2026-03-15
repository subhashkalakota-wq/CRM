import React, { useState, useEffect } from 'react';
import { Users, FileText, CheckCircle, MessageSquare, Loader2, ChevronRight, RefreshCw, Video, Maximize2, Minimize2, X } from 'lucide-react';
import { useToast } from '../Toast';
import './Modules.css';

const AccountSummarizer = ({ customer }) => {
  const { addToast } = useToast();

  // State for selected customer details
  const [customerDetails, setCustomerDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [productPreviewHtml, setProductPreviewHtml] = useState('');
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [isAnalysisFullScreen, setIsAnalysisFullScreen] = useState(false);

  // Fetch details for the passed customer
  useEffect(() => {
    if (customer && customer.id) {
      fetchCustomerDetails(customer.id);
    }
  }, [customer]);

  const fetchCustomerDetails = async (id) => {
    setLoadingDetails(true);
    setCustomerDetails(null);
    try {
      const res = await fetch(`/api/customers/${id}`);
      const data = await res.json();
      if (data.success) {
        setCustomerDetails(data.data);
      }
    } catch (err) {
      console.error(err);
      addToast("Failed to fetch customer details", "error");
    } finally {
      setLoadingDetails(false);
    }
  };

  const fetchProductPreview = async (productInterest) => {
    setLoadingPreview(true);
    setProductPreviewHtml('');
    try {
      const res = await fetch(`/api/product-preview?product=${encodeURIComponent(productInterest)}`);
      const data = await res.json();
      if (data.success) {
        setProductPreviewHtml(data.html);
      }
    } catch (err) {
      console.error(err);
      addToast("Failed to fetch product preview", "error");
    } finally {
      setLoadingPreview(false);
    }
  };

  useEffect(() => {
    if (customerDetails && customerDetails.productInterest) {
      fetchProductPreview(customerDetails.productInterest);
    }
  }, [customerDetails]);

  const regenerateSummary = () => {
    if (customer && customer.id) {
      addToast("Regenerating summary...", "info");
      fetchCustomerDetails(customer.id);
    }
  };

  if (!customer) {
    return (
      <div className="module-container flex-center">
        <p className="text-muted">No customer selected.</p>
      </div>
    );
  }

  return (
    <div className="module-container animate-fade-in">
      
      <div className="customer-details-pane" style={{width: '100%', maxWidth: '1000px', margin: '0 auto'}}>
        <div className="module-header" style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="module-title-group" style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div className="icon-wrapper base-bg" style={{ marginTop: 4 }}>
                <FileText size={24} />
              </div>
              <div>
                <h2>{customerDetails ? customerDetails.name : 'Account Summarizer'}</h2>
              {!customerDetails && (
                <p className="text-muted" style={{ marginBottom: 4 }}>
                  AI-generated summary of customer history and interactions.
                </p>
              )}
              {customerDetails && (
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, max-content) minmax(200px, max-content)', gap: '8px 24px', marginTop: '12px', fontSize: '0.9rem', color: 'var(--color-dark-charcoal)' }}>
                  <div><strong style={{ color: 'var(--text-muted)' }}>Name:</strong> {customerDetails.contact}</div>
                  <div><strong style={{ color: 'var(--text-muted)' }}>Phone:</strong> {customerDetails.phone}</div>
                  <div><strong style={{ color: 'var(--text-muted)' }}>Email ID:</strong> {customerDetails.email}</div>
                  <div><strong style={{ color: 'var(--text-muted)' }}>Company:</strong> {customerDetails.name}</div>
                  <div><strong style={{ color: 'var(--text-muted)' }}>Software:</strong> {customerDetails.software}</div>
                  <div><strong style={{ color: 'var(--text-muted)' }}>Product Interest:</strong> {customerDetails.productInterest}</div>
                </div>
              )}
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              {customerDetails && customerDetails.avatar && (
                <img 
                  src={customerDetails.avatar} 
                  alt="Avatar" 
                  style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-glass-border)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} 
                />
              )}
              <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-primary" onClick={async () => {
              const now = new Date();
              const formatted = now.toLocaleString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
              
              const newSchedule = {
                title: "Instant Video Meeting (Google Meet)",
                customer: customerDetails.name,
                date: formatted,
                type: "Email Sent"
              };
              const existing = JSON.parse(localStorage.getItem('aura_schedules') || '[]');
              localStorage.setItem('aura_schedules', JSON.stringify([...existing, newSchedule]));

              const meetLink = 'https://meet.google.com/mxb-qsra-tea';
              const subject = `Instant Video Meeting Invite: ${customerDetails.name}`;
              const body = `Hi ${customerDetails.contact},\n\nPlease join me for a quick video call using the link below:\n\n${meetLink}\n\nBest,\nYour Sales Team`;
              
              addToast(`Sending Google Meet link to ${customerDetails.contact} via AI Server...`, "info");
              
              try {
                const res = await fetch('/api/send-email', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ to: customerDetails.email, subject, body })
                });
                const data = await res.json();
                if(data.success) {
                   addToast(`Email successfully delivered to ${customerDetails.email}!`, "success");
                } else {
                   addToast("Server failed to send email.", "error");
                }
              } catch (e) {
                console.error(e);
                addToast("Network error while sending email.", "error");
              }
            }}>
              <Video size={16} style={{marginRight: 8}}/> Quick Call
            </button>
            <button className="btn-accent" onClick={regenerateSummary} disabled={loadingDetails}>
              {loadingDetails ? <Loader2 size={16} className="spin" style={{marginRight: 8}}/> : <RefreshCw size={16} style={{marginRight: 8}}/>}
              Regenerate Summary
            </button>
          </div>
            </div>
          </div>
        </div>

        {loadingDetails ? (
           <div className="flex-center" style={{height: 300}}><Loader2 size={32} className="spin text-accent"/></div>
        ) : customerDetails ? (
          <div className="module-content" style={{marginTop: 0}}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div className="glass-panel info-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="card-header">
                      <h3 className="card-title"><FileText size={20} className="text-accent"/> Product Details</h3>
                    </div>
                    <p className="summary-text" style={{lineHeight: 1.6, flex: 1}}>
                      {customerDetails.summary}
                    </p>
                  </div>

                  <div className="glass-panel info-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
                    <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 className="card-title"><FileText size={20} className="text-accent"/> AI Product Analysis</h3>
                      {productPreviewHtml && !loadingPreview && (
                        <button className="icon-btn" onClick={() => setIsAnalysisFullScreen(true)} title="Expand Fullscreen">
                          <Maximize2 size={16} />
                        </button>
                      )}
                    </div>
                    <div className="analyzer-content-wrapper" style={{ flex: 1, position: 'relative', minHeight: '150px' }}>
                      {loadingPreview ? (
                        <div className="flex-center" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                          <Loader2 size={24} className="spin text-accent text-muted" />
                          <span style={{ marginLeft: '12px', color: 'var(--text-muted)' }}>Generating Analysis...</span>
                        </div>
                      ) : productPreviewHtml ? (
                        <div className="analyzer-truncated-view" style={{ minHeight: '150px' }}>
                          <div 
                            className="preview-wrapper animate-fade-in" 
                            dangerouslySetInnerHTML={{ __html: productPreviewHtml }} 
                          />
                          <div className="analyzer-gradient-fade" />
                        </div>
                      ) : (
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <p className="text-muted" style={{ textAlign: 'center', margin: 0 }}>No preview available.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Fullscreen Modal Overlay Map */}
                  {isAnalysisFullScreen && (
                    <div className="analyzer-fullscreen-overlay animate-fade-in">
                      <div className="analyzer-fullscreen-modal glass-panel shadow-xl">
                        <div className="modal-header">
                          <h3 className="card-title"><FileText size={24} className="text-accent"/> Detailed AI Product Analysis</h3>
                          <button className="icon-btn close-btn" onClick={() => setIsAnalysisFullScreen(false)}>
                            <X size={24} />
                          </button>
                        </div>
                        <div className="modal-body-scroll">
                          <div dangerouslySetInnerHTML={{ __html: productPreviewHtml }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
    
                <div className="module-grid animate-fade-in" style={{marginTop: 24}}>
                  <div className="glass-panel info-card">
                    <div className="card-header">
                      <h3 className="card-title"><CheckCircle size={20} className="text-accent"/> Key Insights</h3>
                    </div>
                    <ul className="insights-list">
                      {customerDetails.insights.map((insight, idx) => (
                        <li key={idx}><strong>{insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}:</strong> {insight.text}</li>
                      ))}
                    </ul>
                  </div>
    
                  <div className="glass-panel info-card">
                    <div className="card-header">
                      <h3 className="card-title"><MessageSquare size={20} className="text-accent"/> Recent Interactions</h3>
                    </div>
                    <div className="interaction-timeline">
                      {customerDetails.interactions.map((interaction, idx) => (
                        <div className="timeline-item" key={idx}>
                          <span className="timeline-date">{interaction.date}</span>
                          <span className="timeline-event">{interaction.event}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
          </div>
        ) : (
          <div className="flex-center text-muted" style={{height: 300}}>Select a customer to view details.</div>
        )}
      </div>

    </div>
  );
};

export default AccountSummarizer;
