import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import './Hero.css';

const Hero = () => {

  return (
    <section className="hero-section container">
      <div className="hero-content">
        <div className="hero-badge animate-fade-in">
          <Sparkles size={16} className="text-accent" />
          <span>Powered by Agentforce AI</span>
        </div>
        
        <h1 className="hero-title animate-fade-in delay-1">
          Next-Generation AI Sales Assistant for <span className="text-accent">CRM</span>
        </h1>
        
        <p className="hero-description animate-fade-in delay-2">
          Transform your sales pipeline with intelligent insights. AuraCRM Base analyzes your customer data, predicts deal success, and acts as your personal AI sales coach in real-time.
        </p>
        
        <div className="hero-actions animate-fade-in delay-3">
          <a href="/dashboard" className="btn-accent">
            Open AI Dashboard <ArrowRight size={20} />
          </a>
        </div>
      </div>
      
      <div className="hero-visual animate-fade-in delay-2" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg" 
          alt="Salesforce Logo" 
          style={{ width: '80%', maxWidth: '500px', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.1))' }} 
        />
      </div>


    </section>
  );
};

export default Hero;
