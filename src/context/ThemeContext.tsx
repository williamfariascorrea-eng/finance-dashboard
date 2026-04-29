import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useFinanceStore } from './store';

interface ThemeContextType {
  theme: 'paper' | 'night';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme, toggleTheme } = useFinanceStore();

  useEffect(() => {
    const root = document?.documentElement;
    const body = document?.body;

    if (root) {
      root.dataset.theme = theme;
    }

    if (body) {
      body.classList.toggle('night', theme === 'night');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}