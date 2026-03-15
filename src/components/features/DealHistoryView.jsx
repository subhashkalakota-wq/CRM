import React from 'react';
import { ShoppingBag, Calendar, DollarSign, Activity } from 'lucide-react';
import './Features.css';

const getStatusColor = (status) => {
  if (status === 'Closed Won') return { bg: 'rgba(46,204,113,0.15)', color: '#27ae60' };
  if (status === 'In Negotiation') return { bg: 'rgba(52,152,219,0.15)', color: '#2980b9' };
  if (status === 'Renewal Due') return { bg: 'rgba(243,156,18,0.15)', color: '#d68910' };
  return { bg: 'rgba(52,73,94,0.1)', color: '#52636d' };
};

const DealHistoryView = ({ customer }) => {
  if (!customer) return null;

  const isNewCustomer = customer.customerType === 'new' || !customer.dealHistory || customer.dealHistory.length === 0;

  return (
    <div className="module-container animate-fade-in" style={{ padding: '2rem' }}>
      <div className="module-header" style={{ marginBottom: '2rem' }}>
        <div className="module-title-group">
          <div className="icon-wrapper" style={{ background: 'rgba(168, 142, 91, 0.1)', color: 'var(--color-accent)' }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <h2>Deal History</h2>
            <p className="text-muted">A comprehensive view of past and ongoing product engagements.</p>
          </div>
        </div>
      </div>

      <div className="module-content">
        {isNewCustomer ? (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(52,152,219,0.1)', borderRadius: '50%', color: '#2980b9' }}>
                <ShoppingBag size={32} />
              </div>
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-dark-charcoal)' }}>No Deal History</h3>
            <p className="text-muted" style={{ maxWidth: '400px', margin: '0 auto' }}>
              {customer.name} is a new customer. There are no prior transactions or closed deals on record yet.
            </p>
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-dark-charcoal)' }}>
              Historical Purchases ({customer.dealHistory.length})
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {customer.dealHistory.map((deal, idx) => {
                const sc = getStatusColor(deal.status);
                return (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1.25rem',
                    background: 'var(--color-ivory)',
                    border: '1px solid var(--color-glass-border)',
                    borderRadius: '12px',
                    transition: 'transform 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 2 }}>
                      <div style={{ padding: '12px', background: 'var(--color-glass-surface)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <ShoppingBag size={20} className="text-accent" />
                      </div>
                      <div>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-dark-charcoal)' }}>
                          {deal.product}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--color-muted)', fontSize: '0.85rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={14} />
                            Purchased: {deal.date}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1, justifyContent: 'flex-end' }}>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-muted)', marginBottom: '2px' }}>Value</span>
                        <strong style={{ fontSize: '1.1rem', color: 'var(--color-dark-charcoal)' }}>{deal.amount}</strong>
                      </div>
                      
                      <div style={{ minWidth: '110px', textAlign: 'right' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '6px 12px',
                          borderRadius: '100px',
                          background: sc.bg,
                          color: sc.color,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          {deal.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DealHistoryView;
