import React from 'react';
import { Brain, LineChart, Mail, Presentation } from 'lucide-react';
import './FeatureHighlights.css';

const features = [
  {
    icon: <Brain size={28} />,
    title: 'Account Summarizer',
    description: 'AI instantly reads CRM data to provide a comprehensive summary of customer history and previous interactions.'
  },
  {
    icon: <LineChart size={28} />,
    title: 'Opportunity Analyzer',
    description: 'Predict deal outcomes and discover the next best action to take for every sales opportunity.'
  },
  {
    icon: <Mail size={28} />,
    title: 'Smart Email Generator',
    description: 'Auto-generate highly personalized follow-up emails based on sentiment and interaction history.'
  },
  {
    icon: <Presentation size={28} />,
    title: 'Proposal Generator',
    description: 'Instantly create customized sales proposals tailored precisely to the client\'s needs.'
  }
];

const FeatureHighlights = () => {
  return (
    <section id="features" className="features-section container">
      <div className="section-header center mb-12">
        <h2 className="section-title">Elevate Your Sales with AI Insights</h2>
        <p className="section-subtitle">
          Our specialized AI modules analyze your CRM data to empower your team with actionable intelligence.
        </p>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card glass-panel">
            <div className="feature-icon-wrapper">
              {feature.icon}
            </div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureHighlights;
