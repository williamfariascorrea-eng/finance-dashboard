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

function SunMoonIcon({ theme }) {
  return theme === 'dark' ? (
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

export default function Header({ theme, onToggleTheme }) {
  return (
    <header className="header">
      <div>
        <span className="eyebrow">Visao geral</span>
        <h1>Controle seu dinheiro com contexto visual</h1>
        <p>Acompanhe saldo, entradas e saidas em um painel claro e objetivo.</p>
      </div>

      <div className="header__actions">
        <label className="search surface">
          <SearchIcon />
          <input type="text" placeholder="Buscar transacao" />
        </label>

        <button type="button" className="icon-button surface" aria-label="Notificacoes">
          <BellIcon />
        </button>

        <button
          type="button"
          className="theme-toggle surface"
          onClick={onToggleTheme}
          aria-label="Alternar tema"
        >
          <SunMoonIcon theme={theme} />
          <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
        </button>
      </div>
    </header>
  );
}
