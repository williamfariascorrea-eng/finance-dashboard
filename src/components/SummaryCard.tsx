import type { SummaryCard as SummaryCardType } from '../types';

interface SummaryCardProps extends SummaryCardType {
  index: number;
}

export default function SummaryCard({ index, title, value, change, tone }: SummaryCardProps) {
  return (
    <article className="summary-card card surface">
      <div className="summary-card__top">
        <span>{title}</span>
        <div className={`summary-card__badge ${tone}`}>0{index}</div>
      </div>
      <strong>{value}</strong>
      <p className={tone}>{change}</p>
    </article>
  );
}