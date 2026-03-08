'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'purple' | 'light' | 'dark' | 'red';

type ThemeContextValue = {
  activeTheme: Theme;
  handleChange: (theme: Theme) => void;
  windowWidth: number;
  visitors: number;
  handleVisitor: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [activeTheme, setActiveTheme] = useState<Theme>('light');
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );
  const [visitors, setVisitors] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved) setActiveTheme(saved);
  }, []);

  useEffect(() => {
    document.body.className = '';
    document.body.classList.add(activeTheme);
  }, [activeTheme]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (theme: Theme) => {
    setActiveTheme(theme);
    localStorage.setItem('theme', theme);
  };

  const handleVisitor = () => {
    setVisitors((prev) => prev + 1);
  };

  return (
    <ThemeContext.Provider value={{ activeTheme, handleChange, windowWidth, visitors, handleVisitor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

export type { Theme };
