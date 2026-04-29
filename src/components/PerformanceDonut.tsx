interface PerformanceDonutProps {
  income: number;
  outcome: number;
}

export default function PerformanceDonut({ income, outcome }: PerformanceDonutProps) {
  const total = Math.max(income + outcome, 1);
  const incomeRatio = income / total;
  const incomeDegrees = incomeRatio * 360;

  return (
    <article className="insight-card performance-card">
      <span>Distribuição do fluxo</span>
      <div className="performance-card__body">
        <div
          className="performance-card__donut"
          style={{
            background: `conic-gradient(var(--accent) 0deg ${incomeDegrees}deg, var(--accent-soft-strong) ${incomeDegrees}deg 360deg)`,
          }}
          role="img"
          aria-label={`Gráfico de pizza: ${Math.round(incomeRatio * 100)}% entradas, ${Math.round(
            (1 - incomeRatio) * 100
          )}% saídas`}
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
            <p>Saídas</p>
            <strong>{outcome}</strong>
          </div>
        </div>
      </div>
    </article>
  );
}