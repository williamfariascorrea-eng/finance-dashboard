const menuItems = [
  { label: 'Dashboard', active: true },
  { label: 'Fluxo' },
  { label: 'Planejamento' },
  { label: 'Narrativas' },
  { label: 'Ajustes' },
];

function LogoIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <rect x="4" y="4" width="40" height="40" rx="14" />
      <path d="M15 29.5h7l3-11 4 16 4-11h0" />
    </svg>
  );
}

export default function Sidebar() {
  return (
    <aside className="sidebar surface">
      <div className="sidebar__top">
        <div className="brand">
          <div className="brand__icon">
            <LogoIcon />
          </div>
          <div>
            <strong>Atlas Capital</strong>
            <p>Control tower</p>
          </div>
        </div>

        <div className="sidebar__stamp">
          <span>Modo curadoria</span>
          <strong>Q2</strong>
        </div>
      </div>

      <nav className="sidebar__nav">
        {menuItems.map((item) => (
          <button
            key={item.label}
            type="button"
            className={`sidebar__link ${item.active ? 'is-active' : ''}`}
          >
            <span className="sidebar__dot" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar__promo">
        <span>Resumo do conselho</span>
        <strong>Liquidez controlada</strong>
        <p>Receita recorrente sustenta o caixa e reduz exposicao de curto prazo.</p>
      </div>

      <div className="sidebar__footer">
        <p>Atualizado ha 4 minutos</p>
        <button type="button" className="sidebar__ghost">
          Exportar snapshot
        </button>
      </div>
    </aside>
  );
}
