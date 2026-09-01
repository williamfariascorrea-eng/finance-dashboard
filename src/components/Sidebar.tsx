import { NavLink } from 'react-router-dom';
import type { MenuItem } from '../types';

const menuItems: MenuItem[] = [
  { label: 'DASHBOARD', path: '/dashboard', active: true },
  { label: 'FLUXO', path: '/fluxo' },
  { label: 'PLANEJAMENTO', path: '/planejamento' },
  { label: 'NARRATIVAS', path: '/narrativas' },
  { label: 'AJUSTES', path: '/ajustes' },
];

function LogoIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <rect x="2" y="2" width="28" height="28" fill="var(--accent)" />
      <path d="M8 20h5l2-7 3 11 3-7h5" stroke="white" strokeWidth="2.5" fill="none" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.087.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.544 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" fill="currentColor"/>
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
            <strong>ATLAS CAPITAL</strong>
            <p>Finance Dashboard</p>
          </div>
        </div>

        <div className="sidebar__stamp">
          <span>VERSÃO</span>
          <strong>1.0.0</strong>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Navegação principal">
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path ?? '/'}
            className={({ isActive }) => `sidebar__link ${isActive ? 'is-active' : ''}`}
          >
            <span className="sidebar__dot" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__promo">
        <span>PROJETO</span>
        <strong>OPEN FINANCE</strong>
        <p>Dashboard financeiro moderno com métricas avançadas e controle total.</p>
      </div>

      <div className="sidebar__footer">
        <p>Desenvolvido por <strong>William Corrêa</strong></p>
        <a 
          href="https://github.com/williamfariascorrea-eng/finance-dashboard" 
          target="_blank" 
          rel="noopener noreferrer"
          className="sidebar__link"
          style={{ textDecoration: 'none' }}
        >
          <GitHubIcon />
          Ver no GitHub
        </a>
      </div>
    </aside>
  );
}