import React from 'react';
import { Zap, Timer, CheckCircle, Shield, ArrowRight } from 'lucide-react';
import './EfficiencyComparison.css';

const EfficiencyComparison = () => {
  const metrics = [
    {
      title: "Response Speed",
      aiValue: "< 2 Seconds",
      crmValue: "4-24 Hours",
      icon: <Timer size={24} className="text-accent" />,
      efficiency: "99.9% Faster"
    },
    {
      title: "Availability",
      aiValue: "24/7/365",
      crmValue: "Business Hours",
      icon: <Zap size={24} className="text-accent" />,
      efficiency: "3x More Coverage"
    },
    {
      title: "Data Accuracy",
      aiValue: "98% (AI-Verified)",
      crmValue: "70% (Manual Entry)",
      icon: <CheckCircle size={24} className="text-accent" />,
      efficiency: "28% More Precise"
    },
    {
      title: "Operational Cost",
      aiValue: "Scale with AI",
      crmValue: "Scale with Headcount",
      icon: <Shield size={24} className="text-accent" />,
      efficiency: "80% Cost Reduction"
    }
  ];

  return (
    <section id="efficiency" className="efficiency-section container">
      <div className="section-header text-center">
        <h2 className="section-title">The Efficiency Edge</h2>
        <p className="section-subtitle">Real-time AI Intelligence vs. Traditional Manual CRM Systems</p>
      </div>

      <div className="comparison-grid">
        {metrics.map((m, i) => (
          <div key={i} className="comparison-card glass-panel animate-fade-in" style={{ animationDelay: `${i * 0.15}s` }}>
            <div className="card-top">
              <div className="icon-wrapper">{m.icon}</div>
              <span className="efficiency-badge">{m.efficiency}</span>
            </div>
            
            <h3 className="metric-title">{m.title}</h3>
            
            <div className="comparison-stats">
              <div className="stat-row">
                <span className="stat-label">AuraCRM AI</span>
                <span className="stat-value text-accent">{m.aiValue}</span>
              </div>
              <div className="stat-row traditional">
                <span className="stat-label">Traditional CRM</span>
                <span className="stat-value">{m.crmValue}</span>
              </div>
            </div>

            <div className="stat-bar-container">
               <div className="stat-bar ai-bar" style={{ width: '100%' }}></div>
               <div className="stat-bar traditional-bar" style={{ width: '30%' }}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="efficiency-cta animate-fade-in delay-3">
        <div className="cta-content glass-panel">
          <div className="cta-text">
            <h4>Ready to automate your sales workflow?</h4>
            <p>Join the 500+ teams who have switched from legacy boards to automated AI intelligence.</p>
          </div>
          <a href="/dashboard" className="btn-accent">
            Get Started Now <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default EfficiencyComparison;
