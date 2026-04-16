import { useState } from 'react';
import ExpensesChart from '../components/ExpensesChart';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import SummaryCard from '../components/SummaryCard';
import Transactions from '../components/Transactions';
import { monthlyExpenses, summaryCards, transactions } from '../data/mockData';

export default function Dashboard({ theme, onToggleTheme }) {
  const [filter, setFilter] = useState('all');

  const filteredTransactions =
    filter === 'all' ? transactions : transactions.filter((item) => item.type === filter);

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-content">
        <Header theme={theme} onToggleTheme={onToggleTheme} />

        <section className="cards-grid">
          {summaryCards.map((card) => (
            <SummaryCard key={card.title} {...card} />
          ))}
        </section>

        <section className="dashboard-grid">
          <ExpensesChart data={monthlyExpenses} />
          <Transactions items={filteredTransactions} filter={filter} onFilterChange={setFilter} />
        </section>
      </main>
    </div>
  );
}
