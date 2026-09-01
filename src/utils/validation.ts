import { toISODate } from './money';

export const sanitizeString = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
    .slice(0, 500);
};

export const sanitizeAmount = (input: string | number): number => {
  if (typeof input === 'number') return Number.isFinite(input) ? Math.abs(input) : 0;
  const cleaned = (input || '')
    .replace(/[R$\s]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  const parsed = parseFloat(cleaned);
  return Number.isFinite(parsed) ? Math.abs(parsed) : 0;
};

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const sanitizeDate = (input: string): string => {
  if (!input) return toISODate(new Date());

  const isoMatch = input.match(ISO_DATE_REGEX);
  if (isoMatch) return input;

  const brMatch = input.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (brMatch) {
    const [, d, m, y] = brMatch;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }

  const longMatch = input.match(/^(\d{1,2})\s+([A-Za-zÃ-ü]{3})\.?\s+(\d{4})$/);
  if (longMatch) {
    const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    const monthIndex = MONTHS.indexOf(longMatch[2].toLowerCase());
    if (monthIndex !== -1) {
      const d = String(Number(longMatch[1])).padStart(2, '0');
      const m = String(monthIndex + 1).padStart(2, '0');
      return `${longMatch[3]}-${m}-${d}`;
    }
  }

  return toISODate(new Date());
};

export const formatCurrencyInput = (value: string): string => {
  const numeric = value.replace(/\D/g, '');
  if (!numeric) return '';
  const formatted = (parseInt(numeric, 10) / 100).toFixed(2);
  return formatted.replace('.', ',');
};

export const validateTransaction = (data: {
  name?: string;
  amount?: string;
  date?: string;
}): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.name || sanitizeString(data.name).length < 2) {
    errors.push('Nome deve ter pelo menos 2 caracteres');
  }

  if (!data.amount || sanitizeAmount(data.amount) <= 0) {
    errors.push('Valor deve ser maior que zero');
  }

  if (!data.date) {
    errors.push('Data é obrigatória');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const validateBudget = (data: {
  category: string;
  limit: number;
  spent: number;
}): { valid: boolean; warnings: string[] } => {
  const warnings: string[] = [];
  const percentage = (data.spent / Math.max(data.limit, 1)) * 100;

  if (percentage >= 100) {
    warnings.push(`Orçamento excedido em ${Math.round(percentage - 100)}%`);
  } else if (percentage >= 80) {
    warnings.push(`Orçamento com ${Math.round(100 - percentage)}% restante`);
  }

  return {
    valid: warnings.length === 0,
    warnings,
  };
};