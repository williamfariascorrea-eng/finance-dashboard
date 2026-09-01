import { useNavigate } from 'react-router-dom';

function AppMark() {
  return (
    <svg viewBox="0 0 64 64" className="welcome__mark" aria-hidden="true">
      <rect x="4" y="4" width="56" height="56" fill="var(--accent)" />
      <path
        d="M16 40l10-4 4-14 6 22 6-14 6 2 6-14"
        stroke="var(--accent-strong)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome">
      <div className="welcome__bg-grid" aria-hidden="true" />
      <div className="welcome__glow" aria-hidden="true" />
      <div className="welcome__scanlines" aria-hidden="true" />

      <main className="welcome__inner">
        <header className="welcome__header">
          <AppMark />
          <p className="welcome__eyebrow">ATLAS CAPITAL</p>
          <h1 className="welcome__title">Painel de comando financeiro.</h1>
          <p className="welcome__subtitle">
            Visão clara do seu fluxo de caixa, custos e reservas — calculado em tempo real,
            sem planilha desencontrada.
          </p>
        </header>

        <div className="welcome__actions">
          <button
            type="button"
            className="welcome__cta"
            onClick={() => navigate('/dashboard')}
          >
            <span>ENTRAR NO PAINEL</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
          <p className="welcome__hint">Dashboard real, rodando direto no navegador</p>
        </div>

        <footer className="welcome__meta">
          <span>RESERVA 24%</span>
          <span>9 CATEGORIAS</span>
          <span>RUNWAY 1.345 DIAS</span>
        </footer>
      </main>
    </div>
  );
}