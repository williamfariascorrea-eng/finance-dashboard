import { useMemo, useState } from 'react';
import { useFinanceStore } from '../context/store';
import { useAdvancedMetrics } from '../utils/advancedMetrics';
import AddTransactionModal from '../components/AddTransactionModal';
import ExpensesChart from '../components/ExpensesChart';
import Header from '../components/Header';
import PerformanceDonut from '../components/PerformanceDonut';
import SummaryCard from '../components/SummaryCard';
import Transactions from '../components/Transactions';

export default function Dashboard() {
  const { filter, setFilter, searchQuery, transactions, summaryCards, monthlyExpenses } = useFinanceStore();
  const [modalOpen, setModalOpen] = useState(false);

  const metrics = useAdvancedMetrics(transactions);

  const filteredTransactions = useMemo(() => {
    let result = transactions;
    
    if (filter !== 'all') {
      result = result.filter((item) => item.type === filter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [filter, searchQuery, transactions]);

  const entryCount = useMemo(
    () => transactions.filter((item) => item.type === 'entrada').length,
    [transactions]
  );

  const exitCount = useMemo(
    () => transactions.filter((item) => item.type === 'saida').length,
    [transactions]
  );

  return (
    <main className="main-content">
      <Header />

      <div className="dashboard-actions">
        <button className="btn-add" onClick={() => setModalOpen(true)}>
          + NOVA TRANSAÇÃO
        </button>
      </div>

      <section className="cards-grid">
        {summaryCards.map((card, i) => (
          <SummaryCard key={card.title} index={i + 1} {...card} />
        ))}
      </section>

      <section className="dashboard-grid">
        <ExpensesChart data={monthlyExpenses} />
        <aside className="insight-panel surface">
          <div className="section-heading">
            <div>
              <span className="eyebrow">COCKPIT</span>
              <h2>INDICADORES</h2>
            </div>
          </div>

          <div className="insight-stack">
            <PerformanceDonut income={entryCount} outcome={exitCount} />

            <article className="insight-card insight-card--accent insight-card--metric">
              <span>ECONOMIA</span>
              <strong>{metrics.economiaTaxa.toFixed(1)}%</strong>
              <p>Da receita retida como economia</p>
            </article>

            <article className="insight-card insight-card--metric">
              <span>TICKET MÉDIO</span>
              <strong>R$ {metrics.ticketMedioSaida.toFixed(0)}</strong>
              <p>Média por transação</p>
            </article>

            <article className="insight-split">
              <div>
                <span>ENTRADAS</span>
                <strong>{entryCount}</strong>
              </div>
              <div>
                <span>SAÍDAS</span>
                <strong>{exitCount}</strong>
              </div>
            </article>
          </div>
        </aside>
      </section>

      <Transactions items={filteredTransactions} filter={filter} onFilterChange={setFilter} />

      <AddTransactionModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </main>
  );
}