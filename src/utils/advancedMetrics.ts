import { useMemo } from 'react';
import type { Transaction } from '../types';
import { inRange, monthKey, parseAmount } from './money';

interface MetricsResult {
  totalReceita: number;
  totalDespesa: number;
  saldo: number;
  economiaTaxa: number;
  ticketMedioEntrada: number;
  ticketMedioSaida: number;
  despesaFixaPercent: number;
  despesaVariavelPercent: number;
  maiorDespesa: { name: string; value: number } | null;
  menorDespesa: { name: string; value: number } | null;
  categoriaMaisGasta: string | null;
  tendencia: 'alta' | 'baixa' | 'estavel';
  projeçãoProximoMes: number;
  diasSobrevivência: number;
}

export function useAdvancedMetrics(transactions: Transaction[], range: { start: string; end: string } | null = null): MetricsResult {
  return useMemo(() => {
    const entradas = transactions.filter((t) => t.type === 'entrada' && inRange(t.date, range));
    const saidas = transactions.filter((t) => t.type === 'saida' && inRange(t.date, range));

    const totalReceita = entradas.reduce((acc, t) => acc + parseAmount(t.amount), 0);
    const totalDespesa = saidas.reduce((acc, t) => acc + parseAmount(t.amount), 0);

    const saldo = totalReceita - totalDespesa;
    const economiaTaxa = totalReceita > 0 ? (saldo / totalReceita) * 100 : 0;

    const ticketMedioEntrada = entradas.length > 0 ? totalReceita / entradas.length : 0;
    const ticketMedioSaida = saidas.length > 0 ? totalDespesa / saidas.length : 0;

    const categoriasFixas = ['Aluguel', 'Internet', 'Luz', 'Água', 'Telefone', 'Assinaturas', 'Licenças', 'Energia', 'Seguro'];
    const despesaFixa = saidas
      .filter(t => categoriasFixas.some(cat => t.category.toLowerCase().includes(cat.toLowerCase())))
      .reduce((acc, t) => acc + parseAmount(t.amount), 0);

    const despesaFixaPercent = totalDespesa > 0 ? (despesaFixa / totalDespesa) * 100 : 0;
    const despesaVariavelPercent = 100 - despesaFixaPercent;

    const sortedSaidas = [...saidas].sort((a, b) => parseAmount(b.amount) - parseAmount(a.amount));

    const maiorDespesa = sortedSaidas.length > 0
      ? { name: sortedSaidas[0].name, value: parseAmount(sortedSaidas[0].amount) }
      : null;

    const menorDespesa = sortedSaidas.length > 0
      ? { name: sortedSaidas[sortedSaidas.length - 1].name, value: parseAmount(sortedSaidas[sortedSaidas.length - 1].amount) }
      : null;

    const categorySpending: Record<string, number> = {};
    saidas.forEach(t => {
      categorySpending[t.category] = (categorySpending[t.category] || 0) + parseAmount(t.amount);
    });

    const categoriaMaisGasta = Object.entries(categorySpending)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    const byMonth = new Map<string, number>();
    saidas.forEach(t => {
      const key = monthKey(t.date);
      byMonth.set(key, (byMonth.get(key) || 0) + parseAmount(t.amount));
    });
    const monthlyValues = [...byMonth.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([, v]) => v);

    const tendencia = (() => {
      if (monthlyValues.length < 3) return 'estavel';
      const half = Math.floor(monthlyValues.length / 2);
      const first = monthlyValues.slice(0, half).reduce((a, b) => a + b, 0) / half;
      const second = monthlyValues.slice(half).reduce((a, b) => a + b, 0) / Math.max(monthlyValues.length - half, 1);
      const delta = (second - first) / Math.max(first, 1);
      if (delta > 0.1) return 'alta';
      if (delta < -0.1) return 'baixa';
      return 'estavel';
    })();

    const médiaMensal = totalDespesa / Math.max(monthlyValues.length, 1);
    const projeçãoProximoMes = Math.round(médiaMensal);

    const custoDiárioMédia = totalDespesa / 30;
    const diasSobrevivência = custoDiárioMédia > 0 ? Math.round(saldo / custoDiárioMédia) : 0;

    return {
      totalReceita,
      totalDespesa,
      saldo,
      economiaTaxa,
      ticketMedioEntrada,
      ticketMedioSaida,
      despesaFixaPercent,
      despesaVariavelPercent,
      maiorDespesa,
      menorDespesa,
      categoriaMaisGasta,
      tendencia,
      projeçãoProximoMes,
      diasSobrevivência,
    };
  }, [transactions, range]);
}

export const formatNumber = (value: number, decimals = 2): string => {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};