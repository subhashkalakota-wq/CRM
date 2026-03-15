import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import BuyProducts from './pages/BuyProducts';
import { ToastProvider } from './components/Toast';
import { ThemeProvider } from './components/ThemeContext';
import InteractiveBackground from './components/InteractiveBackground';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <div className="app" style={{ position: 'relative' }}>
            <InteractiveBackground />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/store" element={<BuyProducts />} />
              </Routes>
            </div>
          </div>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
