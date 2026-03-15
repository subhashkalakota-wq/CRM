import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, Search, User, Mail, Phone, Building, Briefcase, Zap, X, Check, Cpu, Package, ArrowLeft, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1526869246862-08d97d94c0e1?w=400&q=80";

// ─────────────────────────────────────────────
// Auth Panel (Signup / Login)
// ─────────────────────────────────────────────
const AuthPanel = ({ onAuth, sfError }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [form, setForm] = useState({ name: '', email: '', phone: '', companyName: '', role: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(sfError || '');
  const [sfLoading, setSfLoading] = useState(false);

  const handleSalesforceLogin = () => {
    setSfLoading(true);
    window.location.href = '/api/auth/salesforce';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const endpoint = mode === 'signup' ? '/api/store/signup' : '/api/store/login';
      const body = mode === 'signup' ? form : { email: form.email };
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data.success) { setError(data.error); return; }
      onAuth(data.user);
    } catch { setError('Connection error. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0d1117 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)' }}>
              <Sparkles size={24} color="white" fill="white" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '1.8rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
              <span>Aura</span><span style={{ color: '#a855f7' }}>Store</span>
            </div>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Premium Electronics & Tech Marketplace</p>
        </div>

        {/* Card */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '2.5rem', backdropFilter: 'blur(20px)' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '4px', marginBottom: '2rem' }}>
            {['login', 'signup'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); }} style={{
                flex: 1, padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, transition: 'all 0.2s',
                background: mode === m ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'transparent',
                color: mode === m ? 'white' : 'rgba(255,255,255,0.4)',
              }}>
                {m === 'login' ? '🔑 Login' : '✨ Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Signup extra fields */}
            {mode === 'signup' && (
              <>
                <InputField icon={<User size={16} />} placeholder="Full Name *" value={form.name} onChange={v => setForm(p => ({ ...p, name: v }))} required />
                <InputField icon={<Phone size={16} />} placeholder="Phone Number *" value={form.phone} onChange={v => setForm(p => ({ ...p, phone: v }))} required type="tel" />
                <InputField icon={<Building size={16} />} placeholder="Company Name (optional)" value={form.companyName} onChange={v => setForm(p => ({ ...p, companyName: v }))} />
                <InputField icon={<Briefcase size={16} />} placeholder="Role (optional)" value={form.role} onChange={v => setForm(p => ({ ...p, role: v }))} />
              </>
            )}
            <InputField icon={<Mail size={16} />} placeholder="Email Address *" value={form.email} onChange={v => setForm(p => ({ ...p, email: v }))} required type="email" />

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '12px 16px', marginBottom: '1rem', color: '#f87171', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px', borderRadius: '12px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: 'white', fontSize: '1rem', fontWeight: 700,
              opacity: loading ? 0.7 : 1, marginTop: '4px', transition: 'all 0.2s',
            }}>
              {loading ? '⏳ Please wait...' : mode === 'signup' ? '🚀 Create Account' : '🔑 Enter Store'}
            </button>
          </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0 16px' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>or continue with</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
        </div>

        {/* Salesforce OAuth Button */}
        <button
          onClick={handleSalesforceLogin}
          disabled={sfLoading}
          style={{
            width: '100%', padding: '13px 16px', borderRadius: '12px',
            border: '1px solid rgba(0,161,224,0.4)',
            background: 'linear-gradient(135deg, rgba(0,112,162,0.2), rgba(0,161,224,0.15))',
            color: 'white', fontSize: '0.95rem', fontWeight: 700,
            cursor: sfLoading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            transition: 'all 0.25s', opacity: sfLoading ? 0.7 : 1,
            backdropFilter: 'blur(10px)',
          }}
          onMouseEnter={e => { if (!sfLoading) e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,112,162,0.35), rgba(0,161,224,0.25))'; }}
          onMouseLeave={e => { if (!sfLoading) e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,112,162,0.2), rgba(0,161,224,0.15))'; }}
        >
          {/* Salesforce Cloud Icon */}
          <svg width="20" height="14" viewBox="0 0 50 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.9 4.2a11.2 11.2 0 0 1 7.9-3.3c4 0 7.6 2.1 9.6 5.4a13.8 13.8 0 0 1 3.5-.5c7.7 0 13.9 6.3 13.9 14.1S49.6 34 41.9 34H10.1A10 10 0 0 1 0 24a10 10 0 0 1 7.6-9.7 12.2 12.2 0 0 1 13.3-10.1z" fill="#00A1E0" opacity="0.9"/>
          </svg>
          {sfLoading ? 'Redirecting to Salesforce...' : 'Continue with Salesforce'}
        </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', textDecoration: 'none' }}>← Back to AuraCRM</Link>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ icon, placeholder, value, onChange, required, type = 'text' }) => (
  <div style={{ position: 'relative', marginBottom: '1rem' }}>
    <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }}>{icon}</div>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      required={required}
      style={{
        width: '100%', padding: '13px 16px 13px 42px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px', color: 'white', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
        '::placeholder': { color: 'rgba(255,255,255,0.3)' }
      }}
    />
  </div>
);

