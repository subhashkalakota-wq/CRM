import React from 'react';
import { Smile, Frown, Meh, AlertCircle } from 'lucide-react';
import { useToast } from '../Toast';
import '../modules/Modules.css';

const CustomerEmotionAnalyzer = ({ customer }) => {
  const { addToast } = useToast();

  return (
    <div className="module-container animate-fade-in">
      <div className="module-header">
        <div className="module-title-group">
          <div className="icon-wrapper base-bg">
            <Smile size={24} />
          </div>
          <div>
            <h2>Customer Emotion Analyzer</h2>
            <p className="text-muted">Sentiment analysis drawn from email threads and call transcripts.</p>
          </div>
        </div>
      </div>

      <div className="module-content">
        <div className="module-grid">
          <div className="glass-panel sentiment-card">
            <div className="sentiment-header">
              <h3>Latest Communication</h3>
              <span className="badge badge-hesitant">Hesitant</span>
            </div>
            <div className="sentiment-body">
              <div className="quote-box">
                <AlertCircle size={20} className="quote-icon text-muted" />
                <p><i>"The robust features are great, but I'm primarily concerned about the timeline for migration to the {customer ? customer.software : 'new system'}."</i></p>
              </div>
              
              <div className="analysis-result">
                <h4>AI Sentiment Breakdown</h4>
                <div className="sentiment-bar-container">
                  <div className="sentiment-label">Interested (40%)</div>
                  <div className="sentiment-bar"><div className="fill bg-green" style={{width: '40%'}}></div></div>
                  
                  <div className="sentiment-label">Hesitant (50%)</div>
                  <div className="sentiment-bar"><div className="fill bg-yellow" style={{width: '50%'}}></div></div>
                  
                  <div className="sentiment-label">Confused (10%)</div>
                  <div className="sentiment-bar"><div className="fill bg-red" style={{width: '10%'}}></div></div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel recommendation-card">
            <h3>Recommended Response Tone <span className="tone-badge">Reassuring & Analytical</span></h3>
            <h3 className="card-title text-accent">AI Recommendation for {customer ? customer.contact.split(' ')[0] : 'the client'}</h3>
            <p className="mt-2 text-muted" style={{ lineHeight: 1.6 }}>Adopt a <strong>reassuring and highly technical</strong> tone in your next communication. Address security concerns about the <strong>{customer ? customer.productInterest : 'platform'}</strong> directly before pushing for a close.</p>
            <button 
              className="btn-primary mt-4 w-full"
              onClick={() => addToast("Drafting reassuring email with AI...", "info")}
            >
              Draft Reassuring Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerEmotionAnalyzer;
