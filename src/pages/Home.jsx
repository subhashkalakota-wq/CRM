import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import FeatureHighlights from '../components/FeatureHighlights';
import EfficiencyComparison from '../components/EfficiencyComparison';
import ArchitectureVisualizer from '../components/ArchitectureVisualizer';
import { Sun, Moon, ShoppingCart, Sparkles } from 'lucide-react';
import { useTheme } from '../components/ThemeContext';
import './Home.css';

const Home = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-page animate-fade-in">
      <header className="home-header glass-panel">
        <div className="container header-content">
          <div className="logo">
            <div className="logo-mark">
              <Sparkles size={18} color="white" fill="white" />
            </div>
            <div className="logo-type">
              <span className="logo-aura">Aura</span>
              <span className="logo-crm">CRM</span>
              <span className="logo-tag">Base</span>
            </div>
          </div>
          <nav className="header-nav" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#efficiency">Efficiency</a>
            
            <button 
              onClick={toggleTheme} 
              style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                padding: '8px', borderRadius: '50%', background: 'transparent', 
                color: 'var(--color-dark-charcoal)', border: 'none', cursor: 'pointer' 
              }}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <a href="/store" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '30px', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem' }}>
              <ShoppingCart size={18} /> Buy Products
            </a>
            <a href="/dashboard" className="btn-primary" style={{ padding: '8px 20px' }}>Login</a>
          </nav>
        </div>
      </header>

      <main>
        <Hero />
        <div className="reveal">
          <FeatureHighlights />
        </div>
        <div className="reveal">
          <EfficiencyComparison />
        </div>
        <div className="reveal">
          <ArchitectureVisualizer />
        </div>
      </main>

      <footer className="home-footer">
        <div className="container">
          <p>&copy; 2026 AuraCRM Base. Designed for AI-Powered Sales.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
