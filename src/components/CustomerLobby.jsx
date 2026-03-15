import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Building2, ChevronRight, Loader2, Plus, X, Trash2, Inbox, Upload, LogOut } from 'lucide-react';
import { useToast } from './Toast';
import { useTheme } from './ThemeContext';
import { Sun, Moon } from 'lucide-react';
import GlobalInbox from './GlobalInbox';
import VoiceAssistant from './VoiceAssistant';
import Chatbot from './Chatbot';
import * as XLSX from 'xlsx';

const CustomerLobby = ({ onSelectCustomer }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGlobalInbox, setShowGlobalInbox] = useState(false);
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [domainSearchQuery, setDomainSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    role: '',
    phone: '',
    productInterest: '',
    software: '',
    status: 'Active'
  });
  const { addToast } = useToast();
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/customers');
      const data = await res.json();
      if (data.success) {
        setCustomers(data.data);
      }
    } catch (err) {
      console.error(err);
      addToast("Failed to connect to backend", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const handleDeleteCustomer = async (e, id, name) => {
    e.stopPropagation(); // Prevent card click trigger
    if (!window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/customers/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setCustomers(customers.filter(c => c.id !== id));
        addToast("Customer deleted successfully", "success");
      } else {
        addToast(data.message || "Failed to delete customer", "error");
      }
    } catch (err) {
      console.error(err);
      addToast("Failed to connect to backend", "error");
    }
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();

    // Check for existing customer based on email or name
    const existing = customers.find(c => 
      (formData.email && c.email.toLowerCase() === formData.email.toLowerCase()) || 
      (formData.name && c.name.toLowerCase() === formData.name.toLowerCase())
    );

    if (existing) {
      addToast(`"${existing.name}" is already an existing customer. Opening their workspace...`, "info");
      setShowAddModal(false);
      onSelectCustomer(existing);
      setFormData({ name: '', contact: '', email: '', role: '', phone: '', productInterest: '', software: '', status: 'Active' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setCustomers([...customers, data.data]);
        setShowAddModal(false);
        addToast("Customer added successfully!", "success");
        setFormData({ name: '', contact: '', email: '', role: '', phone: '', productInterest: '', software: '', status: 'Active' });
      } else {
        addToast(data.message || "Failed to add customer", "error");
      }
    } catch (err) {
      console.error(err);
      addToast("Failed to connect to backend", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = async (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        // Map spreadsheet columns to database keys
        const formattedData = data.map(row => ({
          name: row.Company || row.Name || row.company || row.name || '',
          contact: row.Contact || row.ContactName || row.contact || '',
          email: row.Email || row.email || '',
          role: row.Role || row.Title || row.role || 'Executive',
          phone: row.Phone || row.phone || '',
          software: row.Software || row.product || 'Core Platform',
          productInterest: row.ProductInterest || row.Interest || row.productInterest || 'General AI Suite',
          status: row.Status || row.status || 'In Pipeline',
          summary: row.Summary || row.Description || row.summary || ''
        }));

        const res = await fetch('/api/customers/batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customers: formattedData })
        });

        const result = await res.json();
        if (result.success) {
          addToast(`Successfully imported ${result.count} customers!`, "success");
          fetchCustomers(); // Refresh grid
        } else {
          addToast(result.message || "Failed to import dataset", "error");
        }
      } catch (err) {
        console.error(err);
        addToast("Error parsing or uploading file", "error");
      } finally {
        setIsUploading(false);
        // Reset file input
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };

    reader.readAsBinaryString(file);
  };

  const getFilteredCustomers = () => {
    let filtered = [...customers];
    
    switch(activeCategory) {
      case 'Active':
        return filtered.filter(c => c.status === 'Active');
      case 'At Risk':
        return filtered.filter(c => c.status === 'At Risk');
      case 'Pipeline':
        return filtered.filter(c => c.status === 'In Pipeline');
      case 'Recent':
        // Just reverse the array to simulate a "recently contacted" sort for now
        return filtered.slice().reverse();
      case 'Domain':
        if (!domainSearchQuery) return filtered;
        return filtered.filter(c => {
          const query = domainSearchQuery.toLowerCase();
          const matchesName = c.name && c.name.toLowerCase().includes(query);
          const domain = c.email ? c.email.split('@')[1] : '';
          const matchesDomain = domain && domain.toLowerCase().includes(query);
          return matchesName || matchesDomain;
        });
      default:
        return filtered;
    }
  };

  const categories = ['All', 'Active', 'At Risk', 'Pipeline', 'Recent', 'Domain'];

  if (showGlobalInbox) {
    return <GlobalInbox onBack={() => setShowGlobalInbox(false)} />;
  }

  return (
    <div className="lobby-container bg-ivory animate-fade-in" style={{ minHeight: '100vh', padding: '3rem 2rem', position: 'relative' }}>
      
      {/* Top Right Actions Group */}
      <div style={{ position: 'absolute', top: '1.5rem', right: '2rem', display: 'flex', alignItems: 'center', gap: '12px', zIndex: 10 }}>
        <VoiceAssistant 
          extraContext={customers.map(c => `ID: ${c.id}, Name: ${c.name}, Contact: ${c.contact}`).join("; ")}
          onCommand={(intent) => {
           
           if (intent.action === 'OPEN_INBOX') {
               setShowGlobalInbox(true);
           } else if (intent.action === 'FILTER_CUSTOMERS' && intent.target) {
               const validCategories = ['All', 'Active', 'At Risk', 'Pipeline', 'Recent', 'Domain'];
               const matchedCategory = validCategories.find(c => c.toLowerCase() === intent.target.toLowerCase());
               
               if (matchedCategory) {
                 setActiveCategory(matchedCategory);
                 addToast(`Filtered by ${matchedCategory}`, "success");
               } else {
                 addToast(`I couldn't find a filter category called "${intent.target}"`, "warning");
               }
           } else if (intent.action === 'SELECT_CUSTOMER') {
               if (!intent.target || intent.target.toString().toLowerCase() === 'null' || intent.target === '') {
                 addToast("Please tell me which customer or company you'd like to open.", "warning");
                 return;
               }
               
               // The AI should now return the exact numeric ID of the matching customer
               const matchedCustomer = customers.find(c => String(c.id) === String(intent.target));
               
               if (matchedCustomer) {
                 addToast(`Opening workspace for ${matchedCustomer.name}...`, "success");
                 onSelectCustomer(matchedCustomer);
               } else {
                 addToast(`Couldn't find a customer matching your request.`, "error");
               }
           } else if (intent.action === 'TOGGLE_THEME') {
               toggleTheme();
               addToast(`Switched to ${isDarkMode ? 'light' : 'dark'} mode`, "success");
           } else if (intent.action === 'TOGGLE_CHATBOT') {
               window.dispatchEvent(new CustomEvent('toggle-chatbot', { detail: intent.target }));
               addToast("Toggling Aura Assistant...", "success");
           } else if (intent.action === 'LOGOUT') {
               addToast("Logging out...", "success");
               setTimeout(() => window.location.reload(), 1500);
           }
        }} />

        <button 
          onClick={toggleTheme} 
          style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            padding: '10px', borderRadius: '50%', background: 'var(--color-glass-bg)', 
            color: 'var(--color-dark-charcoal)', border: '1px solid var(--color-glass-border)', 
            cursor: 'pointer', boxShadow: 'var(--shadow-sm)'
          }}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Persistent Chatbot - Works without customer context */}
      <Chatbot />

      {/* Exit Dashboard Button */}
      <button 
        onClick={() => navigate('/')} 
        style={{ 
          position: 'absolute', top: '1.5rem', left: '2rem', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          padding: '10px 16px', borderRadius: '24px', background: 'var(--color-glass-bg)', 
          color: 'var(--color-dark-charcoal)', border: '1px solid var(--color-glass-border)', 
          cursor: 'pointer', boxShadow: 'var(--shadow-sm)', fontWeight: 600, zIndex: 10,
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-glass-surface)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-glass-bg)'; }}
        title="Exit Dashboard"
      >
        <LogOut size={18} />
        <span>Exit</span>
      </button>

      <div className="max-w-6xl mx-auto">
        <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--color-dark-charcoal)' }}>
            Select an Account
          </h1>
          <p className="text-muted" style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            Choose a customer profile to initialize the contextual AI Workspace.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button 
              className="btn flex-center"
              style={{ padding: '10px 20px', background: 'var(--color-glass-surface)', color: 'var(--color-dark-charcoal)', border: '1px solid var(--color-glass-border)', borderRadius: '12px', gap: '8px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
              onClick={() => setShowGlobalInbox(true)}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.8)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-glass-surface)'; }}
            >
              <Inbox size={18} style={{ color: '#3498db' }} />
              Global Inbox
            </button>
            <button 
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={18} />
              Add New Customer
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={handleFileUpload}
            />
            <button 
              className="btn flex-center"
              style={{ padding: '10px 20px', background: 'transparent', color: 'var(--color-dark-charcoal)', border: '1px solid var(--color-dark-charcoal)', borderRadius: '12px', gap: '8px', cursor: isUploading ? 'not-allowed' : 'pointer', fontWeight: 600, transition: 'all 0.2s', opacity: isUploading ? 0.7 : 1 }}
              onClick={() => fileInputRef.current?.click()}
              onMouseEnter={(e) => { if (!isUploading) e.currentTarget.style.background = 'rgba(43, 43, 43, 0.05)'; }}
              onMouseLeave={(e) => { if (!isUploading) e.currentTarget.style.background = 'transparent'; }}
              disabled={isUploading}
            >
              {isUploading ? <Loader2 size={18} className="spin" /> : <Upload size={18} />}
              {isUploading ? "Uploading..." : "Upload Dataset"}
            </button>
          </div>
        </header>

        {/* Filtering Tabs */}
        {!loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    if (cat !== 'Domain') setDomainSearchQuery('');
                  }}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '100px',
                    border: '1px solid',
                    borderColor: activeCategory === cat ? 'var(--color-accent)' : 'var(--color-glass-border)',
                    background: activeCategory === cat ? 'rgba(168, 142, 91, 0.1)' : 'var(--color-glass-surface)',
                    color: activeCategory === cat ? 'var(--color-accent)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    fontWeight: 600,
                    transition: 'all 0.2s ease',
                    fontSize: '0.9rem',
                    boxShadow: activeCategory === cat ? 'var(--shadow-sm)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (activeCategory !== cat) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.6)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeCategory !== cat) {
                      e.currentTarget.style.background = 'var(--color-glass-surface)';
                    }
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            {/* Domain Search Input */}
            {activeCategory === 'Domain' && (
              <div style={{ marginTop: '1.5rem', width: '100%', maxWidth: '400px', animation: 'fadeIn 0.3s ease' }}>
                <input
                  type="text"
                  placeholder="Search by company or domain (e.g., technova)..."
                  value={domainSearchQuery}
                  onChange={(e) => setDomainSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    border: '1px solid var(--color-glass-border)',
                    background: 'var(--color-glass-surface)',
                    color: 'var(--color-dark-charcoal)',
                    fontSize: '1rem',
                    outline: 'none',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--color-accent)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--color-glass-border)'}
                />
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="flex-center" style={{ height: '400px' }}>
            <Loader2 size={48} className="spin text-accent" />
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}>
            {getFilteredCustomers().map(c => (
              <div 
                key={c.id}
                className="glass-panel"
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '1.75rem',
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'var(--color-glass-bg)',
                  border: '1px solid var(--color-glass-border)',
                  borderRadius: '20px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.12)';
                  e.currentTarget.style.borderColor = 'var(--color-accent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
                  e.currentTarget.style.borderColor = 'var(--color-glass-border)';
                }}
                onClick={() => onSelectCustomer(c)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img 
                      src={c.avatar} 
                      alt={c.contact} 
                      style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 600 }}>{c.contact}</h3>
                      <p className="text-muted" style={{ fontSize: '0.85rem', margin: 0 }}>{c.role}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '0.6rem',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        background: (c.customerType === 'new' || !c.dealHistory || c.dealHistory.length === 0) ? '#3498db' : '#d4a843',
                        color: 'white',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        boxShadow: (c.customerType === 'new' || !c.dealHistory || c.dealHistory.length === 0) ? '0 2px 8px rgba(52, 152, 219, 0.3)' : '0 2px 8px rgba(212, 168, 67, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}>
                        {(c.customerType === 'new' || !c.dealHistory || c.dealHistory.length === 0) ? '✨ New' : '⭐ Existing'}
                      </span>
                      <span style={{
                        fontSize: '0.7rem',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        background: c.status === 'Active' ? 'rgba(46, 204, 113, 0.1)' : 
                                    c.status === 'At Risk' ? 'rgba(231, 76, 60, 0.1)' : 'rgba(52, 152, 219, 0.1)',
                        color: c.status === 'Active' ? '#27ae60' : 
                              c.status === 'At Risk' ? '#c0392b' : '#2980b9',
                        fontWeight: 700,
                        border: '1px solid currentColor'
                      }}>
                        {c.status}
                      </span>
                    </div>
                    <button 
                      className="delete-card-btn"
                      onClick={(e) => handleDeleteCustomer(e, c.id, c.name)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'rgba(231, 76, 60, 0.6)',
                        padding: '4px',
                        cursor: 'pointer',
                        borderRadius: '6px',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#e74c3c';
                        e.currentTarget.style.background = 'rgba(231, 76, 60, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'rgba(231, 76, 60, 0.6)';
                        e.currentTarget.style.background = 'transparent';
                      }}
                      title="Delete Account"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', color: 'var(--color-dark-charcoal)' }}>
                  <Building2 size={16} className="text-muted" />
                  <span style={{ fontWeight: 500 }}>{c.name}</span>
                </div>

                <div style={{ 
                  marginTop: 'auto', 
                  background: 'var(--color-ivory)', 
                  padding: '12px', 
                  borderRadius: '8px',
                  border: '1px solid var(--color-glass-border)',
                  fontSize: '0.85rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Interested in:</span>
                    <ChevronRight size={16} className="text-accent" />
                  </div>
                  <strong style={{ color: 'var(--color-dark-charcoal)', display: 'block', marginTop: '4px' }}>
                    {c.productInterest}
                  </strong>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div className="glass-panel" style={{
            width: '90%',
            maxWidth: '550px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2.5rem',
            borderRadius: '16px',
            position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid var(--color-glass-border)',
            background: 'var(--color-ivory)'
          }}>
            <button 
              onClick={() => setShowAddModal(false)}
              style={{ 
                position: 'absolute', top: '1.25rem', right: '1.25rem', 
                background: 'rgba(0,0,0,0.05)', border: 'none', 
                cursor: 'pointer', color: 'var(--color-dark-charcoal)',
                padding: '8px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; }}
            >
              <X size={20} />
            </button>
            <h2 style={{ marginBottom: '2rem', marginTop: 0, fontSize: '1.75rem', color: 'var(--color-dark-charcoal)', textAlign: 'center' }}>Add New Customer</h2>
            <form onSubmit={handleAddCustomer} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Company Name <span style={{color: '#e74c3c'}}>*</span></label>
                  <input required name="name" value={formData.name} onChange={handleInputChange} className="input-field" placeholder="e.g. Acme Corp" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-glass-border)', background: 'rgba(255,255,255,0.8)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Name <span style={{color: '#e74c3c'}}>*</span></label>
                  <input required name="contact" value={formData.contact} onChange={handleInputChange} pattern="[A-Za-z\s]+" title="Please enter a valid name (letters and spaces only)" className="input-field" placeholder="e.g. Jane Doe" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-glass-border)', background: 'rgba(255,255,255,0.8)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="input-field" placeholder="jane@acme.com" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-glass-border)', background: 'rgba(255,255,255,0.8)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Phone</label>
                  <input name="phone" value={formData.phone} onChange={handleInputChange} pattern="^\+?[0-9]{10,14}$" title="Please enter a valid phone number (10-14 digits, optional + at start)" className="input-field" placeholder="+1234567890" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-glass-border)', background: 'rgba(255,255,255,0.8)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Role</label>
                  <input name="role" value={formData.role} onChange={handleInputChange} className="input-field" placeholder="e.g. CTO" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-glass-border)', background: 'rgba(255,255,255,0.8)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="input-field" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-glass-border)', background: 'rgba(255,255,255,0.8)', appearance: 'auto' }}>
                    <option value="Active">Active</option>
                    <option value="In Pipeline">In Pipeline</option>
                    <option value="At Risk">At Risk</option>
                  </select>
                </div>
              </div>
              
              <div style={{ background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Current Software Context</label>
                  <input name="software" value={formData.software} onChange={handleInputChange} className="input-field" placeholder="What tools do they currently use?" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-glass-border)', background: 'rgba(255,255,255,0.8)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Product Interest</label>
                  <input name="productInterest" value={formData.productInterest} onChange={handleInputChange} className="input-field" placeholder="What Aura products are they evaluating?" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-glass-border)', background: 'rgba(255,255,255,0.8)' }} />
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-glass-border)' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn" style={{ background: 'transparent', color: 'var(--color-dark-charcoal)', border: '1px solid var(--color-glass-border)', padding: '0.75rem 1.5rem', fontWeight: 600 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ padding: '0.75rem 2rem', fontWeight: 600 }}>
                  {isSubmitting ? <Loader2 size={20} className="spin" /> : 'Save Customer Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerLobby;
