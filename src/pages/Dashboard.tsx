import { useMemo, useState } from 'react';
import { useFinanceStore } from '../context/store';
import AddTransactionModal from '../components/AddTransactionModal';
import ExpensesChart from '../components/ExpensesChart';
import Header from '../components/Header';
import PerformanceDonut from '../components/PerformanceDonut';
import SummaryCard from '../components/SummaryCard';
import Transactions from '../components/Transactions';

export default function Dashboard() {
  const { filter, setFilter, searchQuery, transactions, summaryCards, monthlyExpenses } = useFinanceStore();
  const [modalOpen, setModalOpen] = useState(false);

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
          + Nova Transação
        </button>
      </div>

      <section className="cards-grid">
        {summaryCards.map((card) => (
          <SummaryCard key={card.title} {...card} />
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
              <p>Reservas atuais sustentam o patamar de custo fixo com margem de segurança.</p>
            </article>

            <article className="insight-card insight-card--metric">
              <span>Movimentos monitorados</span>
              <strong>{filteredTransactions.length}</strong>
              <p>
                {filter === 'all'
                  ? 'Volume consolidado dos registros visíveis no painel.'
                  : 'Volume de registros para o recorte selecionado.'}
              </p>
            </article>

            <article className="insight-split">
              <div>
                <span>Entradas</span>
                <strong>{entryCount}</strong>
              </div>
              <div>
                <span>Saídas</span>
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