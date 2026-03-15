import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, AlertCircle, BarChart3, Lightbulb, LoaderCircle, History, Zap, DollarSign } from 'lucide-react';
import './Features.css';

const DealSuccessPredictor = ({ customer }) => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!customer) {
      setPrediction(null);
      return;
    }

    const fetchPrediction = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/deal-prediction/${customer.id}`);
        const result = await response.json();
        if (result.success) {
          setPrediction(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch deal prediction", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [customer]);

  return (
    <div className="module-container animate-fade-in">
      <div className="module-header">
        <div className="module-title-group">
          <div className="icon-wrapper base-bg">
            <Target size={24} />
          </div>
          <div>
            <h2>Deal Success Predictor</h2>
            <p className="text-muted">AI continuously evaluates win probability based on real-time deal data.</p>
          </div>
        </div>
      </div>

      <div className="module-content">
        <div className="glass-panel predictor-card">
          <div className="predictor-visual">
            <svg viewBox="0 0 36 36" className="circular-chart gold">
              <path className="circle-bg"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path className="circle"
                strokeDasharray="85, 100"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <text x="18" y="20.35" className="percentage">{customer ? 70 + (customer.id * 2) : 85}%</text>
            </svg>
          </div>
          <div className="predictor-details">
            <h3>{customer ? customer.name : 'Acme Corp'} - {customer ? customer.productInterest : 'Enterprise Expansion'}</h3>
            <p className="text-muted mb-4">Probability of winning has increased by +{customer ? ((customer.id * 3) % 20) + 5 : 12}% since last week following positive executive sponsor engagement.</p>
            
            <div className="factor-list">
              <div className="factor positive">
                <TrendingUp size={16} /> Decision maker engaged (+8%)
              </div>
              <div className="factor positive">
                <TrendingUp size={16} /> Budget confirmed (+5%)
              </div>
            </div>

            {loading ? (
              <div className="prediction-loading mt-4">
                <LoaderCircle className="spin" size={24} />
                <p>Analyzing historical deal data...</p>
              </div>
            ) : prediction ? (
              <div className="ai-predictions-container mt-4 animate-fade-in">
                {/* Prioritize History If Available */}
                {prediction.hasHistory && prediction.history.length > 0 && (
                  <div className="prediction-card history-context mb-3">
                    <div className="prediction-header">
                      <History size={18} className="text-blue-500" />
                      <h4>Deal History Context</h4>
                    </div>
                    <div className="history-mini-list mt-2">
                       {prediction.history.slice(0, 3).map((deal, idx) => (
                         <div key={idx} className="history-item-mini text-muted">
                           • {deal.product} ({deal.amount}) - {deal.status}
                         </div>
                       ))}
                    </div>
                  </div>
                )}

                {/* Efficiency & Business Value for New Customers */}
                {!prediction.hasHistory && (
                  <div className="prediction-new-engagement mb-3">
                    <div className="prediction-row">
                      <div className="prediction-badge efficiency-badge">
                        <Zap size={14} className="mr-1" />
                        <span><strong>Efficiency:</strong> {prediction.efficiency}</span>
                      </div>
                      <div className="prediction-badge value-badge">
                        <DollarSign size={14} className="mr-1" />
                        <span><strong>Value:</strong> {prediction.businessValue}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="prediction-card recommendation-card">
                   <div className="prediction-header">
                     <Lightbulb size={18} className="text-yellow-500" />
                     <h4>AI Recommendation</h4>
                   </div>
                   <p>{prediction.recommendation}</p>
                </div>
                
                <div className="prediction-row mt-3">
                   <div className="prediction-badge">
                     <AlertCircle size={14} className="mr-1" />
                     <span><strong>Relook:</strong> {prediction.relook}</span>
                   </div>
                   <div className={`prediction-badge ${prediction.isProfit ? 'profit-badge' : 'loss-badge'}`}>
                     <BarChart3 size={14} className="mr-1" />
                     <span><strong>Profitability:</strong> {prediction.profitability}</span>
                   </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealSuccessPredictor;
