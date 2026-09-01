import type { Transaction } from '../types';
import { formatDatePt, formatSigned } from '../utils/money';

interface TransactionsProps {
  items: Transaction[];
  filter: 'all' | 'entrada' | 'saida';
  onFilterChange: (filter: 'all' | 'entrada' | 'saida') => void;
}

const filters = [
  { label: 'Todos', value: 'all' },
  { label: 'Entrada', value: 'entrada' },
  { label: 'Saída', value: 'saida' },
];

export default function Transactions({ items, filter, onFilterChange }: TransactionsProps) {
  return (
    <section className="transactions surface" aria-label="Transações">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Ledger vivo</span>
          <h2>Movimentos recentes</h2>
        </div>

        <div className="filter-group" role="group" aria-label="Filtrar transações">
          {filters.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`filter-chip ${filter === option.value ? 'is-active' : ''}`}
              onClick={() => onFilterChange(option.value as 'all' | 'entrada' | 'saida')}
              aria-pressed={filter === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="transactions__list" role="list">
        {(Array.isArray(items) ? items : []).map((item) => (
          <article key={item.id} className="transaction-row" role="listitem">
            <div className="transaction-row__avatar" aria-hidden="true">
              {item.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="transaction-row__content">
              <strong>{item.name}</strong>
              <span>{item.category}</span>
            </div>
            <span className={`transaction-row__type ${item.type}`}>{item.type}</span>
            <strong className={`transaction-row__amount ${item.type}`}>
              {formatSigned(item.type, item.amount)}
            </strong>
            <time dateTime={item.date}>{formatDatePt(item.date)}</time>
          </article>
        ))}
      </div>
    </section>
  );
}