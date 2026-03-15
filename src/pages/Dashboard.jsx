import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import SalesInsightsEngine from '../components/SalesInsightsEngine';
import AccountSummarizer from '../components/modules/AccountSummarizer';
import OpportunityAnalyzer from '../components/modules/OpportunityAnalyzer';
import EmailGenerator from '../components/modules/EmailGenerator';
import ProposalGenerator from '../components/modules/ProposalGenerator';
import DealSuccessPredictor from '../components/features/DealSuccessPredictor';
import CustomerEmotionAnalyzer from '../components/features/CustomerEmotionAnalyzer';
import SalesCoach from '../components/features/SalesCoach';
import OpportunityHeatmap from '../components/features/OpportunityHeatmap';
import SmartFollowUpScheduler from '../components/features/SmartFollowUpScheduler';
import RelationshipTimeline from '../components/features/RelationshipTimeline';
import DealHistoryView from '../components/features/DealHistoryView';
import GlobalSchedules from '../components/modules/GlobalSchedules';
import InboxViewer from '../components/modules/InboxViewer';
import CustomerLobby from '../components/CustomerLobby';
import Chatbot from '../components/Chatbot';
import VoiceAssistant from '../components/VoiceAssistant';
import { useToast } from '../components/Toast';
import { Menu, ArrowLeft, Sun, Moon } from 'lucide-react';
import { useTheme } from '../components/ThemeContext';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('inbox');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [voiceAction, setVoiceAction] = useState(null);
  const { isDarkMode, toggleTheme } = useTheme();
  const { addToast } = useToast();

  const handleUpdateCustomer = (updatedData) => {
    setSelectedCustomer(prev => ({ ...prev, ...updatedData }));
  };

  const handleVoiceCommand = (intent) => {
    console.log("Dashboard received voice command:", intent);
    switch (intent.action) {
      case 'SHOW_ACTIVE_USERS':
        setSelectedCustomer(null);
        break;
      case 'SEND_EMAIL':
        if (selectedCustomer) {
           setActiveTab('email');
           setVoiceAction({ type: 'SEND_EMAIL', timestamp: Date.now() });
        } else {
           addToast("Please open a customer profile first to send an email.", "warning");
        }
        break;
      case 'CHANGE_EMAIL_TONE':
        if (selectedCustomer) {
           setActiveTab('email');
           if (intent.target) {
             setVoiceAction({ type: 'CHANGE_EMAIL_TONE', tone: intent.target, timestamp: Date.now() });
             addToast(`Updating email tone to ${intent.target}...`, "info");
           }
        } else {
           addToast("Please open a customer profile first.", "warning");
        }
        break;
      case 'OPEN_INBOX':
        if (selectedCustomer) {
          setActiveTab('inbox');
        } else {
          addToast("Please select a customer first to open their Inbox.", "warning");
        }
        break;
      case 'OPEN_MODULE':
        if (selectedCustomer && intent.target && intent.target !== 'globalSchedules') {
          // List of valid tabs to prevent errors
          const validTabs = ['insights', 'inbox', 'account', 'opportunity', 'dealHistory', 'email', 'proposal', 'deals', 'emotion', 'coach', 'heatmap', 'scheduler', 'timeline'];
          if (validTabs.includes(intent.target)) {
            setActiveTab(intent.target);
            addToast(`Opened ${intent.target.charAt(0).toUpperCase() + intent.target.slice(1)}`, "success");
          } else {
            addToast("Unknown module requested by voice.", "error");
          }
        } else if (intent.target === 'globalSchedules' || (intent.target === 'scheduler' && !selectedCustomer)) {
           // Global schedules can be opened without a customer selected (if we want, but wait, the Dashboard requires a selectedCustomer to render the Sidebar/tabs right now.)
           // Actually, GlobalSchedules requires a selectedCustomer frame to be rendered because it's inside mainContent.
           // However, let's just allow it if a customer is selected, OR we need to rethink CustomerLobby.
           // The user's screenshot had "TechNova India" selected but they wanted to view schedules.
           setActiveTab('globalSchedules');
           addToast("Opened Global Schedules", "success");
        } else {
           addToast("Please open a customer profile first to view this tool.", "warning");
        }
        break;
      case 'TOGGLE_THEME':
        toggleTheme();
        addToast(`Switched to ${isDarkMode ? 'light' : 'dark'} mode`, "success");
        break;
      case 'TOGGLE_CHATBOT':
        window.dispatchEvent(new CustomEvent('toggle-chatbot', { detail: intent.target }));
        addToast("Toggling Aura Assistant...", "success");
        break;
      case 'LOGOUT':
        addToast("Logging out...", "success");
        setTimeout(() => window.location.reload(), 1500);
        break;
      case 'SELECT_CUSTOMER':
        addToast("Please return to the Customer Lobby to search for a new client by voice.", "info");
        setSelectedCustomer(null);
        break;
      default:
        console.log("Unhandled intent action:", intent.action);
        addToast("Command partially understood but not actionable.", "warning");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'insights': return <SalesInsightsEngine customer={selectedCustomer} onActionClick={setActiveTab} onUpdateCustomer={handleUpdateCustomer} />;
      case 'inbox': return <InboxViewer customer={selectedCustomer} />;
      case 'account': return <AccountSummarizer customer={selectedCustomer} />;
      case 'opportunity': return <OpportunityAnalyzer customer={selectedCustomer} />;
      case 'dealHistory': return <DealHistoryView customer={selectedCustomer} />;
      case 'email': return <EmailGenerator customer={selectedCustomer} voiceAction={voiceAction} clearVoiceAction={() => setVoiceAction(null)} />;
      case 'proposal': return <ProposalGenerator customer={selectedCustomer} />;
      case 'deals': return <DealSuccessPredictor customer={selectedCustomer} />;
      case 'emotion': return <CustomerEmotionAnalyzer customer={selectedCustomer} />;
      case 'coach': return <SalesCoach customer={selectedCustomer} />;
      case 'heatmap': return <OpportunityHeatmap customer={selectedCustomer} />;
      case 'scheduler': return <SmartFollowUpScheduler customer={selectedCustomer} />;
      case 'timeline': return <RelationshipTimeline customer={selectedCustomer} />;
      case 'globalSchedules': return <GlobalSchedules />;
      default: return <SalesInsightsEngine customer={selectedCustomer} onActionClick={setActiveTab} onUpdateCustomer={handleUpdateCustomer} />;
    }
  };

  let mainContent;

  if (!selectedCustomer) {
    mainContent = <CustomerLobby onSelectCustomer={setSelectedCustomer} />;
  } else {
    mainContent = (
      <div className="dashboard-layout bg-ivory">
        <header className="dashboard-header">
          <div className="header-left">
            <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="header-logo logo-text">
              Aura<span className="text-accent">CRM</span>
            </div>
          </div>

          <div className="header-center animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="client-status-dot"></div>
            <span className="header-client-name" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {selectedCustomer.name}
              {(selectedCustomer.customerType === 'new' || !selectedCustomer.dealHistory || selectedCustomer.dealHistory.length === 0) ? (
                <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '4px 8px', borderRadius: '6px', background: 'rgba(52,152,219,0.15)', color: '#2980b9', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  ✨ New Customer
                </span>
              ) : (
                <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '4px 8px', borderRadius: '6px', background: 'rgba(212,168,67,0.15)', color: '#d4a843', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  ⭐ Existing Customer
                </span>
              )}
            </span>
          </div>
          
          <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <VoiceAssistant onCommand={handleVoiceCommand} />
            <button 
              onClick={toggleTheme} 
              className="theme-toggle-btn" 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', borderRadius: '50%', background: 'transparent', color: 'var(--color-dark-charcoal)', border: 'none', cursor: 'pointer' }}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isOpen={sidebarOpen} 
          setIsOpen={setSidebarOpen} 
          customer={selectedCustomer}
          onSwitchCustomer={() => {
            setSelectedCustomer(null);
            setActiveTab('inbox'); // Reset back to default (inbox) for next customer
          }}
        />

        <main className="dashboard-main animate-fade-in">
          <div className="dashboard-content">
            {renderContent()}
          </div>
        </main>

        <Chatbot customer={selectedCustomer} />
      </div>
    );
  }

  return mainContent;
};

export default Dashboard;
