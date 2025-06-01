// context/ThemeContext.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children }) => {
    const [activeTheme, setActiveTheme] = useState('light');
    const [windowWidth, setWindowWidth] = useState(
      typeof window !== 'undefined' ? window.innerWidth : 0
    );
    const [visitors, setVisitorrs] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) setActiveTheme(saved);
  }, []);

  useEffect(() => {
    document.body.className = "";
    document.body.classList.add(`${activeTheme}`);
  }, [activeTheme]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    // Immediately update in case component loads after resize
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (theme) => {
    setActiveTheme(theme);
  }

  const handleVisitor = () => {
    setVisitorrs((prev) => (prev+1));
  }

  return (
    <ThemeContext.Provider value={{ activeTheme, handleChange, windowWidth, visitors, handleVisitor }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for convenience
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
