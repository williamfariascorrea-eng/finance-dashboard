import { useTheme } from '../context/ThemeContext';
import { useFinanceStore } from '../context/store';

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20l-4.2-4.2" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 10a5 5 0 1110 0v4l1.5 2.5h-13L7 14z" />
      <path d="M10 18a2 2 0 004 0" />
    </svg>
  );
}

function SunMoonIcon({ theme }: { theme: string }) {
  return theme === 'paper' ? (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 13.5A7.5 7.5 0 1110.5 4 6 6 0 0020 13.5z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.5M12 19.5V22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2 12h2.5M19.5 12H22M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
    </svg>
  );
}

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { searchQuery, setSearchQuery } = useFinanceStore();

  return (
    <header className="header">
      <div className="header__intro">
        <span className="eyebrow">Executive finance</span>
        <h1>Painel financeiro com leitura corporativa e sinal claro de desempenho.</h1>
        <p>
          Estrutura desenhada para operação, previsibilidade e tomada de decisão, com visual mais
          sólido e menos cara de template.
        </p>
        <div className="header__meta">
          <div className="header__meta-card">
            <span>Janela ativa</span>
            <strong>Abril 2026</strong>
          </div>
          <div className="header__meta-card">
            <span>Responsável</span>
            <strong>Controladoria</strong>
          </div>
        </div>
      </div>

      <div className="header__actions">
        <label className="search surface">
          <SearchIcon />
          <input
            type="text"
            placeholder="Buscar movimento ou categoria"
            aria-label="Buscar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </label>

        <button type="button" className="icon-button surface" aria-label="Notificações">
          <BellIcon />
        </button>

        <button
          type="button"
          className="theme-toggle surface"
          onClick={toggleTheme}
          aria-label={theme === 'paper' ? 'Alternar para modo escuro' : 'Alternar para modo claro'}
        >
          <SunMoonIcon theme={theme} />
          <span>{theme === 'paper' ? 'Modo escuro' : 'Modo claro'}</span>
        </button>
      </div>
    </header>
  );
}