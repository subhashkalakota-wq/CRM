import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check local storage for saved preference, else default to false (light mode)
    const savedTheme = localStorage.getItem('auracrm_theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    // Save to local storage
    localStorage.setItem('auracrm_theme', isDarkMode ? 'dark' : 'light');
    
    // Apply class to the body to globally flip CSS variables
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
