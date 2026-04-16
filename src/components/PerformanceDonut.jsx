export default function PerformanceDonut({ income, outcome }) {
  const total = Math.max(income + outcome, 1);
  const incomeRatio = income / total;
  const incomeDegrees = incomeRatio * 360;

  return (
    <article className="insight-card performance-card">
      <span>Distribuicao do fluxo</span>
      <div className="performance-card__body">
        <div
          className="performance-card__donut"
          style={{
            background: `conic-gradient(var(--accent) 0deg ${incomeDegrees}deg, var(--accent-soft-strong) ${incomeDegrees}deg 360deg)`,
          }}
        >
          <div className="performance-card__center">
            <strong>{Math.round(incomeRatio * 100)}%</strong>
            <small>entrada</small>
          </div>
        </div>

        <div className="performance-card__legend">
          <div>
            <span className="performance-card__swatch performance-card__swatch--income" />
            <p>Entradas</p>
            <strong>{income}</strong>
          </div>
          <div>
            <span className="performance-card__swatch performance-card__swatch--outcome" />
            <p>Saidas</p>
            <strong>{outcome}</strong>
          </div>
        </div>
      </div>
    </article>
  );
}
