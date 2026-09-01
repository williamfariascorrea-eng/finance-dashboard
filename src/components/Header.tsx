import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useFinanceStore } from '../context/store';
import { toISODate } from '../utils/money';

const PERIODOS = [
  { label: 'Todos', value: null },
  { label: '30 dias', value: '30d' },
  { label: '90 dias', value: '90d' },
  { label: 'Este ano', value: 'ano' },
];

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

function formatRangeLabel(range: { start: string; end: string } | null): string {
  if (!range) return 'Todo o histórico';
  const formatDate = (iso: string) => {
    const [, m, d] = iso.split('-');
    return `${d}/${m}`;
  };
  return `${formatDate(range.start)} – ${formatDate(range.end)}`;
}

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { searchQuery, setSearchQuery, dateFilter, setDateFilter } = useFinanceStore();

  const activePeriod = useMemo(() => {
    if (dateFilter === null) return 'Todos';
    const startYear = dateFilter.start.slice(0, 4);
    const endYear = dateFilter.end.slice(0, 4);
    if (startYear === endYear && dateFilter.start.endsWith('01-01')) return 'Este ano';
    const start = new Date(dateFilter.start);
    const end = new Date(dateFilter.end);
    const days = Math.round((end.getTime() - start.getTime()) / 86400000);
    return days <= 31 ? '30 dias' : '90 dias';
  }, [dateFilter]);

  const handlePeriodChange = (periodo: string | null) => {
    if (periodo === null) {
      setDateFilter(null);
      return;
    }

    const agora = new Date();
    const dataFim = toISODate(agora);
    const start = new Date(agora);

    if (periodo === '30d') start.setDate(start.getDate() - 30);
    if (periodo === '90d') start.setDate(start.getDate() - 90);
    if (periodo === 'ano') start.setMonth(0, 1);

    setDateFilter({ start: toISODate(start), end: dataFim });
  };

  return (
    <header className="header">
      <div className="header__intro">
        <span className="eyebrow">EXECUTIVE FINANCE</span>
        <h1>Controle financeiro com sinal claro de desempenho.</h1>
        <p>
          Painel para operação, previsibilidade e tomada de decisão, com todos os indicadores
          calculados em tempo real a partir dos seus lançamentos.
        </p>
        <div className="header__meta">
          <div className="header__meta-card">
            <span>JANELA ATIVA</span>
            <strong>{formatRangeLabel(dateFilter)}</strong>
          </div>
          <div className="header__meta-card">
            <span>RESPONSÁVEL</span>
            <strong>WILLIAM CORRÊA</strong>
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

        <div className="period-filter" role="group" aria-label="Filtrar por período">
          {PERIODOS.map((p) => (
            <button
              key={p.label}
              type="button"
              className={`period-btn ${activePeriod === p.label ? 'is-active' : ''}`}
              onClick={() => handlePeriodChange(p.value)}
              aria-pressed={activePeriod === p.label}
            >
              {p.label}
            </button>
          ))}
        </div>

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