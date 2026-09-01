export const MONTHS_PT = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
] as const;

const CURRENCY_FORMATTER = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function parseAmount(value: string | number): number {
  if (typeof value === 'number') return value;

  const cleaned = value.replace(/[R$\s]/g, '').replace('.', '').replace(',', '.');
  const parsed = parseFloat(cleaned);
  return Number.isFinite(parsed) ? Math.abs(parsed) : 0;
}

export function formatBRL(value: number): string {
  return CURRENCY_FORMATTER.format(value);
}

export function formatSigned(type: 'entrada' | 'saida', value: number): string {
  return `${type === 'saida' ? '-' : '+'}${formatBRL(value)}`;
}

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function monthKey(isoDate: string): string {
  return isoDate.slice(0, 7);
}

export function monthLabel(key: string): string {
  const month = parseInt(key.slice(5, 7), 10);
  if (Number.isFinite(month) && month >= 1 && month <= 12) return MONTHS_PT[month - 1];
  return key;
}

export function formatDatePt(isoDate: string): string {
  const [, m, d] = isoDate.split('-');
  return `${d}/${m}`;
}

export function inRange(isoDate: string, range: { start: string; end: string } | null): boolean {
  if (!range) return true;
  return isoDate >= range.start && isoDate <= range.end;
}