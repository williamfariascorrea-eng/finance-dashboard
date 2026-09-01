import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import Sidebar from './components/Sidebar';
import { ThemeProvider } from './context/ThemeContext';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import Fluxo from './pages/Fluxo';
import Planejamento from './pages/Planejamento';
import Narrativas from './pages/Narrativas';
import Ajustes from './pages/Ajustes';
import { ToastContainer } from './components/Toast';
import './styles/global.css';
import './styles/pages.css';
import './styles/welcome.css';

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route
              path="*"
              element={
                <div className="app-shell">
                  <Sidebar />
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/fluxo" element={<Fluxo />} />
                    <Route path="/planejamento" element={<Planejamento />} />
                    <Route path="/narrativas" element={<Narrativas />} />
                    <Route path="/ajustes" element={<Ajustes />} />
                  </Routes>
                  <ToastContainer />
                </div>
              }
            />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}