export default function Transactions({ items, filter, onFilterChange }) {
  const filters = [
    { label: 'Todos', value: 'all' },
    { label: 'Entrada', value: 'entrada' },
    { label: 'Saida', value: 'saida' },
  ];

  return (
    <section className="transactions surface">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Ledger vivo</span>
          <h2>Movimentos recentes</h2>
        </div>

        <div className="filter-group">
          {filters.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`filter-chip ${filter === option.value ? 'is-active' : ''}`}
              onClick={() => onFilterChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="transactions__list">
        {(Array.isArray(items) ? items : []).map((item) => (
          <article key={item.id} className="transaction-row">
            <div className="transaction-row__avatar">{item.name.slice(0, 2).toUpperCase()}</div>
            <div className="transaction-row__content">
              <strong>{item.name}</strong>
              <span>{item.category}</span>
            </div>
            <span className={`transaction-row__type ${item.type}`}>{item.type}</span>
            <strong className={`transaction-row__amount ${item.type}`}>{item.amount}</strong>
            <time>{item.date}</time>
          </article>
        ))}
      </div>
    </section>
  );
}
