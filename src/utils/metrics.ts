import type { MonthlyExpense, SummaryCard, Transaction } from '../types';
import { formatBRL, inRange, monthKey, monthLabel, parseAmount } from './money';

export interface Totals {
  receita: number;
  despesa: number;
  saldo: number;
  countEntrada: number;
  countSaida: number;
  economia: number;
}

export function sumTotals(transactions: Transaction[], range: { start: string; end: string } | null = null): Totals {
  let receita = 0;
  let despesa = 0;
  let countEntrada = 0;
  let countSaida = 0;

  transactions.forEach((t) => {
    if (!inRange(t.date, range)) return;
    const value = parseAmount(t.amount);
    if (t.type === 'entrada') {
      receita += value;
      countEntrada += 1;
    } else {
      despesa += value;
      countSaida += 1;
    }
  });

  const saldo = receita - despesa;

  return {
    receita,
    despesa,
    saldo,
    countEntrada,
    countSaida,
    economia: receita > 0 ? (saldo / receita) * 100 : 0,
  };
}

export function buildSummaryCards(transactions: Transaction[], range: { start: string; end: string } | null = null): SummaryCard[] {
  const totals = sumTotals(transactions, range);

  const reservaChange = totals.receita > 0
    ? `${totals.economia.toFixed(1)}% da receita retida no período`
    : 'Sem receitas no período';

  const tickets = {
    entrada: totals.countEntrada ? totals.receita / totals.countEntrada : 0,
    saida: totals.countSaida ? totals.despesa / totals.countSaida : 0,
  };

  return [
    {
      title: 'Saldo do período',
      value: formatBRL(totals.saldo),
      change: reservaChange,
      tone: totals.saldo >= 0 ? 'positive' : 'negative',
    },
    {
      title: 'Receitas',
      value: formatBRL(totals.receita),
      change: `${totals.countEntrada} entradas · ticket médio ${formatBRL(tickets.entrada)}`,
      tone: 'positive',
    },
    {
      title: 'Despesas',
      value: formatBRL(totals.despesa),
      change: `${totals.countSaida} saídas · ticket médio ${formatBRL(tickets.saida)}`,
      tone: totals.despesa > 0 ? 'negative' : 'positive',
    },
  ];
}

export function buildMonthlyExpenses(transactions: Transaction[], range: { start: string; end: string } | null = null, lastN = 6): MonthlyExpense[] {
  const byMonth = new Map<string, number>();

  transactions.forEach((t) => {
    if (t.type !== 'saida' || !inRange(t.date, range)) return;
    const key = monthKey(t.date);
    byMonth.set(key, (byMonth.get(key) || 0) + parseAmount(t.amount));
  });

  const sortedKeys = [...byMonth.keys()].sort();
  const filtered = range ? sortedKeys : sortedKeys.slice(-lastN);

  return filtered.map((key) => ({
    month: monthLabel(key),
    value: Math.round(byMonth.get(key) as number),
  }));
}