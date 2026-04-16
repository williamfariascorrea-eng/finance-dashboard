import { useState } from 'react';
import ExpensesChart from '../components/ExpensesChart';
import Header from '../components/Header';
import PerformanceDonut from '../components/PerformanceDonut';
import Sidebar from '../components/Sidebar';
import SummaryCard from '../components/SummaryCard';
import Transactions from '../components/Transactions';
import { monthlyExpenses, summaryCards, transactions } from '../data/mockData';

export default function Dashboard({ theme, onToggleTheme }) {
  const [filter, setFilter] = useState('all');

  const filteredTransactions =
    filter === 'all' ? transactions : transactions.filter((item) => item.type === filter);
  const entryCount = transactions.filter((item) => item.type === 'entrada').length;
  const exitCount = transactions.filter((item) => item.type === 'saida').length;

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-content">
        <Header theme={theme} onToggleTheme={onToggleTheme} />

        <section className="cards-grid">
          {summaryCards.map((card, index) => (
            <SummaryCard key={card.title} index={index + 1} {...card} />
          ))}
        </section>

        <section className="dashboard-grid">
          <ExpensesChart data={monthlyExpenses} />
          <aside className="insight-panel surface">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Cockpit executivo</span>
                <h2>Indicadores de controle</h2>
              </div>
            </div>

            <div className="insight-stack">
              <PerformanceDonut income={entryCount} outcome={exitCount} />

              <article className="insight-card insight-card--accent insight-card--metric">
                <span>Runway operacional</span>
                <strong>14 meses</strong>
                <p>Reservas atuais sustentam o patamar de custo fixo com margem de seguranca.</p>
              </article>

              <article className="insight-card insight-card--metric">
                <span>Movimentos monitorados</span>
                <strong>{filteredTransactions.length}</strong>
                <p>
                  {filter === 'all'
                    ? 'Volume consolidado dos registros visiveis no painel.'
                    : 'Volume de registros para o recorte selecionado.'}
                </p>
              </article>

              <article className="insight-split">
                <div>
                  <span>Entradas</span>
                  <strong>{entryCount}</strong>
                </div>
                <div>
                  <span>Saidas</span>
                  <strong>{exitCount}</strong>
                </div>
              </article>
            </div>
          </aside>
        </section>

        <Transactions items={filteredTransactions} filter={filter} onFilterChange={setFilter} />
      </main>
    </div>
  );
}
