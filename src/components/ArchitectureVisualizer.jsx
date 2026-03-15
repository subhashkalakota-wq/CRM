import React from 'react';
import { Database, Zap, LayoutDashboard, ArrowRight } from 'lucide-react';
import './ArchitectureVisualizer.css';

const ArchitectureVisualizer = () => {
  return (
    <section id="how-it-works" className="architecture-section container">
      <div className="section-header center mb-12">
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">
          A seamless flow from your CRM data to actionable sales intelligence.
        </p>
      </div>

      <div className="arch-flow-container">
        
        {/* Step 1 */}
        <div className="arch-node glass-panel">
          <div className="node-icon bg-blue">
            <Database size={24} />
          </div>
          <h4>Salesforce CRM Data</h4>
          <p>Raw customer history & interactions.</p>
        </div>

        <ArrowRight className="flow-arrow text-accent" size={32} />

        {/* Step 2 */}
        <div className="arch-node glass-panel node-highlight">
          <div className="node-icon bg-gold">
            <Zap size={24} />
          </div>
          <h4>AI Processing Modules</h4>
          <p>Agentforce models analyze & generate.</p>
          <div className="pulse-ring"></div>
        </div>

        <ArrowRight className="flow-arrow text-accent" size={32} />

        {/* Step 3 */}
        <div className="arch-node glass-panel">
          <div className="node-icon bg-dark">
            <LayoutDashboard size={24} />
          </div>
          <h4>Sales Insights Engine</h4>
          <p>Interactive dashboard & actionable insights.</p>
        </div>
        
      </div>
    </section>
  );
};

export default ArchitectureVisualizer;