// ─────────────────────────────────────────────
// Product Card
// ─────────────────────────────────────────────
const badgeColor = {
  'Bestseller': '#ef4444', 'Top Rated': '#f59e0b', 'Hot Deal': '#ef4444', 'Popular': '#10b981',
  'Budget Pick': '#3b82f6', 'Gaming Beast': '#8b5cf6', 'Value King': '#f97316', 'Great Value': '#10b981',
  'Foldable': '#6366f1', 'Gaming': '#8b5cf6', 'Business': '#0ea5e9', 'Premium': '#d4a843',
  'Budget': '#3b82f6', '2-in-1': '#6366f1', 'Outdoor': '#10b981', 'Mixed Reality': '#8b5cf6',
  'FPV': '#ef4444', 'Solar Ready': '#10b981', 'Top GPU': '#ef4444', 'Best CPU': '#f59e0b',
  'Top E-Reader': '#3b82f6', 'Action Cam': '#ef4444', 'Trendy': '#ec4899', 'Drone': '#8b5cf6',
  'Handheld': '#6366f1', 'Ultrawide': '#f59e0b', "Editor's Choice": '#d4a843', '8K': '#a855f7',
  'Spatial Computing': '#a855f7', 'Pro Pick': '#d4a843', 'Handheld PC': '#8b5cf6', 'Gaming Mouse': '#ef4444',
  'WiFi 6E': '#0ea5e9', 'Health Ring': '#10b981', 'Athletic': '#f97316', 'Educational': '#10b981',
  'Kids': '#3b82f6', 'Budget Gem': '#3b82f6',
  '#1 Bestseller': '#ef4444', '#2 Bestseller': '#f97316', '#3 Bestseller': '#f59e0b',
};

