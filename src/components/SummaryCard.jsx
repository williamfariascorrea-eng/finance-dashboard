export default function SummaryCard({ title, value, change, tone }) {
  return (
    <article className="summary-card card surface">
      <div className="summary-card__top">
        <span>{title}</span>
        <div className={`summary-card__badge ${tone}`}>{tone === 'positive' ? 'up' : 'down'}</div>
      </div>
      <strong>{value}</strong>
      <p className={tone}>{change}</p>
    </article>
  );
}
