import { useMemo, useState } from 'react';
import { useFinanceStore } from '../context/store';
import { useAdvancedMetrics } from '../utils/advancedMetrics';
import { buildMonthlyExpenses, buildSummaryCards, sumTotals } from '../utils/metrics';
import AddTransactionModal from '../components/AddTransactionModal';
import ExpensesChart from '../components/ExpensesChart';
import Header from '../components/Header';
import PerformanceDonut from '../components/PerformanceDonut';
import SummaryCard from '../components/SummaryCard';
import Transactions from '../components/Transactions';
import { formatBRL } from '../utils/money';

export default function Dashboard() {
  const { filter, setFilter, searchQuery, transactions, dateFilter } = useFinanceStore();
  const [modalOpen, setModalOpen] = useState(false);

  const metrics = useAdvancedMetrics(transactions, dateFilter);

  const summaryCards = useMemo(
    () => buildSummaryCards(transactions, dateFilter),
    [transactions, dateFilter]
  );

  const monthlyExpenses = useMemo(
    () => buildMonthlyExpenses(transactions, dateFilter),
    [transactions, dateFilter]
  );

  const filteredTransactions = useMemo(() => {
    let result = transactions;

    if (filter !== 'all') {
      result = result.filter((item) => item.type === filter);
    }

    if (dateFilter) {
      result = result.filter(
        (item) => item.date >= dateFilter.start && item.date <= dateFilter.end
      );
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
  }, [filter, searchQuery, transactions, dateFilter]);

  const donutTotals = useMemo(() => {
    const totals = sumTotals(transactions, dateFilter);
    return { income: totals.receita, outcome: totals.despesa };
  }, [transactions, dateFilter]);

  return (
    <main className="main-content">
      <Header />

      <div className="dashboard-actions">
        <button className="btn-add" onClick={() => setModalOpen(true)} aria-label="Adicionar nova transação">
          + NOVA TRANSAÇÃO
        </button>
      </div>

      <section className="cards-grid" aria-label="Resumo financeiro">
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
            <PerformanceDonut income={donutTotals.income} outcome={donutTotals.outcome} />

            <article className="insight-card insight-card--accent insight-card--metric">
              <span>ECONOMIA</span>
              <strong>{metrics.economiaTaxa.toFixed(1)}%</strong>
              <p>Da receita retida como reserva no período</p>
            </article>

            <article className="insight-card insight-card--metric">
              <span>RUNWAY</span>
              <strong>{metrics.diasSobrevivência} dias</strong>
              <p>Quanto o caixa sustenta sem novas entradas</p>
            </article>

            <article className="insight-split">
              <div>
                <span>ENTRADAS</span>
                <strong>{formatBRL(metrics.totalReceita)}</strong>
              </div>
              <div>
                <span>SAÍDAS</span>
                <strong>{formatBRL(metrics.totalDespesa)}</strong>
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