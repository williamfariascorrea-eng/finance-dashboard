const menuItems = [
  { label: 'Dashboard', active: true },
  { label: 'Carteiras' },
  { label: 'Metas' },
  { label: 'Relatorios' },
  { label: 'Configuracoes' },
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
      <div className="brand">
        <div className="brand__icon">
          <LogoIcon />
        </div>
        <div>
          <strong>Finance Flow</strong>
          <p>Painel financeiro</p>
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
        <span>Performance</span>
        <strong>83%</strong>
        <p>Seu fluxo esta mais saudavel que no ultimo mes.</p>
      </div>
    </aside>
  );
}
