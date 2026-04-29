import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import Sidebar from './components/Sidebar';
import { ThemeProvider } from './context/ThemeContext';
import Dashboard from './pages/Dashboard';
import Fluxo from './pages/Fluxo';
import Planejamento from './pages/Planejamento';
import Narrativas from './pages/Narrativas';
import Ajustes from './pages/Ajustes';
import './styles/global.css';
import './styles/pages.css';

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <div className="app-shell">
            <Sidebar />
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/fluxo" element={<Fluxo />} />
              <Route path="/planejamento" element={<Planejamento />} />
              <Route path="/narrativas" element={<Narrativas />} />
              <Route path="/ajustes" element={<Ajustes />} />
            </Routes>
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}