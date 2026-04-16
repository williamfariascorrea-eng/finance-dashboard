function buildPath(points) {
  return points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');
}

export default function ExpensesChart({ data }) {
  if (!Array.isArray(data) || data.length < 2) {
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

  const width = 560;
  const height = 260;
  const padding = 24;
  const maxValue = Math.max(...data.map((item) => item.value));
  const points = data.map((item, index) => {
    const x = padding + (index * (width - padding * 2)) / (data.length - 1);
    const y = height - padding - (item.value / maxValue) * (height - padding * 2);
    return { ...item, x, y };
  });

  const linePath = buildPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${
    height - padding
  } Z`;

  return (
    <section className="chart surface">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Analise mensal</span>
          <h2>Despesas por mes</h2>
        </div>
        <span className="chart__legend">Ultimos 6 meses</span>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="chart__svg" role="img" aria-label="Grafico de despesas">
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.38" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {[0, 1, 2, 3].map((step) => {
          const y = padding + (step * (height - padding * 2)) / 3;
          return <line key={step} x1={padding} x2={width - padding} y1={y} y2={y} className="chart__grid" />;
        })}

        <path d={areaPath} className="chart__area" />
        <path d={linePath} className="chart__line" />

        {points.map((point) => (
          <g key={point.month}>
            <circle cx={point.x} cy={point.y} r="5" className="chart__point" />
            <text x={point.x} y={height - 4} textAnchor="middle" className="chart__label">
              {point.month}
            </text>
          </g>
        ))}
      </svg>
    </section>
  );
}
