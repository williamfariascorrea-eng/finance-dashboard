import { useEffect, useState } from 'react';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [theme, setTheme] = useState('paper');

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
    <Dashboard
      theme={theme}
      onToggleTheme={() => setTheme((current) => (current === 'paper' ? 'night' : 'paper'))}
    />
  );
}