// ─────────────────────────────────────────────
// Top Seller Strip
// ─────────────────────────────────────────────
const TopSellerStrip = ({ title, products, onProductClick, onAddToCart, cart, accentColor = '#7c3aed' }) => {
  if (!products || products.length === 0) return null;

  return (
    <div style={{ marginBottom: '3rem', animation: 'fadeInUp 0.6s ease-out' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 32, height: 32, borderRadius: '8px', background: `${accentColor}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={20} color={accentColor} fill={accentColor} />
          </div>
          {title}
        </h2>
        <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, transparent 100%)', marginLeft: '2rem' }}></div>
      </div>
      
      <div style={{ 
        display: 'flex', 
        gap: '1.5rem', 
        overflowX: 'auto', 
        paddingBottom: '1rem',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }} className="hide-scrollbar">
        {products.map((product, index) => {
          const rank = index + 1;
          const inCart = cart.some(c => c.id === product.id);
          
          return (
            <div 
              key={product.id} 
              style={{ 
                minWidth: '280px', 
                background: 'rgba(255,255,255,0.03)', 
                border: '1px solid rgba(255,255,255,0.08)', 
                borderRadius: '24px', 
                padding: '12px',
                position: 'relative',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.borderColor = `${accentColor}44`;
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              }}
              onClick={() => onProductClick(product)}
            >
              <div style={{ position: 'relative', height: '160px', borderRadius: '18px', overflow: 'hidden', marginBottom: '12px' }}>
                <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '10px', left: '10px', background: rank <= 3 ? 'linear-gradient(135deg, #f59e0b, #ef4444)' : 'rgba(0,0,0,0.6)', borderRadius: '10px', padding: '4px 12px', color: 'white', fontSize: '0.75rem', fontWeight: 800, backdropFilter: 'blur(4px)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                  #{rank} SELLER
                </div>
              </div>

              <div style={{ padding: '0 8px 8px 8px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: accentColor, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{product.brand}</div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white', margin: '0 0 8px 0', lineHeight: 1.3, height: '2.6rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{product.name}</h4>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
                  <Star size={12} fill="#f59e0b" color="#f59e0b" />
                  <span style={{ fontSize: '0.8rem', color: 'white', fontWeight: 700 }}>{product.rating}</span>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>({(product.reviews / 1000).toFixed(1)}k+)</span>
                  <div style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>{product.sold.toLocaleString()}+ sold</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'white' }}>₹{product.price.toLocaleString('en-IN')}</div>
                  <button onClick={e => { e.stopPropagation(); onAddToCart(product); }} style={{
                    width: '36px', height: '36px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                    background: inCart ? 'rgba(16,185,129,0.2)' : `linear-gradient(135deg, ${accentColor}, #2563eb)`,
                    color: inCart ? '#10b981' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
                  }}>
                    {inCart ? <Check size={18} /> : <ShoppingCart size={18} />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ProductCard = ({ product, onAddToCart, inCart, accentColor = '#7c3aed' }) => (
  <div style={{
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px',
    overflow: 'hidden', transition: 'transform 0.2s, border-color 0.2s',
    ':hover': { transform: 'translateY(-4px)', borderColor: 'rgba(168,85,247,0.4)' }
  }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(168,85,247,0.4)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
    <div style={{ position: 'relative', height: '180px', overflow: 'hidden', background: 'rgba(255,255,255,0.03)', cursor: 'pointer' }} onClick={() => product.onClick?.(product)}>
      <img 
        src={product.image} 
        alt={product.name} 
        onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_IMAGE; }}
        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} 
      />
      {product.badge && (
        <span style={{
          position: 'absolute', top: '10px', left: '10px', padding: '3px 10px', borderRadius: '100px',
          background: badgeColor[product.badge] || '#7c3aed', color: 'white', fontSize: '0.68rem', fontWeight: 700,
        }}>{product.badge}</span>
      )}
      <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', borderRadius: '8px', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <Star size={11} fill="#f59e0b" color="#f59e0b" />
        <span style={{ color: 'white', fontSize: '0.72rem', fontWeight: 700 }}>{product.rating}</span>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.68rem' }}>({(product.reviews / 1000).toFixed(1)}k)</span>
      </div>
    </div>
    <div style={{ padding: '16px' }}>
      <p style={{ fontSize: '0.65rem', color: '#a855f7', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px 0' }}>{product.brand} · {product.category}</p>
      <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white', margin: '0 0 6px 0', lineHeight: 1.3 }}>{product.name}</h3>
      <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', margin: '0 0 8px 0' }}>{product.specs}</p>
      {product.sold && (
        <div style={{ padding: '4px 8px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#10b981' }}>🔥 {product.sold >= 1000 ? (product.sold/1000).toFixed(1) + 'k+' : product.sold + '+'} bought in past month</span>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white' }}>₹{product.price.toLocaleString('en-IN')}</span>
          {product.originalPrice > product.price && (
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', textDecoration: 'line-through', marginLeft: '8px' }}>
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
        <button onClick={(e) => { e.stopPropagation(); onAddToCart(product); }} style={{
          padding: '8px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700,
          background: inCart ? 'rgba(16,185,129,0.2)' : 'linear-gradient(135deg, #7c3aed, #a855f7)',
          color: inCart ? '#10b981' : 'white', display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.2s',
        }}>
          {inCart ? <><Check size={14} /> Added</> : <><ShoppingCart size={14} /> Add</>}
        </button>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// Product Details Modal (AI Integration)
// ─────────────────────────────────────────────
const ProductDetailsModal = ({ product, onClose, detailsApiPath, accentColor = '#7c3aed', onAddToCart, inCart }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'reviews'

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const url = detailsApiPath || `/api/store/product-details/${product.id}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
          setDetails(data.details);
        }
      } catch (err) {
        console.error("Failed to load details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [product.id, detailsApiPath]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)' }} onClick={onClose} />
      
      <div style={{ position: 'relative', background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', width: '100%', maxWidth: '850px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', zIndex: 10 }}>
          <X size={20} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1.5fr', height: '100%', overflow: 'hidden' }}>
          {/* Left Column: Image Gallery */}
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
             <img src={product.image} onError={(e) => { e.target.src = DEFAULT_IMAGE; }} style={{ width: '100%', borderRadius: '16px', aspectRatio: '1/1', objectFit: 'cover' }} alt={product.name} />
             <div style={{ display: 'flex', gap: '10px' }}>
                <img src={DEFAULT_IMAGE} style={{ flex: 1, borderRadius: '8px', aspectRatio: '1/1', objectFit: 'cover', opacity: 0.6 }} alt="angle 1" />
                <img src={DEFAULT_IMAGE} style={{ flex: 1, borderRadius: '8px', aspectRatio: '1/1', objectFit: 'cover', opacity: 0.6 }} alt="angle 2" />
                <img src={DEFAULT_IMAGE} style={{ flex: 1, borderRadius: '8px', aspectRatio: '1/1', objectFit: 'cover', opacity: 0.6 }} alt="angle 3" />
             </div>
          </div>

          {/* Right Column: Content & Tabs */}
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '90vh' }}>
             {/* Header */}
             <div style={{ padding: '2.5rem 2.5rem 1rem 2.5rem' }}>
               <span style={{ color: accentColor, fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{product.brand} · {product.category}</span>
               <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '8px 0', color: 'white', lineHeight: 1.2 }}>{product.name}</h2>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                 <div style={{ display: 'flex', color: '#f59e0b', fontSize: '1.05rem' }}>{"★".repeat(Math.round(product.rating))}{"☆".repeat(5-Math.round(product.rating))}</div>
                 <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginRight: '4px' }}>{product.rating} ({product.reviews} reviews)</span>
                 {product.sold && (
                   <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '5px 10px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                     🔥 {product.sold >= 1000 ? (product.sold/1000).toFixed(1) + 'k+' : product.sold + '+'} bought in past month
                   </span>
                 )}
               </div>
               <div style={{ fontSize: '2rem', fontWeight: 800, color: 'white' }}>₹{product.price.toLocaleString('en-IN')}</div>
             </div>

             {/* Tab Navigation */}
             <div style={{ display: 'flex', gap: '1rem', padding: '0 2.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
               <button 
                 onClick={() => setActiveTab('summary')}
                 style={{ 
                   background: 'transparent', border: 'none', padding: '10px 0', fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
                   color: activeTab === 'summary' ? accentColor : 'rgba(255,255,255,0.5)', 
                   borderBottom: activeTab === 'summary' ? `2px solid ${accentColor}` : '2px solid transparent'
                 }}
               >
                 AI Summary
               </button>
               <button 
                 onClick={() => setActiveTab('reviews')}
                 style={{ 
                   background: 'transparent', border: 'none', padding: '10px 0', fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
                   color: activeTab === 'reviews' ? accentColor : 'rgba(255,255,255,0.5)', 
                   borderBottom: activeTab === 'reviews' ? `2px solid ${accentColor}` : '2px solid transparent'
                 }}
               >
                 Reviews
               </button>
             </div>

             {/* Scrollable Tab Content */}
             <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 2.5rem' }}>
               {activeTab === 'summary' ? (
                 <>
                   {loading ? (
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                       <div style={{ height: '14px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', width: '100%', animation: 'pulse 1.5s infinite' }} />
                       <div style={{ height: '14px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', width: '90%', animation: 'pulse 1.5s infinite' }} />
                       <div style={{ height: '14px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', width: '95%', animation: 'pulse 1.5s infinite' }} />
                       <div style={{ height: '14px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', width: '60%', animation: 'pulse 1.5s infinite' }} />
                     </div>
                   ) : (
                     <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                       {details?.summary || product.specs + ". An excellent device for all your needs."}
                     </p>
                   )}
                 </>
               ) : (
                 <>
                   {loading ? (
                     <div style={{ height: '100px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', animation: 'pulse 1.5s infinite' }} />
                   ) : (
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                       {(details?.reviews || []).slice(0, 15).map((rev, i) => (
                         <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                             <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'white' }}>{rev.author}</span>
                             <span style={{ color: '#f59e0b', fontSize: '0.8rem' }}>{"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}</span>
                           </div>
                           <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: 'white', fontWeight: 500 }}>"{rev.title}"</p>
                           <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>{rev.content}</p>
                         </div>
                       ))}
                     </div>
                   )}
                 </>
               )}
               <div style={{ height: '2rem' }}></div> {/* Bottom spacer */}
             </div>

             {/* Footer Add to Cart Button */}
             <div style={{ padding: '1.5rem 2.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
                <button onClick={() => onAddToCart(product)} style={{
                  width: '100%', padding: '16px', borderRadius: '14px', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: 800,
                  background: inCart ? 'rgba(16,185,129,0.2)' : `linear-gradient(135deg, ${accentColor}, #2563eb)`,
                  color: inCart ? '#10b981' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s',
                  boxShadow: inCart ? 'none' : `0 4px 16px ${accentColor}40`
                }}>
                  {inCart ? <><Check size={18} /> Added to Cart</> : <><ShoppingCart size={18} /> Add to Cart</>}
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Product Catalog
// ─────────────────────────────────────────────
const ProductCatalog = ({ user, onLogout, onBack }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [priceRange, setPriceRange] = useState(null); // null = all prices
  const [topProducts, setTopProducts] = useState({ hardware: [], software: [] });

  const PRICE_BRACKETS = [
    { label: 'Under ₹10K', max: 10000, min: 0, color: '#10b981' },
    { label: '₹10K–₹50K',  max: 50000, min: 10000, color: '#3b82f6' },
    { label: '₹50K–₹1L',  max: 100000, min: 50000, color: '#f59e0b' },
    { label: 'Above ₹1L',  max: Infinity, min: 100000, color: '#ef4444' },
  ];

  useEffect(() => {
    fetchProducts();
    fetchCart();
    fetchTopProducts();
  }, [activeCategory, search]);

  const fetchTopProducts = async () => {
    try {
      const res = await fetch('/api/store/top-products');
      const data = await res.json();
      if (data.success) setTopProducts(data);
    } catch (e) {
      console.error("Failed to fetch top products", e);
    }
  };

  const fetchProducts = async () => {
    const params = new URLSearchParams();
    if (activeCategory !== 'All') params.set('category', activeCategory);
    if (search) params.set('search', search);
    const res = await fetch(`/api/store/products?${params}`);
    const data = await res.json();
    if (data.success) {
      setProducts(data.products);
      const fetchedCats = data.categories.filter(c => c !== 'All');
      setCategories(['All', ...new Set(fetchedCats)]);
    }
  };

  const fetchCart = async () => {
    const res = await fetch(`/api/store/cart?email=${user.email}`);
    const data = await res.json();
    if (data.success) setCart(data.cart);
  };

  const updateCart = async (productId, action) => {
    const res = await fetch('/api/store/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, productId, action })
    });
    const data = await res.json();
    if (data.success) setCart(data.cart);
  };

  const addToCart = (product) => updateCart(product.id, 'add');
  const removeFromCart = (productId) => updateCart(productId, 'remove');
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const res = await fetch('/api/store/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      });
      const data = await res.json();
      if (data.success) {
        setCheckoutSuccess(true);
        fetchCart();
        setTimeout(() => {
          setCheckoutSuccess(false);
          setIsCartOpen(false);
        }, 3000);
      }
    } catch (e) {
      console.error("Checkout failed", e);
    } finally {
      setIsCheckingOut(false);
    }
  };
  const discount = (p) => Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);

  // Client-side price filter
  const filteredProducts = priceRange
    ? products.filter(p => p.price >= priceRange.min && p.price < priceRange.max)
    : products;

  // Suggestions: products in same price bracket as cheapest cart item (or cheapest bracket if cart empty)
  const suggestedBracket = (() => {
    if (filteredProducts.length === 0) return null;
    const refPrice = cart.length > 0
      ? Math.min(...cart.map(i => i.price))
      : Math.min(...filteredProducts.map(p => p.price));
    return PRICE_BRACKETS.find(b => refPrice >= b.min && refPrice < b.max) || PRICE_BRACKETS[0];
  })();
  const suggestedProducts = suggestedBracket
    ? products.filter(p => p.price >= suggestedBracket.min && p.price < suggestedBracket.max && !cart.some(c => c.id === p.id)).slice(0, 5)
    : [];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0d1117 100%)', color: 'white' }}>
      {/* Header */}
      <header style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 2rem', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(20px)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '10px', padding: '8px 12px', color: 'white', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}><ArrowLeft size={14} /> Back</button>
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)' }}>
              <Sparkles size={20} color="white" fill="white" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '1.3rem', fontWeight: 800 }}>
              <span style={{ color: 'white' }}>Aura</span><span style={{ color: '#a855f7' }}>Store</span>
            </div>
          </div>

          {/* Search */}
          <div style={{ flex: 1, maxWidth: '500px', margin: '0 2rem', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search phones, laptops, cameras…"
              style={{ width: '100%', padding: '10px 16px 10px 42px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Cart */}
            <div onClick={() => setIsCartOpen(true)} style={{ position: 'relative', background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'background 0.2s', ':hover': { background: 'rgba(255,255,255,0.1)' } }}>
              <ShoppingCart size={18} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{cart.reduce((s,i) => s + i.quantity, 0)}</span>
              {cart.length > 0 && <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', borderRadius: '50%', background: '#a855f7' }} />}
            </div>
            {/* User + Logout */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.name}</span>
              <button onClick={onLogout} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '8px', padding: '6px 12px', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', cursor: 'pointer' }}>Logout</button>
            </div>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, margin: '0 0 0.5rem 0', background: 'linear-gradient(135deg, white, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            100+ Premium Products
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem' }}>Top electronics & tech picks — curated for you, {user.name.split(' ')[0]} 👋</p>
        </div>

        {/* Stats bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
          {[
            { label: 'Products Available', value: '100+', icon: <Package size={24} /> },
            { label: 'Categories', value: (categories.length - 1) + '', icon: <Briefcase size={24} /> },
            { label: 'In Your Cart', value: cart.length + '', icon: <ShoppingCart size={24} /> },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ color: '#a855f7', marginBottom: '8px' }}>{s.icon}</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#a855f7' }}>{s.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Price Filter Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '1.5rem', padding: '16px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.07)' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginRight: '4px' }}>💰 Price:</span>
          <button
            onClick={() => setPriceRange(null)}
            style={{ padding: '7px 16px', borderRadius: '100px', border: '1px solid', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s',
              background: priceRange === null ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.04)',
              borderColor: priceRange === null ? '#a855f7' : 'rgba(255,255,255,0.1)',
              color: priceRange === null ? '#a855f7' : 'rgba(255,255,255,0.6)' }}
          >All</button>
          {PRICE_BRACKETS.map(b => (
            <button key={b.label}
              onClick={() => setPriceRange(priceRange?.label === b.label ? null : b)}
              style={{ padding: '7px 16px', borderRadius: '100px', border: '1px solid', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s',
                background: priceRange?.label === b.label ? `${b.color}22` : 'rgba(255,255,255,0.04)',
                borderColor: priceRange?.label === b.label ? b.color : 'rgba(255,255,255,0.1)',
                color: priceRange?.label === b.label ? b.color : 'rgba(255,255,255,0.6)' }}
            >{b.label}</button>
          ))}
          {priceRange && (
            <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: priceRange.color, fontWeight: 600 }}>
              {filteredProducts.length} products in range
            </span>
          )}
        </div>

        {/* Top Recommendations */}
        {activeCategory === 'All' && !search && (
          <TopSellerStrip 
            title="Top 10 Trending Hardware" 
            products={topProducts.hardware} 
            onProductClick={setSelectedProduct}
            onAddToCart={addToCart}
            cart={cart}
            accentColor="#a855f7"
          />
        )}

        {/* Suggestions Section */}

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              padding: '8px 18px', borderRadius: '100px', border: '1px solid', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s',
              background: activeCategory === cat ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'rgba(255,255,255,0.04)',
              borderColor: activeCategory === cat ? 'transparent' : 'rgba(255,255,255,0.1)',
              color: activeCategory === cat ? 'white' : 'rgba(255,255,255,0.6)',
            }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={{ ...product, onClick: setSelectedProduct }}
              onAddToCart={() => addToCart(product)}
              inCart={cart.some(p => p.id === product.id)}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '5rem', color: 'rgba(255,255,255,0.4)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <p>No products found. Try a different search, category, or price range.</p>
          </div>
        )}
      </div>

      {/* Cart Sidebar Overlay */}
      {isCartOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', justifyContent: 'flex-end' }}>
           <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setIsCartOpen(false)} />
           <div style={{ position: 'relative', width: '400px', background: '#0d1117', height: '100%', borderLeft: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', animation: 'slideInRight 0.3s forwards' }}>
              <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ShoppingCart size={22} color="#a855f7" /> Your Cart
                </h2>
                <button onClick={() => setIsCartOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><X size={24} /></button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {cart.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginTop: '4rem' }}>
                    <ShoppingCart size={48} opacity={0.2} style={{ marginBottom: '1rem' }} />
                    <p>Your cart is empty.</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} style={{ display: 'flex', gap: '16px', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <img src={item.image} onError={(e) => { e.target.src = DEFAULT_IMAGE; }} style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }} alt={item.name} />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: 'white', lineHeight: 1.2 }}>{item.name}</h4>
                        <p style={{ margin: '0 0 10px 0', color: '#a855f7', fontWeight: 700, fontSize: '0.9rem' }}>₹{item.price.toLocaleString('en-IN')}</p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                           <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                             <button onClick={() => removeFromCart(item.id)} style={{ padding: '4px 10px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>-</button>
                             <span style={{ fontSize: '0.85rem', fontWeight: 600, width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                             <button onClick={() => addToCart(item)} style={{ padding: '4px 10px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>+</button>
                           </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: 'white', fontSize: '1.2rem', fontWeight: 800 }}>
                    <span>Total</span>
                    <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                  {checkoutSuccess ? (
                    <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', textAlign: 'center', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <Check size={20} /> Purchase Successful! Added to CRM.
                    </div>
                  ) : (
                    <button 
                      onClick={handleCheckout}
                      disabled={isCheckingOut}
                      style={{ 
                        width: '100%', padding: '16px', borderRadius: '14px', border: 'none', 
                        background: isCheckingOut ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #7c3aed, #a855f7)', 
                        color: isCheckingOut ? 'rgba(255,255,255,0.5)' : 'white', fontSize: '1rem', fontWeight: 800, cursor: isCheckingOut ? 'not-allowed' : 'pointer', 
                        boxShadow: isCheckingOut ? 'none' : '0 4px 20px rgba(168,85,247,0.4)' 
                      }}>
                      {isCheckingOut ? 'Processing...' : 'Buy'}
                    </button>
                  )}
                </div>
              )}
           </div>
        </div>
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onAddToCart={() => addToCart(selectedProduct)}
          inCart={cart.some(p => p.id === selectedProduct.id)}
        />
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}} />
    </div>
  );
};

// ─────────────────────────────────────────────
// Product Type Selector (Hardware vs Software)
// ─────────────────────────────────────────────
const ProductTypeSelector = ({ user, onSelect, onLogout }) => (
  <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0d1117 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', flexDirection: 'column', gap: '2rem' }}>
    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '0.5rem' }}>
        <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)' }}>
          <Sparkles size={24} color="white" fill="white" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '1.8rem', fontWeight: 800, color: 'white' }}>
          <span>Aura</span><span style={{ color: '#a855f7' }}>Store</span>
        </div>
      </div>
      <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem' }}>Welcome, <strong style={{ color: 'white' }}>{user.name.split(' ')[0]}</strong> 👋 — What are you shopping for today?</p>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', width: '100%', maxWidth: '700px' }}>
      {/* Hardware Card */}
      <button onClick={() => onSelect('hardware')} style={{
        background: 'rgba(255,255,255,0.04)', border: '2px solid rgba(255,255,255,0.1)', borderRadius: '24px',
        padding: '3rem 2rem', cursor: 'pointer', color: 'white', display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '1.5rem', transition: 'all 0.3s',
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(168,85,247,0.6)'; e.currentTarget.style.background = 'rgba(168,85,247,0.08)'; e.currentTarget.style.transform = 'translateY(-6px)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.transform = 'none'; }}
      >
        <div style={{ width: 80, height: 80, borderRadius: '20px', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Package size={40} color="white" />
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Hardware Products</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.5 }}>Phones, Laptops, Tablets,<br/>Audio, Gaming & 100+ devices</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', borderRadius: '12px', padding: '10px 28px', fontSize: '0.95rem', fontWeight: 700, boxShadow: '0 4px 16px rgba(168,85,247,0.4)' }}>Browse Hardware →</div>
      </button>

      {/* Software Card */}
      <button onClick={() => onSelect('software')} style={{
        background: 'rgba(255,255,255,0.04)', border: '2px solid rgba(255,255,255,0.1)', borderRadius: '24px',
        padding: '3rem 2rem', cursor: 'pointer', color: 'white', display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '1.5rem', transition: 'all 0.3s',
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(6,182,212,0.6)'; e.currentTarget.style.background = 'rgba(6,182,212,0.08)'; e.currentTarget.style.transform = 'translateY(-6px)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.transform = 'none'; }}
      >
        <div style={{ width: 80, height: 80, borderRadius: '20px', background: 'linear-gradient(135deg, #0891b2, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Cpu size={40} color="white" />
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Software Products</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.5 }}>CRM, DevOps, Analytics,<br/>Security, HR & 40+ SaaS tools</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #0891b2, #06b6d4)', borderRadius: '12px', padding: '10px 28px', fontSize: '0.95rem', fontWeight: 700, boxShadow: '0 4px 16px rgba(6,182,212,0.4)' }}>Browse Software →</div>
      </button>
    </div>

    <button onClick={onLogout} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', cursor: 'pointer', marginTop: '1rem' }}>← Logout</button>
  </div>
);

