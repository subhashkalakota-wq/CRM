import React from 'react';
import { Map, Calendar, Clock } from 'lucide-react';
import './Features.css';

const OpportunityHeatmap = () => {
  return (
    <div className="module-container animate-fade-in">
      <div className="module-header">
        <div className="module-title-group">
          <div className="icon-wrapper base-bg">
            <Map size={24} />
          </div>
          <div>
            <h2>Opportunity Heatmap</h2>
            <p className="text-muted">Visual matrix of your pipeline showing high-value, high-probability deals.</p>
          </div>
        </div>
      </div>

      <div className="module-content">
        <div className="glass-panel heatmap-card">
          <div className="heatmap-grid-container">
            {/* Y axis */}
            <div className="y-axis">
              <span>High Value</span>
              <span>Med Value</span>
              <span>Low Value</span>
            </div>
            
            <div className="heatmap-grid">
              {/* Top Row (High Value) */}
              <div className="heat-cell safe">
                <div className="deal-dot large"></div>
                <span className="tooltip">Acme Corp ($250k)</span>
              </div>
              <div className="heat-cell warning"></div>
              <div className="heat-cell danger">
                <div className="deal-dot medium"></div>
              </div>
              
              {/* Mid Row (Med Value) */}
              <div className="heat-cell safe">
                <div className="deal-dot medium"></div>
                <div className="deal-dot small"></div>
              </div>
              <div className="heat-cell neutral">
                <div className="deal-dot medium"></div>
              </div>
              <div className="heat-cell warning"></div>
              
              {/* Bottom Row (Low Value) */}
              <div className="heat-cell neutral"></div>
              <div className="heat-cell neutral">
                <div className="deal-dot small"></div>
                <div className="deal-dot small"></div>
              </div>
              <div className="heat-cell warning">
                <div className="deal-dot small"></div>
              </div>
            </div>
          </div>
          
          <div className="x-axis">
            <span>High Probability</span>
            <span>Med Probability</span>
            <span>Low Probability</span>
          </div>
          
          <div className="heatmap-legend mt-4">
            <h4>Focus Areas</h4>
            <div className="legend-items">
              <span className="legend-item"><span className="color-box bg-green"></span> Priority Focus (High Val/Prob)</span>
              <span className="legend-item"><span className="color-box bg-yellow"></span> Nurture Required</span>
              <span className="legend-item"><span className="color-box bg-red"></span> At Risk</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityHeatmap;
