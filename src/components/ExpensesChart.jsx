function buildLinePath(points) {
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
}

export default function ExpensesChart({ data }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <section className="chart surface">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Analise mensal</span>
            <h2>Despesas por mes</h2>
          </div>
        </div>
        <p>Nao foi possivel carregar o grafico.</p>
      </section>
    );
  }

  const width = 760;
  const height = 360;
  const paddingX = 32;
  const top = 28;
  const bottom = 52;
  const maxValue = Math.max(...data.map((item) => item.value));
  const points = data.map((item, index) => {
    const x = paddingX + (index * (width - paddingX * 2)) / Math.max(data.length - 1, 1);
    const y = top + ((maxValue - item.value) / maxValue) * (height - top - bottom);
    return { ...item, x, y };
  });
  const linePath = buildLinePath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - bottom} L ${points[0].x} ${
    height - bottom
  } Z`;

  return (
    <section className="chart surface">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Analise de custos</span>
          <h2>Evolucao de despesas por periodo</h2>
        </div>
        <span className="chart__legend">Ultimos 6 meses</span>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="chart__svg" role="img" aria-label="Grafico de linha e barras com despesas mensais">
        <defs>
          <linearGradient id="expenseArea" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="expenseBar" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.95" />
            <stop offset="100%" stopColor="var(--accent-soft-strong)" stopOpacity="0.82" />
          </linearGradient>
        </defs>

        {[0, 1, 2, 3, 4].map((step) => {
          const y = top + (step * (height - top - bottom)) / 4;
          return <line key={step} x1={paddingX} y1={y} x2={width - paddingX} y2={y} className="chart__grid" />;
        })}

        <path d={areaPath} className="chart__area" />

        {points.map((point) => {
          const barHeight = height - bottom - point.y;
          return (
            <g key={point.month}>
              <rect
                x={point.x - 28}
                y={point.y}
                width="56"
                height={barHeight}
                rx="10"
                className="chart__bar"
              />
              <text x={point.x} y={point.y - 10} textAnchor="middle" className="chart__value-label">
                R$ {point.value}
              </text>
              <text x={point.x} y={height - 18} textAnchor="middle" className="chart__label">
                {point.month}
              </text>
            </g>
          );
        })}

        <path d={linePath} className="chart__line" />

        {points.map((point) => (
          <circle key={`${point.month}-point`} cx={point.x} cy={point.y} r="5.5" className="chart__point" />
        ))}
      </svg>
    </section>
  );
}