// ─────────────────────────────────────────────
// Software Catalog
// ─────────────────────────────────────────────
const SoftwareCatalog = ({ user, onBack, onLogout }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => { fetchProducts(); fetchCart(); fetchTopProducts(); }, [activeCategory, search]);

  const fetchTopProducts = async () => {
    try {
      const res = await fetch('/api/store/top-products');
      const data = await res.json();
      if (data.success) setTopProducts(data.software);
    } catch (e) {
      console.error("Failed to fetch top products", e);
    }
  };

  const fetchProducts = async () => {
    const params = new URLSearchParams();
    if (activeCategory !== 'All') params.set('category', activeCategory);
    if (search) params.set('search', search);
    const res = await fetch(`/api/store/software-products?${params}`);
    const data = await res.json();
    if (data.success) { setProducts(data.products); setCategories(['All', ...new Set(data.categories.filter(c => c !== 'All'))]); }
  };

  const fetchCart = async () => {
    const res = await fetch(`/api/store/cart?email=${user.email}`);
    const data = await res.json();
    if (data.success) setCart(data.cart.filter(i => i.id >= 200));
  };

  const addToCart = async (product) => {
    const res = await fetch('/api/store/cart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: user.email, productId: product.id, action: 'add' }) });
    const data = await res.json();
    if (data.success) setCart(data.cart.filter(i => i.id >= 200));
  };

  const removeFromCart = async (productId) => {
    const res = await fetch('/api/store/cart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: user.email, productId, action: 'remove' }) });
    const data = await res.json();
    if (data.success) setCart(data.cart.filter(i => i.id >= 200));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const CYAN = '#06b6d4';

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const res = await fetch('/api/store/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      });
      const data = await res.json();
      if (data.success) {
        setCheckoutSuccess(true);
        fetchCart();
        setTimeout(() => {
          setCheckoutSuccess(false);
          setIsCartOpen(false);
        }, 3000);
      }
    } catch (e) {
      console.error("Checkout failed", e);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0f23 0%, #071a26 50%, #0d1117 100%)', color: 'white' }}>
      <header style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 2rem', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(20px)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '10px', padding: '8px 12px', color: 'white', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}><ArrowLeft size={14} /> Back</button>
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'linear-gradient(135deg, #0891b2, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Cpu size={18} color="white" /></div>
            <span style={{ fontSize: '1.3rem', fontWeight: 800 }}>Aura<span style={{ color: CYAN }}>Software</span></span>
          </div>
          <div style={{ flex: 1, maxWidth: '500px', margin: '0 2rem', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search CRM, DevOps, Analytics…" style={{ width: '100%', padding: '10px 16px 10px 42px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div onClick={() => setIsCartOpen(true)} style={{ position: 'relative', background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <ShoppingCart size={18} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{cart.reduce((s, i) => s + i.quantity, 0)}</span>
              {cart.length > 0 && <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', borderRadius: '50%', background: CYAN }} />}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #0891b2, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>{user.name.charAt(0).toUpperCase()}</div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.name}</span>
              <button onClick={onLogout} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '8px', padding: '6px 12px', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', cursor: 'pointer' }}>Logout</button>
            </div>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, margin: '0 0 0.5rem 0', background: 'linear-gradient(135deg, white, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>40+ Premium Software</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem' }}>Top SaaS & B2B tools — curated for you, {user.name.split(' ')[0]} 🚀</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
          {[{ label: 'Software Products', value: '40+', icon: '💻' }, { label: 'Categories', value: (categories.length - 1) + '', icon: '🗂️' }, { label: 'In Your Cart', value: cart.reduce((s, i) => s + i.quantity, 0) + '', icon: '🛒' }].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{s.icon}</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: CYAN }}>{s.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Top Recommendations */}
        {activeCategory === 'All' && !search && (
          <TopSellerStrip 
            title="Top 10 Trending Software" 
            products={topProducts} 
            onProductClick={setSelectedProduct}
            onAddToCart={addToCart}
            cart={cart}
            accentColor={CYAN}
          />
        )}

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: '8px 18px', borderRadius: '100px', border: '1px solid', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s', background: activeCategory === cat ? 'linear-gradient(135deg, #0891b2, #06b6d4)' : 'rgba(255,255,255,0.04)', borderColor: activeCategory === cat ? 'transparent' : 'rgba(255,255,255,0.1)', color: activeCategory === cat ? 'white' : 'rgba(255,255,255,0.6)' }}>{cat}</button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {products.map(product => (
            <ProductCard key={product.id} product={{ ...product, onClick: setSelectedProduct }} onAddToCart={() => addToCart(product)} inCart={cart.some(p => p.id === product.id)} accentColor={CYAN} />
          ))}
        </div>
      </div>

      {isCartOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setIsCartOpen(false)} />
          <div style={{ position: 'relative', width: '400px', background: '#0d1117', height: '100%', borderLeft: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}><ShoppingCart size={22} color={CYAN} /> Software Cart</h2>
              <button onClick={() => setIsCartOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cart.length === 0 ? <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginTop: '4rem' }}><p>Your software cart is empty.</p></div>
                : cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '16px', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <img src={item.image} onError={e => { e.target.src = DEFAULT_IMAGE; }} style={{ width: '76px', height: '76px', borderRadius: '12px', objectFit: 'cover' }} alt={item.name} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: 'white', lineHeight: 1.2 }}>{item.name}</h4>
                      <p style={{ margin: '0 0 10px 0', color: CYAN, fontWeight: 700, fontSize: '0.9rem' }}>₹{item.price.toLocaleString('en-IN')}/yr</p>
                      <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', width: 'fit-content' }}>
                        <button onClick={() => removeFromCart(item.id)} style={{ padding: '4px 10px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>-</button>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                        <button onClick={() => addToCart(item)} style={{ padding: '4px 10px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>+</button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            {cart.length > 0 && (
              <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: 'white', fontSize: '1.2rem', fontWeight: 800 }}><span>Total</span><span>₹{cartTotal.toLocaleString('en-IN')}/yr</span></div>
                {checkoutSuccess ? (
                  <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', textAlign: 'center', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Check size={20} /> Purchase Successful! Added to CRM.
                  </div>
                ) : (
                  <button 
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    style={{ 
                      width: '100%', padding: '16px', borderRadius: '14px', border: 'none', 
                      background: isCheckingOut ? 'rgba(255,255,255,0.1)' : `linear-gradient(135deg, #0891b2, ${CYAN})`, 
                      color: isCheckingOut ? 'rgba(255,255,255,0.5)' : 'white', fontSize: '1rem', fontWeight: 800, cursor: isCheckingOut ? 'not-allowed' : 'pointer',
                      boxShadow: isCheckingOut ? 'none' : '0 4px 16px rgba(6,182,212,0.4)'
                    }}>
                    {isCheckingOut ? 'Processing...' : 'Buy'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          detailsApiPath={`/api/store/software-product-details/${selectedProduct.id}`}
          accentColor={CYAN}
          onAddToCart={() => addToCart(selectedProduct)}
          inCart={cart.some(p => p.id === selectedProduct.id)}
        />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// Main BuyProducts Page
// ─────────────────────────────────────────────
export default function BuyProducts() {
  const [user, setUser] = useState(null);
  const [productType, setProductType] = useState(null); // null | 'hardware' | 'software'
  const [sfError, setSfError] = useState('');

  useEffect(() => {
    // Handle Salesforce OAuth callback redirect
    const params = new URLSearchParams(window.location.search);
    const sfuser = params.get('sfuser');
    const error = params.get('error');
    if (sfuser) {
      try {
        const userData = JSON.parse(decodeURIComponent(sfuser));
        setUser(userData);
        // Clean up the URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (e) {
        setSfError('Failed to parse Salesforce user data.');
      }
    } else if (error === 'auth_failed') {
      setSfError('Salesforce login failed. Please try again.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleLogout = () => { setUser(null); setProductType(null); };
  const handleBack = () => setProductType(null);

  if (!user) return <AuthPanel onAuth={setUser} sfError={sfError} />;
  if (!productType) return <ProductTypeSelector user={user} onSelect={setProductType} onLogout={handleLogout} />;
  if (productType === 'software') return <SoftwareCatalog user={user} onBack={handleBack} onLogout={handleLogout} />;
  return <ProductCatalog user={user} onLogout={handleLogout} onBack={handleBack} />;
}
